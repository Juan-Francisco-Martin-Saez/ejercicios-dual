#!/usr/bin/env bash
set -euo pipefail
# Uso: ./scripts/build-push.sh USUARIO_DOCKERHUB runtime
#      ./scripts/build-push.sh USUARIO_DOCKERHUB baked
USER_NAME="${1:?Falta nombre de usuario de Docker Hub}"
VARIANT="${2:-runtime}"
case "$VARIANT" in
  runtime) BAKE=0 ;;
  baked) BAKE=1 ;;
  *) echo 'Variante no válida: runtime o baked' >&2; exit 1 ;;
esac
TAG="${USER_NAME}/unlimited-ocr2-vast:${VARIANT}"
docker buildx build --platform linux/amd64 --build-arg "BAKE_WEIGHTS=$BAKE" -t "$TAG" --push .
echo "Publicado: $TAG"
