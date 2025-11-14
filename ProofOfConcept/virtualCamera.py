import pyvirtualcam
from blurredCamera import BlurBackground, cv2


class VirtualCamera:
    def __init__(self, width=640, height=480, fps=30):
        self.width = width
        self.height = height
        self.fps = fps
        self.cam = pyvirtualcam.Camera(
            width=self.width, height=self.height, fps=self.fps
        )
        print(f"Virtual camera initialized at {self.width}x{self.height}@{self.fps}fps")

    def send_frame(self, frame):
        processed = BlurBackground.segmentation_blur()
        self.cam.send(processed)
        self.cam.sleep_until_next_frame()

    def close(self):
        self.cam.close()
        print("Virtual camera stopped.")


if __name__ == "__main__":
    vc = VirtualCamera()
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Nie udało się otworzyć kamery.")
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
