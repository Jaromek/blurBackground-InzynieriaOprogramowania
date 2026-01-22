import pyvirtualcam
from blurredCamera import BlurBackground, cv2
from ultralytics import YOLO


class VirtualCamera:
    def __init__(self, width=640, height=480, fps=30):
        self.width = width
        self.height = height
        self.fps = fps
        self.cam = pyvirtualcam.Camera(
            width=self.width, height=self.height, fps=self.fps
        )
        self.model = YOLO("yolov8n-seg.pt")
        print(f"Virtual camera initialized at {self.width}x{self.height}@{self.fps}fps")

    def send_frame(self, frame):
        # Przetwórz klatkę która została przekazana (z wybranej kamery)
        processed = BlurBackground.blur_background(frame, self.model)
        # Konwertuj BGR na RGB dla pyvirtualcam
        processed_rgb = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
        self.cam.send(processed_rgb)
        self.cam.sleep_until_next_frame()

    def close(self):
        self.cam.close()
        print("Virtual camera stopped.")


if __name__ == "__main__":
    # Zmień numer kamery tutaj (0 = domyślna, 1 = druga kamera, itd.)
    CAMERA_INDEX = 0 
    
    vc = VirtualCamera()
    cap = cv2.VideoCapture(CAMERA_INDEX)

    if not cap.isOpened():
        print(f"Nie udało się otworzyć kamery {CAMERA_INDEX}.")
        print("Dostępne kamery - sprawdzam...")
        # Sprawdź dostępne kamery
        for i in range(5):
            test_cap = cv2.VideoCapture(i)
            if test_cap.isOpened():
                print(f"  Kamera {i}: Dostępna")
                test_cap.release()
            else:
                print(f"  Kamera {i}: Niedostępna")
        exit()

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            frame = cv2.resize(frame, (vc.width, vc.height))
            vc.send_frame(frame)

            # Podgląd (opcjonalny)
            cv2.imshow("Preview (ESC to quit)", frame)
            if cv2.waitKey(1) == 27:  # ESC
                break
    finally:
        vc.close()
        cap.release()
        cv2.destroyAllWindows()
