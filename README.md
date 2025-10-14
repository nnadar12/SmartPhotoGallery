# Smart Photo Gallery
### Full-stack web application built for home servers

This project allows users to upload photos to their home server from a web frontend and automatically analyze image backgrounds using a deep learning model trained on the MIT places365 dataset. The user can then search through their photos by background scene (e.g. "beach," "mountain," "forest," etc.) and view all images in an organized grid.

### Features

- Image Upload: Upload photos from the web using a simple React frontend.
- AI-Powered Background Recognition: Each image is analyzed through the FastAPI backend using a ResNet18 model trained on the MIT places365 dataset.
- Search by Image Background: Instantly view all images whose background analysis matches a given keyword.

### Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | React.js | Attaches images, performs searches, displays results |
| **Backend (Node)** | Express.js + Multer | Handles file uploads and API routing |
| **ML Backend (Python)** | FastAPI + PyTorch | Runs image background analysis using MIT Places365 |
| **Storage** | JSON file in `server/uploads/` | Stores all image metadata and analysis results |

### How to Set Up 

After cloning the repository:

1. Set up python environment
    <pre>bash cd ml
    python3 -m venv venv
    source venv/bin/activate
    pip install fastapi uvicorn torch torchvision pillow</pre>

2. Set up Node.js server dependencies
    <pre>cd server
    npm install express multer cors axios
    cd ../client
    npm install</pre>

3. Start all servers
    <pre>chmod +x start.sh
    ./start.sh</pre>

    - FastAPI server starts on port 8000
    - Express.js server starts on port 5000
    - React frontend starts on port 3000

### Future Features (Todo list)
- User authentication (Differentiate between family members photos)
- Facial recognition (maybe)
- Android app that periodically backs up photos taken on the phone

## Thanks for checking out my project!

### By Nicholas Nadar 2025

