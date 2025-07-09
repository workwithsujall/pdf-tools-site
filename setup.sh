#!/bin/bash

# PDF Tools Setup Script

echo "Setting up PDF Tools application..."

# Create .env.local file for frontend
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file for frontend..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    echo ".env.local created."
fi

# Check if running with Docker
if [ "$1" = "docker" ]; then
    echo "Setting up with Docker..."
    docker-compose up --build
    exit 0
fi

# Check for Python
if command -v python3 &>/dev/null; then
    PYTHON="python3"
elif command -v python &>/dev/null; then
    PYTHON="python"
else
    echo "Error: Python is not installed."
    exit 1
fi

# Check for Node.js
if ! command -v node &>/dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

# Backend setup
echo "Setting up backend..."
cd backend || exit
echo "Creating Python virtual environment..."
$PYTHON -m venv venv

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f "venv/Scripts/activate" ]; then
    source venv/Scripts/activate
else
    echo "Error: Could not activate virtual environment."
    exit 1
fi

# Install backend dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Start backend in the background
echo "Starting backend server..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Return to root directory
cd ..

# Frontend setup
echo "Installing frontend dependencies..."
npm install

# Start frontend
echo "Starting frontend server..."
npm run dev

# Clean up on exit
trap "kill $BACKEND_PID" EXIT 