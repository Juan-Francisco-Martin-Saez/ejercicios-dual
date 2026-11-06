"""Pruebas sin GPU: autenticación, validaciones, formato de request y parsing SSE.

Desde la raiz: OCR_API_KEY=test-secret-123... pytest -q
"""
import io
import os
import sys
import types

os.environ["OCR_API_KEY"] = "test-secret-de-mas-de-32-caracteres"

import fitz
import pytest
from fastapi.testclient import TestClient
from PIL import Image

from gateway import app as gateway

client = TestClient(gateway.app)
TOKEN = {"Authorization": "Bearer test-secret-de-mas-de-32-caracteres"}


def test_no_token():
    assert client.get("/health").status_code == 401


def test_bad_token():
    assert client.get("/health", headers={"Authorization": "Bearer incorrecto"}).status_code == 403


def test_health():
    assert client.get("/health", headers=TOKEN).json()["status"] == "gateway_running"


def test_empty_file():
    result = client.post("/ocr", headers=TOKEN, files={"file": ("empty.pdf", b"", "application/pdf")})
    assert result.status_code == 422


def test_unsupported_file():
    result = client.post("/ocr", headers=TOKEN, files={"file": ("bad.txt", b"hola", "text/plain")})
    assert result.status_code == 415


def test_real_pdf():
    pdf = fitz.open()
    pdf.new_page().insert_text((72, 72), "hola")
    data = pdf.tobytes()
    pdf.close()
    pages = gateway.document_images(data, 150)
    assert len(pages) == 1 and pages[0].startswith(b"\xff\xd8")


def test_real_png():
    out = io.BytesIO()
    Image.new("RGB", (20, 20), "white").save(out, format="PNG")
    pages = gateway.document_images(out.getvalue(), 150)
    assert len(pages) == 1 and pages[0].startswith(b"\xff\xd8")


def test_payload(monkeypatch):
    package_names = [
        "sglang", "sglang.srt", "sglang.srt.sampling", "sglang.srt.sampling.custom_logit_processor"
    ]
    for module_name in package_names:
        monkeypatch.setitem(sys.modules, module_name, types.ModuleType(module_name))
    p = sys.modules[package_names[-1]]
    class Stub:
        @staticmethod
        def to_str():
            return "n_gram_processor"
    p.DeepseekOCRNoRepeatNGramLogitProcessor = Stub
    data = gateway.build_payload([b"uno", b"dos"], False, 1000)
    assert data["max_tokens"] == 2000
    assert data["messages"][0]["content"][-1]["text"] == "<PAGE><image><PAGE><image>Multi page parsing."
    assert data["custom_logit_processor"] == "n_gram_processor"
    assert data["stream"] is True


def test_mocked_inference(monkeypatch):
    monkeypatch.setattr(gateway, "build_payload", lambda pages, crop, tokens: {"fake": "payload"})
    monkeypatch.setattr(gateway, "infer", lambda payload: "<PAGE>texto de prueba")
    out = io.BytesIO()
    Image.new("RGB", (20, 20), "white").save(out, format="PNG")
    res = client.post("/ocr", headers=TOKEN, files={"file": ("t.png", out.getvalue(), "image/png")})
    assert res.status_code == 200, res.text
    assert res.json()["pages"] == 1
    assert "texto de prueba" in res.json()["text"]
