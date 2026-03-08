from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Union
import uvicorn
import cv2
import numpy as np
import base64
from ultralytics import YOLO
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Accept either Base64 string or raw bytes
class ImageRequest(BaseModel):
    image: Union[str, bytes]

# Load your YOLO model
model = YOLO("best.pt")


def convert_to_cv2_image(image_input: Union[str, bytes]):
    """
    Converts Base64 string or raw bytes into an OpenCV image (numpy.ndarray)
    """
    if isinstance(image_input, str):
        if "," in image_input:
            image_input = image_input.split(",")[1]
        image_bytes = base64.b64decode(image_input)
    elif isinstance(image_input, bytes):
        image_bytes = image_input
    else:
        raise ValueError("Image must be a Base64 string or raw bytes")

    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        print("ERROR: cv2.imdecode returned None")
    else:
        print(f"Decoded image shape: {img.shape}, dtype: {img.dtype}")

    return img


@app.get("/")
async def root():
    return {"Api": "API is running"}


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/classes")
async def get_classes():
    return {"letters": model.names}


@app.post("/detect")
async def detect_letters(data: ImageRequest):
    try:
        img = convert_to_cv2_image(data.image)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})

    detections = model.predict(img, conf=0.25)

    boxes = detections[0].boxes.xyxy.cpu().numpy()
    scores = detections[0].boxes.conf.cpu().numpy()
    classes = detections[0].boxes.cls.cpu().numpy()

    results = []
    for box, score, cls in zip(boxes, scores, classes):
        results.append({
            'x1': float(box[0]),
            'y1': float(box[1]),
            'x2': float(box[2]),
            'y2': float(box[3]),
            'confidence': float(score),
            'class': int(cls),
            'letter': model.names[int(cls)]
        })

    return {'detections': results}


@app.post("/verify")
async def verify_letter(data: ImageRequest, target: str = Query(...)):
    try:
        img = convert_to_cv2_image(data.image)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})

    detections = model.predict(img, conf=0.25)
    for cls, score in zip(detections[0].boxes.cls, detections[0].boxes.conf):
        if model.names[int(cls)] == target:
            return {"match": True, "confidence": float(score), "letter": target}

    return {"match": False, "confidence": 0.0, "letter": target}


@app.post("/verify-word")
async def verify_word(data: ImageRequest, target: str = Query(...)):
    try:
        img = convert_to_cv2_image(data.image)
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})

    detections = model.predict(img, conf=0.25)
    results = []
    for box, cls, score in zip(detections[0].boxes.xyxy, detections[0].boxes.cls, detections[0].boxes.conf):
        results.append({
            "x": float(box[0]),
            "letter": model.names[int(cls)],
            "confidence": float(score)
        })

    # Sort left-to-right by x-coordinate
    results.sort(key=lambda r: r["x"])
    detected_word = "".join(r["letter"] for r in results)

    return {"target": target, "detected": detected_word, "match": detected_word == target}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8008)
