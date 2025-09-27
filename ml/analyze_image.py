import os
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

# Paths
UPLOADS_DIR = "../server/uploads"
MODEL_FILE = "models/resnet18_places365.pth.tar"
CATEGORIES_FILE = "models/categories_places365.txt"

# --- Step 1: Get the first file in uploads ---
files = [f for f in os.listdir(UPLOADS_DIR) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
if not files:
    raise FileNotFoundError("No images found in uploads folder.")
img_path = os.path.join(UPLOADS_DIR, files[0])
print(f"Analyzing: {img_path}")

# --- Step 2: Load labels ---
classes = []
with open(CATEGORIES_FILE) as class_file:
    for line in class_file:
        classes.append(line.strip().split(' ')[0][3:])
classes = tuple(classes)

# --- Step 3: Define transforms ---
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# --- Step 4: Load model ---
model = models.resnet18(num_classes=365)
checkpoint = torch.load(MODEL_FILE, map_location=torch.device('cpu'))
state_dict = {str.replace(k, 'module.', ''): v for k, v in checkpoint['state_dict'].items()}
model.load_state_dict(state_dict)
model.eval()

# --- Step 5: Run inference ---
img = Image.open(img_path)
input_img = transform(img).unsqueeze(0)  # add batch dimension
logits = model.forward(input_img)
probs = torch.nn.functional.softmax(logits, 1)

# --- Step 6: Print top 5 predictions ---
top5 = torch.topk(probs, 5)
print("\nTop 5 scene predictions:")
for idx in top5.indices[0]:
    print(f"- {classes[idx]} ({probs[0][idx].item():.4f})")

