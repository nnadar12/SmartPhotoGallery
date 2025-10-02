import os
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import json

# Paths
MODEL_FILE = "models/resnet18_places365.pth.tar"
CATEGORIES_FILE = "models/categories_places365.txt"
OUTPUT_JSON = "analysis.json"

# --- Load categories ---
classes = []
with open(CATEGORIES_FILE) as class_file:
    for line in class_file:
        classes.append(line.strip().split(' ')[0][3:])
classes = tuple(classes)

# --- Define transforms ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# --- Load model once (global) ---
model = models.resnet18(num_classes=365)
checkpoint = torch.load(MODEL_FILE, map_location=torch.device('cpu'))
state_dict = {str.replace(k, 'module.', ''): v for k, v in checkpoint['state_dict'].items()}
model.load_state_dict(state_dict)
model.eval()


def analyze_and_store(img_path: str):
    """Analyze an image and append results to analysis.json"""
    img = Image.open(img_path).convert("RGB")
    input_img = transform(img).unsqueeze(0)

    logits = model.forward(input_img)
    probs = torch.nn.functional.softmax(logits, 1)

    top5 = torch.topk(probs, 5)
    results = []
    for idx in top5.indices[0]:
        results.append({
            "label": classes[idx],
            "probability": float(probs[0][idx].item())
        })

    # Create entry
    entry = {
        "image": os.path.basename(img_path),
        "results": results
    }

    # Append to JSON file
    if os.path.exists(OUTPUT_JSON):
        with open(OUTPUT_JSON, "r") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    data.append(entry)

    with open(OUTPUT_JSON, "w") as f:
        json.dump(data, f, indent=4)

    return entry
