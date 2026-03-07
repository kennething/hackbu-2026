from fastapi import FastAPI
import cv2
import base64
from fastapi.responses import JSONResponse
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
 results = model.predict(img)
 detections =[]
 for r in results:
    for box in r.boxes:        # iterates through the detected boxes and extracts the class, confidence, and bounding box coordinates and adding it to detections list as a dictionary
       detections.append({              
        "class": int(box.cls),
        "confidence": float(box.conf),
        "x_min": int(box.xyxy.toList()),
       })
 
 
 return JSONResponse(content={"detections": detections})