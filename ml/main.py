
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import io

# --- Load model once when FastAPI starts ---
MODEL_FILE = "models/resnet18_places365.pth.tar"
CATEGORIES_FILE = "models/categories_places365.txt"

# Load categories
classes = []
with open(CATEGORIES_FILE) as f:
    for line in f:
        classes.append(line.strip().split(' ')[0][3:])
classes = tuple(classes)

# Define transforms
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# Load model
model = models.resnet18(num_classes=365)
checkpoint = torch.load(MODEL_FILE, map_location=torch.device('cpu'))
state_dict = {k.replace("module.", ""): v for k, v in checkpoint['state_dict'].items()}
model.load_state_dict(state_dict)
model.eval()

# --- Create FastAPI app ---
app = FastAPI()

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        # Read file into memory
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes))

        # Transform
        input_img = transform(img).unsqueeze(0)

        # Inference
        logits = model(input_img)
        probs = torch.nn.functional.softmax(logits, 1)
        top5 = torch.topk(probs, 5)

        results = [
            {"label": classes[idx], "probability": float(probs[0][idx])}
            for idx in top5.indices[0]
        ]

        return JSONResponse(content={"predictions": results})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
