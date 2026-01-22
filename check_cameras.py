import cv2

print("🔍 Sprawdzam dostępne kamery...")
print("-" * 40)

for i in range(5):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        print(f"✅ Kamera {i}: DOSTĘPNA")
        cap.release()
    else:
        print(f"❌ Kamera {i}: NIEDOSTĘPNA")

print("-" * 40)
