@echo off
echo ====================================================================
echo     SAHAYAK AI - Citizen Benefits Platform (Demo Prototype)
echo ====================================================================
echo.
echo Starting services...
echo.

:: 1. Start Python FastAPI AI Service
echo [1/3] Starting Python FastAPI AI Microservice on Port 8000...
start "SAHAYAK AI - Python FastAPI (Port 8000)" cmd /k "cd /d %~dp0ai_service && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 2. Start Node.js Express Backend
echo [2/3] Starting Node.js Express REST API on Port 5000...
start "SAHAYAK AI - Node.js Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node server.js"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start React Vite Frontend
echo [3/3] Starting React + Vite Frontend on Port 5173...
start "SAHAYAK AI - Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

:: Wait 3 seconds then open browser
timeout /t 3 /nobreak >nul
echo.
echo Opening SAHAYAK AI in browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ====================================================================
echo All services launched!
echo - Frontend:    http://localhost:5173
echo - Backend API: http://localhost:5000/api/health
echo - AI Service:  http://localhost:8000/api/ai/health
echo ====================================================================
