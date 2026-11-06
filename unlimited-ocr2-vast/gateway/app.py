"""Pasarela autenticada para Unlimited-OCR-2 (SGLang personalizado).

La respuesta 'text' contiene la salida textual bruta del modelo, incluyendo posibles
marcadores <PAGE>. No genera JSON de productos ni normaliza tablas por sí sola.
"""
from __future__ import annotations

import asyncio
import base64
import hmac
import io
import json
import logging
import os
import time
from typing import Annotated

import fitz
import requests
from PIL import Image, UnidentifiedImageError
from fastapi import Depends, FastAPI, File, Form, Header, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

log = logging.getLogger("ocr-gateway")
logging.basicConfig(level=logging.INFO)

OCR_API_KEY = os.environ.get("OCR_API_KEY", "")
SGLANG_URL = os.environ.get("SGLANG_URL", "http://127.0.0.1:10000").rstrip("/")
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_MB", "25")) * 1024 * 1024
MAX_PAGES = int(os.environ.get("MAX_PAGES", "12"))
DEFAULT_DPI = int(os.environ.get("DEFAULT_DPI", "200"))
MAX_OUTPUT_TOKENS = int(os.environ.get("MAX_OUTPUT_TOKENS", "48000"))

app = FastAPI(title="Unlimited-OCR-2 Gateway", docs_url=None, redoc_url=None, openapi_url=None)
# Una única inferencia por instancia por defecto: evita picos de VRAM por peticiones paralelas.
_gpu_lock = asyncio.Lock()


def authorize(authorization: Annotated[str | None, Header()] = None) -> None:
    if not OCR_API_KEY:
        raise HTTPException(status_code=503, detail="OCR_API_KEY sin configurar")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Se requiere Authorization: Bearer <token>")
    token = authorization.removeprefix("Bearer ")
    if not hmac.compare_digest(token, OCR_API_KEY):
        raise HTTPException(status_code=403, detail="Token no válido")


@app.get("/health")
def health(_: None = Depends(authorize)) -> dict:
    return {"status": "gateway_running"}


@app.get("/ready")
def ready(_: None = Depends(authorize)) -> dict:
    try:
        # /v1/models no responde hasta estar el backend completamente inicializado.
        response = requests.get(f"{SGLANG_URL}/v1/models", timeout=3)
        response.raise_for_status()
        models = response.json().get("data", [])
        if not any(item.get("id") == "Unlimited-OCR-2" for item in models):
            raise ValueError("Modelo no anunciado por el backend")
    except (requests.RequestException, ValueError) as exc:
        raise HTTPException(status_code=503, detail="Modelo cargándose o no disponible") from exc
    return {"status": "ready", "model": "Unlimited-OCR-2"}


def document_images(blob: bytes, dpi: int) -> list[bytes]:
    """Convierte un PDF o imagen en JPGs en memoria con límites de páginas y píxeles."""
    if blob.startswith(b"%PDF"):
        try:
            document = fitz.open(stream=blob, filetype="pdf")
        except Exception as exc:
            raise HTTPException(status_code=422, detail="PDF ilegible") from exc
        try:
            if document.needs_pass:
                raise HTTPException(status_code=422, detail="PDF cifrado no admitido")
            if not 1 <= len(document) <= MAX_PAGES:
                raise HTTPException(status_code=413, detail=f"Se admiten de 1 a {MAX_PAGES} páginas")
            rendered = []
            matrix = fitz.Matrix(dpi / 72.0, dpi / 72.0)
            for page in document:
                # Limite preventivo: PDF desmesurado, páginas gigantes o bomb zip.
                estimated_pixels = page.rect.width * page.rect.height * (dpi / 72.0) ** 2
                if estimated_pixels > 32_000_000:
                    raise HTTPException(status_code=413, detail="Página demasiado grande")
                pixmap = page.get_pixmap(matrix=matrix, colorspace=fitz.csRGB, alpha=False)
                with Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples) as image:
                    buffer = io.BytesIO()
                    image.save(buffer, format="JPEG", quality=85)
                    rendered.append(buffer.getvalue())
            return rendered
        finally:
            document.close()

    # Admitir JPG/PNG/WebP; convertir a JPG para la API del modelo.
    try:
        with Image.open(io.BytesIO(blob)) as image:
            if image.width * image.height > 32_000_000:
                raise HTTPException(status_code=413, detail="Imagen demasiado grande")
            image.load()
            with image.convert("RGB") as converted:
                buffer = io.BytesIO()
                converted.save(buffer, format="JPEG", quality=90)
                return [buffer.getvalue()]
    except (UnidentifiedImageError, OSError) as exc:
        raise HTTPException(status_code=415, detail="Solo se admiten PDF, JPG, PNG o WebP") from exc


