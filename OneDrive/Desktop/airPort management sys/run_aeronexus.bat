@echo off
setlocal
title AeroNexus Launcher

echo ========================================================
echo         AeroNexus 2026 - System Startup
echo ========================================================
echo.

:: Resolve the absolute path to the directory where this .bat file is located
set "PROJECT_DIR=%~dp0"
:: Remove trailing backslash if present
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo [INFO] Project directory located at: %PROJECT_DIR%
echo.

echo [*] Starting Identity Service (Port 3002)...
start "AeroNexus Identity Service" cmd /c "title Identity Server && cd /d "%PROJECT_DIR%\services\identity-service" && npx nodemon src/index.ts"

echo [*] Starting Event Broker (Port 3003)...
start "AeroNexus Event Broker" cmd /c "title Event Broker && cd /d "%PROJECT_DIR%\services\event-broker" && npx nodemon src/index.ts"

echo [*] Starting Flight Operations Service (Port 3001)...
start "AeroNexus Flight Ops" cmd /c "title Flight Ops Server && cd /d "%PROJECT_DIR%\services\flight-operations" && npx nodemon src/index.ts"

echo [*] Starting Next.js Command Center (Port 3000)...
start "AeroNexus Frontend" cmd /c "title Frontend Server && cd /d "%PROJECT_DIR%\frontend" && npm run dev"

echo.
echo [INFO] Waiting 5 seconds for services to initialize...
timeout /t 5 /nobreak >nul

echo [*] Launching browser...
start http://localhost:3000

echo.
echo ========================================================
echo   All systems nominal. The services are running in 
echo   separate command windows.
echo ========================================================
echo.
pause
