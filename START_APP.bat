@echo off
title PU Roof Works Launcher
color 0B
echo ======================================================================
echo    PU Roof Works - Metal Sheet & PU Foam Roof Decision Hub
echo ======================================================================
echo.
echo [1] Checking Node.js environment...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Node.js & npm detected. Starting local server...
    start http://localhost:3000
    npm run dev
) else (
    echo [*] npm not found on PATH. Opening cloud application directly...
    start https://pu-roof-works-dashbaord-nathawat48.ai.studio
)
pause
