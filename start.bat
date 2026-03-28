@echo off
echo.
echo === Wealth Tracker - Iniciando... ===
echo.

echo [1/3] Instalando dependencias Python...
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo ERROR: Fallo la instalacion de Python. Asegurate de tener Python instalado.
    pause
    exit /b 1
)

echo.
echo [2/3] Compilando el frontend...
cd frontend
call npm install
call npm run build
cd ..
if errorlevel 1 (
    echo ERROR: Fallo la compilacion del frontend. Asegurate de tener Node.js instalado.
    pause
    exit /b 1
)

echo.
echo [3/3] Iniciando el servidor...
echo.
echo ============================================
echo   Abre tu navegador en: http://localhost:8000
echo ============================================
echo.
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
pause
