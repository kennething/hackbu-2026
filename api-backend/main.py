from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn
import cv2
import numpy as np
from ultralytics import YOLO

app = FastAPI()

model = YOLO("best.pt")

@app.post("/detect")
async def detect_letters(request: Request):
    # Read raw bytes
    contents = await request.body()

    # Convert bytes → numpy array → OpenCV image
    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        return JSONResponse(status_code=400, content={"error": "Invalid image"})

   
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Increase contrast (helps handwriting detection)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    enhanced = clahe.apply(gray)

    # Reduce noise
    enhanced = cv2.GaussianBlur(enhanced, (3,3), 0)

    # Convert backs for YOLO
    enhanced = cv2.cvtColor(enhanced, cv2.COLOR_GRAY2BGR)
   

    # Run YOLO prediction
    detections = model.predict(enhanced, conf=0.25)

    boxes = detections[0].boxes.xyxy.cpu().numpy()
    scores = detections[0].boxes.conf.cpu().numpy()
    classes = detections[0].boxes.cls.cpu().numpy()

    results = []  # results will store location and letter
    for box, score, cls in zip(boxes, scores, classes):
        results.append({
            'x': float(box[0]),
            'y': float(box[1]),
            'letter': model.names[int(cls)]
        })

    # Sort from top → bottom, then left → right
    for obj in results:
        obj["x_rounded"] = round(obj["x"] * 10)
        obj["y_rounded"] = round(obj["y"] * 10)

    arr_sorted = sorted(results, key=lambda o: (o["y_rounded"], o["x_rounded"]))

    returnable = []
    for i in arr_sorted:
        returnable.append(i["letter"])

    return returnable


    
if __name__ == "__main__":       #host is set to wifi IP so that front end could access through http
    import os
    import ssl

    cert_file = os.path.join(os.path.dirname(__file__), "..", "backend", "cert.pem")
    key_file = os.path.join(os.path.dirname(__file__), "..", "backend", "key.pem")

    if os.path.exists(cert_file) and os.path.exists(key_file):
        uvicorn.run(app, host="149.125.185.253", port=8000, ssl_certfile=cert_file, ssl_keyfile=key_file)
    else:
        print("No SSL certs found, running without HTTPS")
        uvicorn.run(app, host="149.125.185.253", port=8000)
