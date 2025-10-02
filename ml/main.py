from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import os
from analyze_image import analyze_and_store

app = FastAPI()

class AnalyzeRequest(BaseModel):
    path: str  # path to image sent from Express

@app.post("/analyze")
async def analyze_image(request: AnalyzeRequest):
    if not os.path.exists(request.path):
        return {"error": f"File not found: {request.path}"}

    result = analyze_and_store(request.path)
    return {"message": "Analysis complete", "data": result}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
