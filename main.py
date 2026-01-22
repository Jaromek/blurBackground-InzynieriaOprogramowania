from ultralytics import YOLO # type: ignore[attr-defined]
from Segmentation.segmentation import Segmentation
from ChangeBackground.changeBackground import ChangeBackground
from Camera.camera import Camera
from PIL import Image, ImageOps
import argparse
import numpy as np
import cv2
import platform


def main(model_name="yolo11n-seg", use_virtual_cam=False, show_preview=False):
    MODEL_PATH = f"Model/{model_name}.pt"
    print(f"Ladowanie modelu: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)

    PATH_BACKGROUND = "Backgrounds/summonersRift2.png"
    background_bgr = cv2.imread(PATH_BACKGROUND)
    if background_bgr is None:
        raise ValueError(f"Could not load background from {PATH_BACKGROUND}")
    background = cv2.cvtColor(background_bgr, cv2.COLOR_BGR2RGB)
    background_pil = Image.fromarray(background)

    cam = Camera()

    TARGET_WIDTH = 640

    dummy_frame = cam.get_frame()
    h, w = dummy_frame.shape[:2]
    scale = TARGET_WIDTH / w
    new_h = int(h * scale)
    new_size = (TARGET_WIDTH, new_h)
    
    print(f"Rozdzielczosc: {TARGET_WIDTH}x{new_h}")

    background_prepared = ImageOps.fit(
        background_pil, new_size, method=Image.Resampling.LANCZOS
    )

    # Initialize virtual camera if requested
    virtual_cam = None
    if use_virtual_cam:
        try:
            import pyvirtualcam
            # Let pyvirtualcam auto-detect the best format
            virtual_cam = pyvirtualcam.Camera(
                width=TARGET_WIDTH,
                height=new_h,
                fps=30,
                print_fps=True
            )
            print(f"\n=== WIRTUALNA KAMERA AKTYWNA ===")
            print(f"Urzadzenie: {virtual_cam.device}")
            print(f"Wybierz '{virtual_cam.device}' w Teams/Zoom\n")
        except RuntimeError as e:
            print(f"\n=== BLAD WIRTUALNEJ KAMERY ===")
            print(f"{e}\n")
            if platform.system() == "Linux":
                print("Na Arch Linux wykonaj:")
                print("  1. sudo pacman -S v4l2loopback-dkms")
                print("  2. sudo modprobe v4l2loopback video_nr=10 card_label=VirtualCam exclusive_caps=1")
                print("  3. Uruchom ponownie: python main.py -v\n")
            virtual_cam = None
        except ImportError:
            print("Brak pyvirtualcam! Zainstaluj: pip install pyvirtualcam")
            virtual_cam = None

    if show_preview:
        print("Nacisnij 'q' w oknie podgladu aby zakonczyc")
    else:
        print("Nacisnij Ctrl+C aby zakonczyc")
    print()

    try:
        while True:
            frame = cam.get_frame()
            frame = cv2.resize(frame, new_size)

            # Process frame
            frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            human, _ = Segmentation.segmentation(frame_pil, model)

            # Change background
            changed_background = ChangeBackground.change_background(
                human, background_prepared
            )
            
            # Convert to numpy arrays
            result_rgb = np.array(changed_background, dtype=np.uint8)
            result_bgr = cv2.cvtColor(result_rgb, cv2.COLOR_RGB2BGR)

            # Send frame to virtual camera (pyvirtualcam expects RGB by default)
            if virtual_cam is not None:
                virtual_cam.send(result_rgb)
                virtual_cam.sleep_until_next_frame()

            # Show preview if enabled
            if show_preview:
                cv2.imshow("Background Changer [q=quit]", result_bgr)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    break
            else:
                # Small delay to prevent CPU overload when no preview
                cv2.waitKey(1)
    except KeyboardInterrupt:
        print("\nPrzerwano")
    finally:
        cam.release()
        if virtual_cam is not None:
            virtual_cam.close()
            print("Wirtualna kamera zamknieta.")
        cv2.destroyAllWindows()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Real-time Background Changer using YOLO Segmentation")
    parser.add_argument("-m", "--model", type=str, default="yolo11n-seg", help="YOLO model name (default: yolo11n-seg)")
    parser.add_argument("-v", "--virtual-cam", action="store_true", help="Enable virtual camera output for Teams/Zoom")
    parser.add_argument("-p", "--preview", action="store_true", help="Show preview window")
    args = parser.parse_args()
    main(args.model, args.virtual_cam, args.preview)