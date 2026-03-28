@echo off
echo.
echo === Wealth Tracker - Iniciando... ===
echo.

REM Buscar Python 3.11 especificamente (py launcher)
set PYTHON_CMD=
py -3.11 --version >nul 2>&1
if not errorlevel 1 (
    set PYTHON_CMD=py -3.11
) else (
    python --version 2>&1 | findstr /C:"3.11" /C:"3.12" /C:"3.13" >nul
    if not errorlevel 1 (
        set PYTHON_CMD=python
    ) else (
        echo.
        echo ERROR: No se encontro Python 3.11 o 3.12.
        echo Python 3.14 NO es compatible todavia con los paquetes requeridos.
        echo.
        echo Por favor instala Python 3.11 desde el Microsoft Store:
        echo   1. Abri Microsoft Store
        echo   2. Busca "Python 3.11"
        echo   3. Instala esa version especifica
        echo.
        pause
        exit /b 1
    )
)

echo Usando: %PYTHON_CMD%
echo.

echo [1/2] Instalando dependencias Python...
%PYTHON_CMD% -m pip install -r backend\requirements.txt
if errorlevel 1 (
    echo.
    echo ERROR: No se pudieron instalar las dependencias.
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
%PYTHON_CMD% -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
pause
