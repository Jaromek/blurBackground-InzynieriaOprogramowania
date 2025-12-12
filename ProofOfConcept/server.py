from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
from ultralytics import YOLO
from camera import Camera
from blurredCamera import BlurBackground
import numpy as np

app = Flask(__name__)
CORS(app)  

class AppState:
    mode="blur"
    color=(0,255,0)
    custom_bg=None

state = AppState()

model = YOLO("yolov8n-seg.pt")
try:
    cam = Camera(camera_id=0) #do zmiany?
    print("Doneee")
except Exception as e:
    print(f"Error : {e}")
    cam = None

def apply_custom_processing(frame):
    if state.mode == "original":
        return frame

    results = model(frame, verbose=False)
    if not results or results[0].masks is None:
        return frame

    result = results[0]
    mask = None
    for m, cls in zip(result.masks.data, result.boxes.cls):
        if int(cls) == 0: # 0 to osoba
            mask = m.cpu().numpy()
            mask = cv2.resize(mask, (frame.shape[1], frame.shape[0]))
            mask = (mask > 0.5).astype(np.float32)
            break
    
    if mask is None:
        return frame

    mask_3d = mask[:, :, None] 

    if state.mode == "blur":
        return BlurBackground.blur_background(frame, model)

    elif state.mode == "color":
        bg = np.full(frame.shape, state.color, dtype=np.uint8)
        return (frame * mask_3d + bg * (1 - mask_3d)).astype(np.uint8)

    elif state.mode == "image" and state.custom_bg is not None:
        bg_resized = cv2.resize(state.custom_bg, (frame.shape[1], frame.shape[0]))
        return (frame * mask_3d + bg_resized * (1 - mask_3d)).astype(np.uint8)

    return frame

def generate_frames():
    while True:
        if cam is None:
            break
        try:
            frame = cam.get_frame()
            processed_frame = apply_custom_processing(frame)


            ret, buffer = cv2.imencode('.jpg', processed_frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except Exception as e:
            print(f"Error: {e}")
            break

#dla reacta
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/set_mode', methods=['POST'])
def set_mode():
    data = request.json
    state.mode = data.get('mode', 'blur')
    print(f"Zmieniono tryb na: {state.mode}")
    return jsonify({"status": "ok", "mode": state.mode})

@app.route('/set_color', methods=['POST'])
def set_color():
    data = request.json
    hex_color = data.get('color', '#00ff00')
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    state.color = (b, g, r) 
    state.mode = 'color'    
    return jsonify({"status": "ok", "color": state.color})

@app.route('/upload_bg', methods=['POST'])
def upload_bg():
    file = request.files['image']
    np_img = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    state.custom_bg = img
    state.mode = 'image' 
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)