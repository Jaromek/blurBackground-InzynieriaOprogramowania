import cv2


class Camera:
    def __init__(self, camera_id=0):
        self.cap = cv2.VideoCapture(camera_id)
        if not self.cap.isOpened():
            raise ValueError("Camera not accessible")

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            raise ValueError("Failed to capture frame")
        return cv2.flip(frame, 1)

    def release(self):
        self.cap.release()


if __name__ == "__main__":
    cam = Camera()
    

    # camera resolution: 640x480
    height = int(cam.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    width = int(cam.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    print(f"Camera resolution: {width}x{height}")

    try:
        while True:
            frame = cam.get_frame()

            cv2.imshow("Camera Feed", frame)
            if cv2.waitKey(1) & 0xFF == ord("q"):
                break
    finally:
        cam.release()
        cv2.destroyAllWindows()


