#!/bin/bash
# Start backend server
echo "Starting backend server..."
cd "$(dirname "$0")"

# Find the right Python command
PYTHON_CMD="python3"
if ! command -v $PYTHON_CMD &> /dev/null; then
    PYTHON_CMD="python"
    if ! command -v $PYTHON_CMD &> /dev/null; then
        echo "Error: Neither python3 nor python found. Please install Python."
        exit 1
    fi
fi

# Change to backend directory and run server directly with uvicorn
cd backend
$PYTHON_CMD -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend server
echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Handle termination
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT TERM

# Keep script running
wait
