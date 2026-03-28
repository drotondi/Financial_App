@echo off
echo.
echo === Wealth Tracker - Iniciando... ===
echo.

echo [1/2] Instalando dependencias Python...
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: No se pudo instalar Python o sus dependencias.
    echo Asegurate de tener Python instalado. Ver instrucciones en README.md
    pause
    exit /b 1
)

echo.
echo [2/2] Iniciando el servidor...
echo.
echo ============================================
echo   Abre tu navegador en: http://localhost:8000
echo ============================================
echo.
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
pause
