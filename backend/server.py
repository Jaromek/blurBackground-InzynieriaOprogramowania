
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from PIL import Image, ImageOps
import io
import os
import sys
import threading
print("🔍 Uruchamianie serwera.. .", file=sys.stderr, flush=True)

# Dodaj ścieżkę do głównego katalogu projektu
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Camera. camera import Camera
from Segmentation.segmentation import Segmentation
from ChangeBackground.changeBackground import ChangeBackground
from ultralytics import YOLO

# Import wirtualnej kamery (opcjonalny - jeśli zainstalowany)
try:
    import pyvirtualcam
    VIRTUAL_CAM_AVAILABLE = True
    print("✅ pyvirtualcam dostępny")
except ImportError:
    VIRTUAL_CAM_AVAILABLE = False
    print("⚠️  pyvirtualcam niedostępny - funkcja OBS wyłączona")

app = Flask(__name__)
CORS(app)  # Pozwala na requesty z React (localhost:3000)

# ========== KONFIGURACJA ==========
MODEL_PATH = "../Model/yolo11n-seg.pt"
BACKGROUNDS_DIR = "../Backgrounds"
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ========== GLOBALNE ZMIENNE ==========
model = None
camera = None
current_mode = "blur"  # blur, color, image, original
current_color = "#00FF00"  # Domyślny kolor (zielony)
current_bg_image = None

# Wirtualna kamera OBS
virtual_cam = None
virtual_cam_running = False
virtual_cam_thread = None
camera_index = 1  # Numer kamery do użycia (0=domyślna, 1=druga, itd.)
latest_frame = None  # Ostatnia ramka z kamery - współdzielona między streamem a OBS
frame_lock = threading.Lock()  # Lock do synchronizacji dostępu do ramki


# ========== INICJALIZACJA ==========
def initialize():
    global model, camera
    
    print("🔄 Ładowanie modelu YOLO...")
    model = YOLO(MODEL_PATH)
    print("✅ Model załadowany!")
    
    print("📷 Inicjalizacja kamery...")
    camera = Camera()
    print("✅ Kamera gotowa!")


