# Unlimited-OCR-2 + SGLang personalizado por Baidu + API FastAPI con token.
# Construye dos variantes: BAKE_WEIGHTS=0 (ligera), BAKE_WEIGHTS=1 (pesos integrados).
# La compilacion y la ejecucion sobre GPU real deben verificarse en Vast.ai.
FROM nvidia/cuda:12.8.1-devel-ubuntu22.04

ARG DEBIAN_FRONTEND=noninteractive
ARG BAKE_WEIGHTS=0
ARG BAIDU_GIT_REF=main

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HF_HOME=/models/hf \
    OCR_MODEL_ID=baidu/Unlimited-OCR-2 \
    SGLANG_URL=http://127.0.0.1:10000 \
    OCR_PORT=10001 \
    MAX_UPLOAD_MB=25 \
    MAX_PAGES=12 \
    DEFAULT_DPI=200 \
    MAX_OUTPUT_TOKENS=48000 \
    SGLANG_MEM_FRACTION_STATIC=0.70 \
    SGLANG_MAX_RUNNING_REQUESTS=4 \
    SGLANG_UOCR_EANABLE_DOC_LIMIT=1 \
    SGLANG_UOCR_DOC_GUNDAM_PAGE_WINDOW=10 \
    SGLANG_UOCR_DOC_BASE_PAGE_WINDOW=10 \
    SGLANG_UOCR_MAX_PAGE_TOKENS=20000 \
    SGLANG_OPT_UOCR_SAM_REL_POS_BIAS_MB=64 \
    SGLANG_UOCR_SHM_WRAP_MODEL_DATA=1 \
    SGLANG_UOCR_SHM_WRAP_MIN_MB=1 \
    SGLANG_VLM_CACHE_SIZE_MB=0 \
    PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True

RUN apt-get update && apt-get install -y --no-install-recommends \
        python3 python3-dev python3-pip git git-lfs ca-certificates \
        curl tini libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/* \
    && python3 -m pip install --no-cache-dir --upgrade pip setuptools wheel

# Wheel MODIFICADO de Baidu: NO sustituir por pip install sglang generico.
RUN GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 https://github.com/baidu/Unlimited-OCR.git /tmp/unlimited-ocr-upstream \
    && cd /tmp/unlimited-ocr-upstream \
    && GIT_LFS_SKIP_SMUDGE=1 git fetch --depth 1 origin "${BAIDU_GIT_REF}" \
    && GIT_LFS_SKIP_SMUDGE=1 git checkout FETCH_HEAD \
    && git lfs pull --include="wheel/*.whl" --exclude="" \
    && python3 -m pip install --no-cache-dir \
         ./wheel/sglang-0.5.20.dev13+g75b9b06b02-py3-none-any.whl \
    && python3 -m pip install --no-cache-dir \
         fastokens==0.3.2 \
         pymupdf==1.27.2.2 \
         'huggingface-hub>=0.36,<2' \
    && rm -rf /tmp/unlimited-ocr-upstream

WORKDIR /app
COPY gateway/requirements.txt /app/gateway/requirements.txt
RUN python3 -m pip install --no-cache-dir -r /app/gateway/requirements.txt
COPY gateway /app/gateway
COPY scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh && mkdir -p /models/hf /opt/models/Unlimited-OCR-2

# Variante con pesos en la propia imagen (imagen de mayor tamaño y mas lenta de subir/pullar).
RUN if [ "${BAKE_WEIGHTS}" = "1" ]; then \
      python3 -c 'from huggingface_hub import snapshot_download; snapshot_download("baidu/Unlimited-OCR-2", local_dir="/opt/models/Unlimited-OCR-2")'; \
    fi

EXPOSE 10001/tcp
ENTRYPOINT ["/usr/bin/tini","--","/app/start.sh"]
