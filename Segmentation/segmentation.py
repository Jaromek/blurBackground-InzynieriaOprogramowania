from PIL import Image
import numpy as np
from ultralytics import YOLO # type: ignore[attr-defined]

import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

class Segmentation:
    @staticmethod
    def segmentation(image, model):
        """Segments the image using YOLO model"""
        original_image = image.convert('RGB')
        original_size = original_image.size
        original_array = np.array(original_image)
        
        # Run YOLO inference
        results = model(original_image, verbose=False)
        
        # Initialize empty mask
        mask_array = np.zeros((original_size[1], original_size[0]), dtype=np.float32)
        
        # Process results - combine all detected person masks
        if results[0].masks is not None:
            masks = results[0].masks.data.cpu().numpy()
            
            for mask in masks:
                # Resize mask to original image size
                mask_resized = np.array(
                    Image.fromarray((mask * 255).astype(np.uint8)).resize(
                        original_size, Image.Resampling.NEAREST
                    )
                ) / 255.0
                # Combine masks (union of all detected persons)
                mask_array = np.maximum(mask_array, mask_resized)
        
        mask_3d = np.stack([mask_array] * 3, axis=-1)

        human = (original_array * mask_3d).astype(np.uint8)
        background = (original_array * (1 - mask_3d)).astype(np.uint8)

        return human, background

if __name__ == "__main__":
    import matplotlib.pyplot as plt
    import random

    PATH_IMG = "Dataset/humanSegmentation/images"
    MODEL_PATH = "Model/yolo_human_seg_best.pt"

    model = YOLO(MODEL_PATH)

    random_image = lambda path: random.choice(os.listdir(path))
    input_image = Image.open(os.path.join(PATH_IMG, random_image(PATH_IMG)))
    human, background = Segmentation.segmentation(input_image, model)

    plt.figure(figsize=(10, 5))
    plt.subplot(1, 3, 1)
    plt.title("Original Image")
    plt.imshow(input_image)
    plt.axis('off')

    plt.subplot(1, 3, 2)
    plt.title("Human")
    plt.imshow(human)
    plt.axis('off')

    plt.subplot(1, 3, 3)
    plt.title("Background")
    plt.imshow(background)
    plt.axis('off')

    plt.show()

