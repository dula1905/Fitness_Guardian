from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import cv2
import pandas as pd
from io import BytesIO
from PIL import Image
import numpy as np
import base64
import sys
import asyncio
from ...Pushup_Integrated import detector, get_joint_angles, clf  # Import required components from Pushup_Integrated

app = FastAPI()

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Templates directory
templates = Jinja2Templates(directory="templates")

# Global variables to manage camera feed and tracking status
capture = None
tracking = False

# HTML template for the tracking page
tracking_page = Jinja2Templates(directory="templates/tracking_page.html")

# Endpoint to start tracking
@app.post("/start-tracking/{exercise}")
async def start_tracking(exercise: str):
    global capture, tracking
    if not tracking:
        capture = cv2.VideoCapture(0)
        tracking = True
        while tracking:
            ret, img = capture.read()
            if not ret:
                break
            img = detector.findPose(img, False)
            angles = get_joint_angles(img, detector)
            if not angles:
                print("No landmarks detected. Skipping prediction.")
                continue
            custom_input = {
                'relbow': angles[0],
                'lelbow': angles[1],
                'rarmpit': angles[2],
                'larmpit': angles[3],
                'rhip': angles[4],
                'lhip': angles[5],
                'rknee': angles[6],
                'lknee': angles[7],
                'rankle': angles[8],
                'lankle': angles[9]
            }
            custom_df = pd.DataFrame([custom_input])
            prediction = clf.predict(custom_df)
            if prediction == 1:
                cv2.putText(img, "Correct Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            else:
                cv2.putText(img, "Incorrect Form", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            _, buffer = cv2.imencode('.jpg', img)
            frame_bytes = base64.b64encode(buffer).decode('utf-8')
            yield f"data:image/jpeg;base64,{frame_bytes}\n"
    else:
        yield 'Tracking is already in progress'

# Endpoint to stop tracking
@app.post("/end-tracking")
async def end_tracking():
    global capture, tracking
    if tracking:
        tracking = False
        if capture is not None:
            capture.release()
        yield 'Tracking ended'
    else:
        yield 'Tracking is not in progress'

# Serve the tracking page
@app.get("/track/{exercise}", response_class=HTMLResponse)
async def track_page(exercise: str):
    return HTMLResponse(content=tracking_page)

# WebSocket endpoint for video feed
@app.websocket("/video-feed")
async def video_feed(websocket: WebSocket):
    global capture
    while True:
        if tracking and capture is not None and capture.isOpened():
            ret, frame = capture.read()
            if ret:
                _, buffer = cv2.imencode('.jpg', frame)
                frame_bytes = base64.b64encode(buffer).decode('utf-8')
                await websocket.send_text(frame_bytes)
        else:
            break
        await asyncio.sleep(0.1)

# Serve home page
@app.get("/", response_class=HTMLResponse)
async def home():
    return templates.TemplateResponse("home.html", {"request": None})

