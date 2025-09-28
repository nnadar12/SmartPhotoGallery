#!/bin/bash

echo "Starting FastAPI server..."
source venv/bin/activate
cd ml
# Start FastAPI in the background
uvicorn main:app --reload --port 8000 &
FASTAPI_PID=$!
cd ..

echo "Waiting for ML model to load..."
# Give FastAPI 5-10 seconds to load the model into memory.
# You might need to adjust this time based on your computer's speed.
sleep 8

echo "Starting Express server..."
cd server
# Start Express in the background
node index.js &
NODE_PID=$!
cd ..

echo "All servers started"
echo "Node PID: $NODE_PID, FastAPI PID: $FASTAPI_PID"

wait
