@echo off
title Momotombo Travels - Iniciador Local
color 0b

cd /d "%~dp0"

echo ========================================================
echo         MOMOTOMBO TRAVELS - INICIADOR LOCAL
echo ========================================================
echo   Delegando en start.ps1 (ruta de inicio canonica unica).
echo   Uso: iniciar.bat [--seed]
echo ========================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
set EXITCODE=%ERRORLEVEL%

echo.
if %EXITCODE% NEQ 0 (
    echo [ERROR] start.ps1 termino con codigo %EXITCODE%.
) else (
    echo Inicio finalizado.
)
pause
exit /b %EXITCODE%
