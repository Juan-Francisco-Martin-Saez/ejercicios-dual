#!/usr/bin/env bash
set -Eeuo pipefail

: "${OCR_API_KEY:?Falta OCR_API_KEY. Configura un secreto de al menos 32 caracteres.}"

if [[ -f /opt/models/Unlimited-OCR-2/config.json ]]; then
  MODEL_PATH=/opt/models/Unlimited-OCR-2
else
  MODEL_PATH="${OCR_MODEL_ID:-baidu/Unlimited-OCR-2}"
fi

# El backend de inferencia escucha SOLO en loopback. Unicamente el gateway es publico.
python3 -m sglang.launch_server \
  --model-path "$MODEL_PATH" \
  --served-model-name Unlimited-OCR-2 \
  --chat-template unlimited-ocr \
  --tokenizer-backend fastokens \
  --tokenizer-worker-num 4 \
  --mem-fraction-static "${SGLANG_MEM_FRACTION_STATIC:-0.7}" \
  --max-running-requests "${SGLANG_MAX_RUNNING_REQUESTS:-4}" \
  --max-prefill-tokens 2048 \
  --enable-custom-logit-processor \
  --enable-streaming-session \
  --allow-auto-truncate \
  --disable-radix-cache \
  --mm-preprocess-cache-size-mb 0 \
  --cuda-graph-backend-decode full --cuda-graph-max-bs-decode 4 \
  --cuda-graph-backend-prefill full \
  --cuda-graph-max-bs-prefill 16384 \
  --cuda-graph-bs-prefill 1024 2048 \
  --cuda-graph-config '{"prefill": {"backend": "full", "full_prefill_max_req": 4}}' \
  --host 127.0.0.1 --port 10000 &
MODEL_PID=$!

python3 -m uvicorn gateway.app:app \
  --host 0.0.0.0 --port "${OCR_PORT:-10001}" --workers 1 &
API_PID=$!

shutdown() {
  kill "$MODEL_PID" "$API_PID" 2>/dev/null || true
  wait "$MODEL_PID" "$API_PID" 2>/dev/null || true
}
trap shutdown EXIT SIGINT SIGTERM
wait -n "$MODEL_PID" "$API_PID"
