#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "========================================================"
echo " Starting SOBHA Quality & Defect Management System "
echo "========================================================"

# 1. Start Python FastAPI Backend
echo "-> Starting Backend on http://127.0.0.1:8000 ..."
cd "$DIR/backend"
"$DIR/backend/venv/bin/uvicorn" main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start React Frontend
echo "-> Starting Frontend on http://localhost:5173 ..."
cd "$DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "-> Backend API:  http://127.0.0.1:8000"
echo "-> API Docs:     http://127.0.0.1:8000/docs"
echo "-> Frontend App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to terminate both servers."

wait
