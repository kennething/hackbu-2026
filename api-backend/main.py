from fastapi import FastAPI
import cv2
import base64
from pydantic import BaseModel
import numpy as np
from ultralytics import YOLO

app = FastAPI()

class ImageRequest(BaseModel):
    image: str

model = YOLO("letterdetector.pt")

def convert_base64_to_image(base64_string):          # converts JSON Blob/Base64 string to an OpenCV image
    img_data = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return img


@app.post("/detect")
async def detect_letters(data: ImageRequest):

 img = convert_base64_to_image(data.image)
 
# Perform object detection with YOLOv8
 detections = model.predict(img)

# Extract bounding box data
 boxes = detections[0].boxes.xyxy.cpu().numpy()
 scores = detections[0].boxes.conf.cpu().numpy()
 classes = detections[0].boxes.cls.cpu().numpy()

# Format the results as a list of dictionaries
 results = []
 for box, score, cls in zip(boxes, scores, classes):
     results.append({
         'x1': float(box[0]),
         'y1': float(box[1]),
         'x2': float(box[2]),
         'y2': float(box[3]),
         'confidence': float(score),
         'class': int(cls)
    })

 return {'detections': results}