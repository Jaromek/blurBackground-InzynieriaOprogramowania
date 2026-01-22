import cv2
import numpy as np
from camera import Camera


class ImageHumanSegmentationCV2:
    def __init__(self, image):
        self.image = image
        self.gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        self.blurred = cv2.GaussianBlur(self.gray, (5, 5), 0)

    def segment(self):
        _, thresh = cv2.threshold(
            self.blurred, 127, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU
        )
        contours, _ = cv2.findContours(
            thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        mask = np.zeros_like(self.image)
        for contour in contours:
            if cv2.contourArea(contour) > 1000:  # Filter small contours
                cv2.drawContours(
                    mask, [contour], -1, (255, 255, 255), thickness=cv2.FILLED
                )

        segmented = cv2.bitwise_and(self.image, mask)
        return segmented


class ImageHumanSegmentationYOLO:
    def __init__(self, image) -> None:
        self.image = image


if __name__ == "__main__":
    camera = Camera()
    frame = camera.get_frame()
    while True:
        segmented_image = ImageHumanSegmentationCV2(frame).segment()
        cv2.imshow("Segmented Image", segmented_image)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break
        frame = camera.get_frame()
