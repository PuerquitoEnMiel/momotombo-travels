@echo off
title Momotombo Travels - Iniciador Local
color 0b

echo ========================================================
echo         MOMOTOMBO TRAVELS - INICIADOR LOCAL
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando migraciones y base de datos local...
cd apps\server
call npx prisma migrate deploy
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [AVISO] Las migraciones arrojaron un detalle. Verifique su DATABASE_URL en apps\server\.env.
)

echo.
echo [2/3] Levantando Servidor Backend (NestJS en puerto 3001)...
start "Momotombo Server (Backend - 3001)" cmd /k "cd /d "%~dp0apps\server" && npm run start:dev"

echo.
echo [3/3] Levantando Cliente Frontend (Next.js en puerto 3000)...
start "Momotombo Client (Frontend - 3000)" cmd /k "cd /d "%~dp0apps\client" && npm run dev"

echo.
echo ========================================================
echo   Listo! Ambas ventanas de servidor se estan ejecutando.
echo   - Backend:  http://localhost:3001/api/v1/health
echo   - Frontend: http://localhost:3000
echo ========================================================
echo.
timeout /t 5 >nul
start http://localhost:3000
exit
