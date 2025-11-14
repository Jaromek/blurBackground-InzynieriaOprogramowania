import cv2
import numpy as np
from ultralytics.models.yolo import YOLO
from camera import Camera


class BlurBackground:
    def blur_background(frame, model):
        """
        Przyjmuje pojedynczą klatkę i model YOLO, zwraca obraz z rozmytym tłem.
        """
        results = model(frame, verbose=False)
        output = frame.copy()

        for result in results:
            if result.masks is None:
                continue

            for mask, cls in zip(result.masks.data, result.boxes.cls):
                if int(cls) == 0:
                    mask = mask.cpu().numpy()
                    mask = cv2.resize(mask, (frame.shape[1], frame.shape[0]))
                    mask = (mask > 0.5).astype(np.uint8)

                    blurred = cv2.GaussianBlur(frame, (35, 35), 0)
                    output = frame * mask[:, :, None] + blurred * (1 - mask[:, :, None])

        return output

    def segmentation_blur():
        model = YOLO("yolov8n-seg.pt")

        cam = Camera()

        try:
            while True:
                frame = cam.get_frame()
                output = BlurBackground.blur_background(frame, model)

                cv2.imshow("YOLOv8 Live Segmentation Blur", output)

                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break

        finally:
            cam.release()
            cv2.destroyAllWindows()


if __name__ == "__main__":
    BlurBackground.segmentation_blur()