# ========== GENERATOR RAMEK WIDEO ==========
def generate_frames():
    global camera, latest_frame
    
    print("\n🎥 ========== STREAM STARTED ==========")
    print(f"Mode: {current_mode}")
    print(f"Color: {current_color}")
    print("=" * 50 + "\n")
    
    frame_count = 0
    
    while True:
        try: 
            frame_count += 1
            
            if frame_count % 30 == 0:  # Log co 30 ramek (co ~1 sekundę)
                print(f"📊 Wysłano {frame_count} ramek...")
            
            # Pobierz ramkę
            try:
                frame = camera.get_frame()
                
                # Zapisz dla OBS (jeśli działa)
                with frame_lock:
                    latest_frame = frame.copy()
                    
            except Exception as e:
                print(f"❌ BŁĄD KAMERY: {e}")
                break
            
            # Przetwórz ramkę używając wspólnej funkcji
            try:
                output_frame = process_frame_for_output(frame)
            except Exception as e:
                print(f"❌ BŁĄD PRZETWARZANIA: {e}")
                output_frame = frame  # Fallback
            
            # Enkoduj i wyślij
            try:
                ret, buffer = cv2.imencode('.jpg', output_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                if not ret:
                    print("❌ Nie można enkodować ramki do JPEG")
                    continue
                    
                frame_bytes = buffer.tobytes()
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            except Exception as e:
                print(f"❌ BŁĄD WYSYŁANIA: {e}")
                break
        
        except GeneratorExit:
            print("\n🛑 Stream zamknięty przez klienta")
            break
        except Exception as e:
            print(f"\n❌ NIEZNANY BŁĄD: {e}")
            import traceback
            traceback.print_exc()
            break
    
    print("\n🎬 ========== STREAM ENDED ==========\n")


# ========== ENDPOINTY API ==========

@app.route('/video_feed', methods=['GET'])
def video_feed():
    """Stream wideo MJPEG dla przeglądarki"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/set_mode', methods=['POST'])
def set_mode():
    """Zmień tryb przetwarzania (blur, color, image, original)"""
    global current_mode
    
    data = request.get_json()
    mode = data.get('mode', 'blur')
    
    if mode in ['blur', 'color', 'image', 'original']:
        current_mode = mode
        print(f"🔄 Tryb zmieniony na: {current_mode}")
        return jsonify({"status": "success", "mode": current_mode})
    else:
        return jsonify({"status": "error", "message":  "Invalid mode"}), 400


@app.route('/set_color', methods=['POST'])
def set_color():
    """Ustaw kolor tła (hex format, np.  #FF0000)"""
    global current_color, current_mode
    
    data = request. get_json()
    color = data.get('color', '#00FF00')
    
    current_color = color
    current_mode = "color"  # Automatycznie przełącz na tryb koloru
    print(f"🎨 Kolor tła:  {current_color}")
    
    return jsonify({"status":  "success", "color": current_color})


@app.route('/upload_bg', methods=['POST'])
def upload_bg():
    """Upload własnego tła (obraz)"""
    global current_bg_image, current_mode
    
    if 'image' not in request. files:
        return jsonify({"status": "error", "message": "No image file"}), 400
    
    file = request.files['image']
    
    if file.filename == '': 
        return jsonify({"status": "error", "message": "Empty filename"}), 400
    
    try:
        # Wczytaj obraz
        image_bytes = file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        current_bg_image = image
        current_mode = "image"  # Automatycznie przełącz na tryb obrazu
        
        print(f"🖼️ Wgrano tło: {file.filename}")
        return jsonify({"status": "success", "filename": file.filename})
    
    except Exception as e:
        print(f"❌ Błąd uploadu:  {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/status', methods=['GET'])
def status():
    """Sprawdź status serwera"""
    return jsonify({
        "status": "running",
        "mode": current_mode,
        "color": current_color,
        "has_custom_bg": current_bg_image is not None,
        "virtual_cam_available": VIRTUAL_CAM_AVAILABLE,
        "virtual_cam_running": virtual_cam_running
    })


def process_frame_for_output(frame):
    """Przetwórz klatkę zgodnie z aktualnym trybem - współdzielone dla streamu i OBS"""
    global current_mode, current_color, current_bg_image, model
    
    TARGET_WIDTH = 640
    h, w = frame.shape[:2]
    scale = TARGET_WIDTH / w
    new_h = int(h * scale)
    new_size = (TARGET_WIDTH, new_h)
    frame = cv2.resize(frame, new_size)
    
    if current_mode == "original":
        return frame
    
    # Segmentacja
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame_pil = Image.fromarray(frame_rgb)
    human, _ = Segmentation.segmentation(frame_pil, model)
    human_pil = Image.fromarray(human)
    
    # Zastosuj wybrany efekt
    if current_mode == "blur":
        blurred_bg = cv2.GaussianBlur(frame, (35, 35), 0)
        blurred_bg_rgb = cv2.cvtColor(blurred_bg, cv2.COLOR_BGR2RGB)
        blurred_bg_pil = Image.fromarray(blurred_bg_rgb)
        result = ChangeBackground.change_background(human_pil, blurred_bg_pil)
    elif current_mode == "color":
        hex_color = current_color.lstrip('#')
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        color_bg = Image.new('RGB', new_size, (r, g, b))
        result = ChangeBackground.change_background(human_pil, color_bg)
    elif current_mode == "image":
        if current_bg_image is not None:
            bg = ImageOps.fit(current_bg_image, new_size, method=Image.Resampling.LANCZOS)
            result = ChangeBackground.change_background(human_pil, bg)
        else:
            blurred_bg = cv2.GaussianBlur(frame, (35, 35), 0)
            blurred_bg_rgb = cv2.cvtColor(blurred_bg, cv2.COLOR_BGR2RGB)
            blurred_bg_pil = Image.fromarray(blurred_bg_rgb)
            result = ChangeBackground.change_background(human_pil, blurred_bg_pil)
    else:
        result = frame_pil
    
    # Konwersja z PIL do OpenCV
    result_rgb = np.array(result)
    output_frame = cv2.cvtColor(result_rgb, cv2.COLOR_RGB2BGR)
    return output_frame


def virtual_camera_loop():
    """Pętla wirtualnej kamery OBS - działa w osobnym wątku"""
    global virtual_cam_running, virtual_cam, latest_frame
    
    VCAM_WIDTH = 640
    VCAM_HEIGHT = 480
    
    print(f"🎥 Uruchamianie wirtualnej kamery OBS...")
    
    # Poczekaj aż pierwsza ramka będzie dostępna
    import time
    for _ in range(50):  # Czekaj max 5 sekund
        with frame_lock:
            if latest_frame is not None:
                break
        time.sleep(0.1)
    
    if latest_frame is None:
        print("❌ Nie można uzyskać ramki z kamery - upewnij się że stream w przeglądarce jest uruchomiony")
        virtual_cam_running = False
        return
    
    try:
        with pyvirtualcam.Camera(width=VCAM_WIDTH, height=VCAM_HEIGHT, fps=30) as vcam:
            print(f"✅ Wirtualna kamera uruchomiona: {vcam.device}")
            virtual_cam = vcam
            
            while virtual_cam_running:
                # Pobierz najnowszą ramkę ze współdzielonego bufora
                with frame_lock:
                    if latest_frame is None:
                        time.sleep(0.01)
                        continue
                    frame = latest_frame.copy()
                
                try:
                    # Przetwórz ramkę tak samo jak dla przeglądarki
                    processed = process_frame_for_output(frame)
                    
                    # Upewnij się że ramka ma dokładnie rozmiar 640x480
                    if processed.shape[0] != VCAM_HEIGHT or processed.shape[1] != VCAM_WIDTH:
                        processed = cv2.resize(processed, (VCAM_WIDTH, VCAM_HEIGHT))
                    
                    # Konwertuj BGR -> RGB dla pyvirtualcam
                    processed_rgb = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
                    
                    # Wyślij do wirtualnej kamery
                    vcam.send(processed_rgb)
                    vcam.sleep_until_next_frame()
                except Exception as e:
                    print(f"❌ Błąd przetwarzania ramki OBS: {e}")
                    
    except Exception as e:
        print(f"❌ Błąd wirtualnej kamery: {e}")
    finally:
        virtual_cam = None
        virtual_cam_running = False
        print("🛑 Wirtualna kamera OBS zatrzymana")


@app.route('/obs/start', methods=['POST'])
def start_virtual_camera():
    """Uruchom wirtualną kamerę dla OBS"""
    global virtual_cam_running, virtual_cam_thread, camera_index
    
    if not VIRTUAL_CAM_AVAILABLE:
        return jsonify({
            "status": "error",
            "message": "pyvirtualcam nie jest zainstalowany. Uruchom: pip install pyvirtualcam"
        }), 400
    
    if virtual_cam_running:
        return jsonify({
            "status": "error",
            "message": "Wirtualna kamera już działa"
        }), 400
    
    # Pobierz opcjonalny numer kamery z requestu
    data = request.get_json() or {}
    camera_index = data.get('camera_index', 0)
    
    virtual_cam_running = True
    virtual_cam_thread = threading.Thread(target=virtual_camera_loop, daemon=True)
    virtual_cam_thread.start()
    
    return jsonify({
        "status": "success",
        "message": f"Wirtualna kamera OBS uruchomiona (kamera #{camera_index})"
    })


@app.route('/obs/stop', methods=['POST'])
def stop_virtual_camera():
    """Zatrzymaj wirtualną kamerę OBS"""
    global virtual_cam_running
    
    if not virtual_cam_running:
        return jsonify({
            "status": "error",
            "message": "Wirtualna kamera nie jest uruchomiona"
        }), 400
    
    virtual_cam_running = False
    
    return jsonify({
        "status": "success",
        "message": "Wirtualna kamera OBS zatrzymana"
    })


@app.route('/obs/status', methods=['GET'])
def obs_status():
    """Sprawdź status wirtualnej kamery OBS"""
    return jsonify({
        "available": VIRTUAL_CAM_AVAILABLE,
        "running": virtual_cam_running,
        "camera_index": camera_index
    })


# ========== URUCHOMIENIE SERWERA ==========
if __name__ == "__main__":
    print("\n" + "="*50)
    print("🚀 BACKEND SERVER - BLUR BACKGROUND")
    print("="*50 + "\n")
    
    initialize()
    
    print("\n" + "="*50)
    print("✅ Serwer uruchomiony na http://localhost:5000")
    print("📡 Endpoints:")
    print("   - /video_feed       (GET: stream wideo)")
    print("   - /set_mode         (POST: blur/color/image/original)")
    print("   - /set_color        (POST: #RRGGBB)")
    print("   - /upload_bg        (POST: image file)")
    print("   - /status           (GET: status serwera)")
    print("   - /obs/start        (POST: uruchom wirtualną kamerę OBS)")
    print("   - /obs/stop         (POST: zatrzymaj wirtualną kamerę OBS)")
    print("   - /obs/status       (GET: status wirtualnej kamery)")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=False, threaded=True)