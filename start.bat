@echo off
title Castle Defense Game Server
echo ========================================
echo   Castle Defense Game Server
echo ========================================
echo.
echo Starting server on port 5500...
echo.
echo Game URL: http://127.0.0.1:5500
echo Test URL: http://127.0.0.1:5500/test/test_runner.html
echo.
echo Press Ctrl+C to stop the server.
echo ========================================
echo.

:: Open browser after 2 seconds
start "" cmd /c "timeout /t 2 >nul && start http://127.0.0.1:5500"

:: Start Python HTTP server
python -m http.server 5500

pause
