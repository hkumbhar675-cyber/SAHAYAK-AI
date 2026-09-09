@echo off
cd /d %~dp0ai_service
echo Starting SAHAYAK AI FastAPI Service on port 8000...
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
