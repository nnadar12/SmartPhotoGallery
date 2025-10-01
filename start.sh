#!/bin/bash

# Exit on error
set -e

echo "Starting FastAPI server..."
source venv/bin/activate
cd ml
# Start FastAPI in the background
uvicorn main:app --reload --port 8000 &
FASTAPI_PID=$!
cd ..

echo "Waiting for ML model to load..."
# Give FastAPI 5-10 seconds to load the model into memory
sleep 8

echo "Starting Express server..."
cd server
# Start Express in the background
node index.js &
NODE_PID=$!
cd ..

echo "Waiting for Express server to stabilize..."
sleep 3

echo "Starting React client..."
cd client
npm start &
REACT_PID=$!
cd ..

echo "All servers started"
echo "FastAPI PID: $FASTAPI_PID, Node PID: $NODE_PID, React PID: $REACT_PID"

# Kill all processes when the script exits
trap "kill $FASTAPI_PID $NODE_PID $REACT_PID" EXIT

wait
