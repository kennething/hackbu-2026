from fastapi import FastAPI
import cv2
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import base64
from fastapi import Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import numpy as np
from ultralytics import YOLO

app = FastAPI()


app.add_middleware(         #allows any origin to access the API, which is necessary for the frontend to communicate with the backend without CORS issues. It also allows all HTTP methods and headers.
  CORSMiddleware,
  allow_origins = ["*"],
  allow_methods = ["*"],
  allow_headers = ["*"]
)

class ImageRequest(BaseModel):
    image: str

model = YOLO("best.pt")


def convert_base64_to_image(base64_string):          # converts JSON Blob/Base64 string to an OpenCV image
    if "," in base64_string:
        base64_string = base64_string.split(",")[1]
    img_data = base64.b64decode(base64_string)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is not None:
        print(f"Decoded image shape: {img.shape}, dtype: {img.dtype}")
    else:
        print("ERROR: cv2.imdecode returned None")
    return img

@app.get("/")
async def root():
    return {"Api": "API is running"}

@app.get("/health")  # checks if the API is running and healthy(good practice to have)
async def health(): 
    return {"status": "ok"}

@app.get("/classes")
async def get_classes():
    return {"letters": model.names}

@app.post("/detect")
async def detect_letters(data: ImageRequest):
    img = convert_base64_to_image(data.image)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"}) #sends a 400 Bad Request response if the image data is invalid

    detections = model.predict(img, conf=0.25)

    # Extract bounding box data
    boxes = detections[0].boxes.xyxy.cpu().numpy()
    scores = detections[0].boxes.conf.cpu().numpy()
    classes = detections[0].boxes.cls.cpu().numpy()

   
    results = []
    for box, score, cls in zip(boxes, scores, classes):
        results.append({
        'x1': float(box[0]),
        'y1': float(box[1]),
        'x2': float(box[2]),          #the locations of the bounding box in the image
        'y2': float(box[3]),
        'confidence': float(score), #score of accuracy of the detection
        'class': int(cls), # prints out the int linked to the letter ex: 0:a, 1:b, 2:c
        'letter': model.names[int(cls)]
        })

    return {'detections': results}

#checks for single letters (used in the beginning of the game)
@app.post("/verify") #checks if the detected letter matches the target letter provided in the query parameter. It returns a JSON response indicating whether there was a match, the confidence score of the detection, and the target letter.
async def verify_letter(data: ImageRequest, target: str = Query(...)):
    img = convert_base64_to_image(data.image)
    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image data"})
    detections = model.predict(img, conf=0.25)
    for cls, score in zip(detections[0].boxes.cls, detections[0].boxes.conf):
        if model.names[int(cls)] == target:
            return {"match": True, "confidence": float(score), "letter": target}
    return {"match": False, "confidence": 0.0, "letter": target}

#for actual words (later on in the game)
@app.post("/verify-word") #checks if the detected word matches the target word provided in the query parameter. It returns a JSON response indicating whether there was a match, the detected word, and the target word.
async def verify_word(data: ImageRequest, target: str = Query(...)):
    img = convert_base64_to_image(data.image)
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
    results.sort(key=lambda r: r["x"])  # sort left to right
    detected_word = "".join(r["letter"] for r in results)
    return {"target": target, "detected": detected_word, "match": detected_word == target}


if __name__ == "__main__":            #makes sure the server runs when the script is executed directly. It starts the Uvicorn server, which serves the FastAPI application on localhost at port 8008.
    uvicorn.run(app, host="127.0.0.1", port=8008)
