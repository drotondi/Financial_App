#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Instalando dependencias del backend..."
pip install -r "$ROOT/backend/requirements.txt" -q

echo "==> Instalando dependencias del frontend..."
cd "$ROOT/frontend" && npm install --silent

echo "==> Compilando el frontend..."
npm run build --silent

echo ""
echo "✓ Listo. Iniciando servidor en http://localhost:8000"
echo ""
cd "$ROOT" && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