def build_payload(images: list[bytes], crop_mode: bool, tokens_per_page: int) -> dict:
    # La clase oficial forma parte de la instalación personalizada de SGLang.
    from sglang.srt.sampling.custom_logit_processor import DeepseekOCRNoRepeatNGramLogitProcessor

    content = [
        {"type": "image_url", "image_url": {"url": "data:image/jpeg;base64," + base64.b64encode(image).decode("ascii")}}
        for image in images
    ]
    content.append({"type": "text", "text": "<PAGE><image>" * len(images) + "Multi page parsing."})
    return {
        "model": "Unlimited-OCR-2",
        "messages": [{"role": "user", "content": content}],
        "max_tokens": min(tokens_per_page * len(images), MAX_OUTPUT_TOKENS),
        "temperature": 0,
        "skip_special_tokens": False,
        "images_config": {"crop_mode": crop_mode},
        "custom_logit_processor": DeepseekOCRNoRepeatNGramLogitProcessor.to_str(),
        "custom_params": {
            "ngram_size": 35,
            "window_size": 1024 if len(images) > 1 else 128,
            "page_token_id": 128827,
            "eos_token_id": 1,
            "max_page_tokens": 20000,
        },
        "stream": True,
    }


def infer(payload: dict) -> str:
    chunks: list[str] = []
    session = requests.Session()
    session.trust_env = False
    try:
        with session.post(
            f"{SGLANG_URL}/v1/chat/completions",
            json=payload,
            timeout=(15, 3600),
            stream=True,
        ) as response:
            response.raise_for_status()
            for line in response.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data:"):
                    continue
                raw = line.split(":", 1)[1].strip()
                if raw == "[DONE]":
                    break
                if not raw:
                    continue
                event = json.loads(raw)
                if event.get("error"):
                    raise RuntimeError("El backend SGLang devolvió un error")
                for choice in event.get("choices") or []:
                    delta = choice.get("delta") or {}
                    if delta.get("content"):
                        chunks.append(delta["content"])
    finally:
        session.close()
    return "".join(chunks)


@app.post("/ocr")
async def ocr(
    file: Annotated[UploadFile, File(description="Un PDF o una imagen")],
    dpi: Annotated[int, Form(ge=96, le=300)] = DEFAULT_DPI,
    crop_mode: Annotated[bool, Form()] = True,
    tokens_per_page: Annotated[int, Form(ge=256, le=12000)] = 4000,
    _: None = Depends(authorize),
) -> dict:
    started = time.perf_counter()
    # Lectura incremental; no confiar exclusivamente en Content-Length.
    blob = bytearray()
    while chunk := await file.read(1024 * 1024):
        blob.extend(chunk)
        if len(blob) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Archivo demasiado grande")
    await file.close()
    if not blob:
        raise HTTPException(status_code=422, detail="Archivo vacío")
    images = await run_in_threadpool(document_images, bytes(blob), dpi)
    try:
        payload = await run_in_threadpool(build_payload, images, crop_mode, tokens_per_page)
    except ImportError as exc:
        log.exception("Falta la extensión de SGLang personalizada")
        raise HTTPException(status_code=503, detail="SGLang no está configurado") from exc
    # Un lock por proceso; --workers 1 en el arranque.
    async with _gpu_lock:
        try:
            text = await run_in_threadpool(infer, payload)
        except (requests.RequestException, RuntimeError, json.JSONDecodeError) as exc:
            log.exception("Fallo de inferencia")
            raise HTTPException(status_code=502, detail="Error de inferencia, revisar logs") from exc
    return {
        "model": "Unlimited-OCR-2",
        "pages": len(images),
        "elapsed_ms": int((time.perf_counter() - started) * 1000),
        "text": text,
    }
