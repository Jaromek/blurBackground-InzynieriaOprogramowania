import os
# Wyłącz MLflow i WandB PRZED importem ultralytics
os.environ['MLFLOW_TRACKING_URI'] = ''
os.environ['WANDB_DISABLED'] = 'true'

import shutil
import random
from pathlib import Path
from PIL import Image
from tqdm import tqdm
import yaml
import cv2
import torch
import pandas as pd
import matplotlib.pyplot as plt
from ultralytics import YOLO # type: ignore[attr-defined]


class YOLOHumanSegmentation:
    """
    Klasa do fine-tuningu YOLOv8 na segmentację człowieka z tła.
    
    Użycie:
        trainer = YOLOHumanSegmentation()
        trainer.run()
    """
    
    def __init__(
        self,
        images_dir="Dataset/humanSegmentation/images",
        masks_dir="Dataset/humanSegmentation/masks",
        output_dir="Dataset/yolo_dataset",
        epochs=100,
        batch_size=8,
        image_size=640
    ):
        """
        Args:
            images_dir: Ścieżka do folderu ze zdjęciami
            masks_dir: Ścieżka do folderu z maskami
            output_dir: Folder na przygotowany dataset YOLO
            epochs: Liczba epok treningowych
            batch_size: Rozmiar batcha
            image_size: Rozmiar obrazu dla YOLO
        """
        self.base_dir = Path(__file__).parent.parent
        self.images_dir = self.base_dir / images_dir
        self.masks_dir = self.base_dir / masks_dir
        self.output_dir = self.base_dir / output_dir
        
        self.epochs = epochs
        self.batch_size = batch_size
        self.image_size = image_size
        
        self.model = None
    
    def run(self):
        """Uruchamia cały proces: przygotowanie danych + trening."""
        print("\n" + "="*60)
        print("YOLO HUMAN SEGMENTATION - FINE-TUNING")
        print("="*60)
        
        # 1. Przygotuj dataset
        if not self._prepare_dataset():
            return None
        
        # 2. Trenuj model
        self._train()
        
        print("\n✓ Zakończono!")
        return self.model

    def _prepare_dataset(self):
        """Przygotowuje dataset w formacie YOLO."""
        print("\n[1/2] Przygotowanie datasetu...")
        
        # Sprawdź czy foldery istnieją
        if not self.images_dir.exists():
            print(f"Nie znaleziono: {self.images_dir}")
            return False
        if not self.masks_dir.exists():
            print(f"Nie znaleziono: {self.masks_dir}")
            return False
        
        # Znajdź pasujące pary obraz-maska
        images = set(f for f in os.listdir(self.images_dir) if f.endswith(('.png', '.jpg', '.jpeg')))
        masks = set(f for f in os.listdir(self.masks_dir) if f.endswith(('.png', '.jpg', '.jpeg')))
        matching = sorted(list(images & masks))
        
        print(f"   Znaleziono {len(matching)} par obraz-maska")
        
        if len(matching) == 0:
            print("Brak pasujących par!")
            return False
        
        # Podziel na train/val/test (70/15/15)
        random.seed(42)
        random.shuffle(matching)
        n_train = int(len(matching) * 0.7)
        n_val = int(len(matching) * 0.15)
        
        splits = {
            'train': matching[:n_train],
            'val': matching[n_train:n_train + n_val],
            'test': matching[n_train + n_val:]
        }
        
        print(f"   Train: {len(splits['train'])}, Val: {len(splits['val'])}, Test: {len(splits['test'])}")
        
        # Utwórz strukturę folderów
        for split in ['train', 'val', 'test']:
            (self.output_dir / 'images' / split).mkdir(parents=True, exist_ok=True)
            (self.output_dir / 'labels' / split).mkdir(parents=True, exist_ok=True)
        
        # Przetwórz każdy split
        for split_name, files in splits.items():
            print(f"   Przetwarzanie {split_name}...")
            for filename in tqdm(files, desc=f"   {split_name}", leave=False):
                self._process_image(filename, split_name)
        
        # Utwórz dataset.yaml
        yaml_content = {
            'path': str(self.output_dir.absolute()),
            'train': 'images/train',
            'val': 'images/val',
            'test': 'images/test',
            'names': {0: 'person'}
        }
        
        with open(self.output_dir / 'dataset.yaml', 'w') as f:
            yaml.dump(yaml_content, f)
        
        print("   ✓ Dataset gotowy")
        return True
    
    def _process_image(self, filename, split_name):
        """Przetwarza pojedynczy obraz i maskę."""
        # Ścieżki
        img_src = self.images_dir / filename
        mask_src = self.masks_dir / filename
        img_dst = self.output_dir / 'images' / split_name / filename
        label_dst = self.output_dir / 'labels' / split_name / (Path(filename).stem + '.txt')
        
        # Kopiuj obraz
        shutil.copy2(img_src, img_dst)
        
        # Konwertuj maskę na format YOLO
        with Image.open(img_src) as img:
            w, h = img.size
        
        annotations = self._mask_to_polygon(mask_src, w, h)
        
        with open(label_dst, 'w') as f:
            f.write('\n'.join(annotations))
    
    def _mask_to_polygon(self, mask_path, img_w, img_h):
        """Konwertuje maskę binarną na polygon YOLO."""
        mask = cv2.imread(str(mask_path), cv2.IMREAD_GRAYSCALE)
        if mask is None:
            return []
        
        _, binary = cv2.threshold(mask, 127, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        annotations = []
        for contour in contours:
            if cv2.contourArea(contour) < 100:
                continue
            
            epsilon = 0.002 * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)
            
            if len(approx) < 3:
                continue
            
            points = []
            for point in approx:
                x = point[0][0] / img_w
                y = point[0][1] / img_h
                points.extend([f"{x:.6f}", f"{y:.6f}"])
            
            annotations.append("0 " + " ".join(points))
        
        return annotations
    
    def _train(self):
        """Trenuje model YOLO."""
        print("\n[2/2] Trening modelu...")
        
        # Załaduj model bazowy
        model_path = Path(__file__).parent / "yolo11n-seg.pt"
        if not model_path.exists():
            raise FileNotFoundError(
                f"Nie znaleziono modelu bazowego: {model_path}\n"
                f"Pobierz model yolo11n-seg.pt i umieść go w folderze Model/"
            )
        
        print(f"   Ładowanie: {model_path}")
        self.model = YOLO(str(model_path))
        
        # Konfiguracja
        device = '0' if torch.cuda.is_available() else 'cpu'
        print(f"   Device: {'CUDA' if device == '0' else 'CPU'}")
        print(f"   Epochs: {self.epochs}, Batch: {self.batch_size}, Size: {self.image_size}")
        
        self.model.train(
            data=str(self.output_dir / 'dataset.yaml'),
            epochs=self.epochs,
            batch=self.batch_size,
            imgsz=self.image_size,
            project=str(self.base_dir / 'Model' / 'runs'),
            name='yolo_human_seg',
            exist_ok=True,
            patience=20,
            device=device,
            workers=4,
            amp=True
        )
        
        # Zapisz najlepszy model
        best_model = self.base_dir / 'Model' / 'runs' / 'yolo_human_seg' / 'weights' / 'best.pt'
        if best_model.exists():
            output_path = Path(__file__).parent / 'yolo_human_seg_best.pt'
            shutil.copy2(best_model, output_path)
            print(f"\n   ✓ Model zapisany: {output_path}")
        
        # Wykresy metryk
        self._plot_metrics()
    
    def _plot_metrics(self):
        """Generuje wykresy loss i metryk segmentacji."""
        results_file = self.base_dir / 'Model' / 'runs' / 'yolo_human_seg' / 'results.csv'
        
        if not results_file.exists():
            print("Brak pliku results.csv - pomijam wykresy")
            return
        
        print("\n[3/3] Generowanie wykresów...")
        
        # Wczytaj dane
        df = pd.read_csv(results_file)
        df.columns = df.columns.str.strip()  # Usuń spacje z nazw kolumn
        
        # Utwórz figure z 2x2 subplots
        fig, axes = plt.subplots(2, 2, figsize=(14, 10))
        fig.suptitle('YOLO Human Segmentation - Metryki Treningu', fontsize=14, fontweight='bold')
        
        epochs = df['epoch'] + 1  # YOLO liczy od 0
        
        # ========== 1. Loss (Train) ==========
        ax1 = axes[0, 0]
        if 'train/seg_loss' in df.columns:
            ax1.plot(epochs, df['train/seg_loss'], 'b-', label='Segmentation Loss', linewidth=2)
        if 'train/box_loss' in df.columns:
            ax1.plot(epochs, df['train/box_loss'], 'r-', label='Box Loss', linewidth=2)
        if 'train/cls_loss' in df.columns:
            ax1.plot(epochs, df['train/cls_loss'], 'g-', label='Classification Loss', linewidth=2)
        ax1.set_xlabel('Epoka')
        ax1.set_ylabel('Loss')
        ax1.set_title('Training Loss')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # ========== 2. Loss (Validation) ==========
        ax2 = axes[0, 1]
        if 'val/seg_loss' in df.columns:
            ax2.plot(epochs, df['val/seg_loss'], 'b-', label='Segmentation Loss', linewidth=2)
        if 'val/box_loss' in df.columns:
            ax2.plot(epochs, df['val/box_loss'], 'r-', label='Box Loss', linewidth=2)
        if 'val/cls_loss' in df.columns:
            ax2.plot(epochs, df['val/cls_loss'], 'g-', label='Classification Loss', linewidth=2)
        ax2.set_xlabel('Epoka')
        ax2.set_ylabel('Loss')
        ax2.set_title('Validation Loss')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # ========== 3. mAP (Segmentation) ==========
        ax3 = axes[1, 0]
        if 'metrics/mAP50(M)' in df.columns:
            ax3.plot(epochs, df['metrics/mAP50(M)'], 'b-', label='mAP50 (Mask)', linewidth=2)
        if 'metrics/mAP50-95(M)' in df.columns:
            ax3.plot(epochs, df['metrics/mAP50-95(M)'], 'r-', label='mAP50-95 (Mask)', linewidth=2)
        ax3.set_xlabel('Epoka')
        ax3.set_ylabel('mAP')
        ax3.set_title('Segmentation mAP (IoU)')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        ax3.set_ylim([0, 1])
        
        # ========== 4. Precision & Recall ==========
        ax4 = axes[1, 1]
        if 'metrics/precision(M)' in df.columns:
            ax4.plot(epochs, df['metrics/precision(M)'], 'b-', label='Precision', linewidth=2)
        if 'metrics/recall(M)' in df.columns:
            ax4.plot(epochs, df['metrics/recall(M)'], 'r-', label='Recall', linewidth=2)
        ax4.set_xlabel('Epoka')
        ax4.set_ylabel('Wartość')
        ax4.set_title('Precision & Recall (Mask)')
        ax4.legend()
        ax4.grid(True, alpha=0.3)
        ax4.set_ylim([0, 1])
        
        plt.tight_layout()
        
        # Zapisz wykres
        plot_path = self.base_dir / 'Model' / 'runs' / 'yolo_human_seg' / 'training_metrics.png'
        plt.savefig(plot_path, dpi=150, bbox_inches='tight')
        plt.show()
        
        print(f"   ✓ Wykres zapisany: {plot_path}")
        
        # Wypisz końcowe metryki
        print("\n" + "="*60)
        print("KOŃCOWE METRYKI (ostatnia epoka):")
        print("="*60)
        last = df.iloc[-1]
        if 'metrics/mAP50(M)' in df.columns:
            print(f"   mAP50 (Mask):     {last['metrics/mAP50(M)']:.4f}")
        if 'metrics/mAP50-95(M)' in df.columns:
            print(f"   mAP50-95 (Mask):  {last['metrics/mAP50-95(M)']:.4f}")
        if 'metrics/precision(M)' in df.columns:
            print(f"   Precision (Mask): {last['metrics/precision(M)']:.4f}")
        if 'metrics/recall(M)' in df.columns:
            print(f"   Recall (Mask):    {last['metrics/recall(M)']:.4f}")
    
    def predict(self, image_path, conf=0.5):
        """
        Segmentacja na pojedynczym obrazie.
        
        Args:
            image_path: Ścieżka do obrazu
            conf: Próg pewności (0-1)
        
        Returns:
            PIL Image z nałożoną segmentacją
        """
        if self.model is None:
            model_path = Path(__file__).parent / 'yolo_human_seg_best.pt'
            if not model_path.exists():
                print(f"Nie znaleziono modelu: {model_path}")
                return None
            self.model = YOLO(str(model_path))
        
        device = '0' if torch.cuda.is_available() else 'cpu'
        results = self.model.predict(source=image_path, conf=conf, device=device)
        
        result_img = results[0].plot()
        return Image.fromarray(result_img[..., ::-1])

if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    trainer = YOLOHumanSegmentation(
        images_dir="Dataset/humanSegmentation/images",
        masks_dir="Dataset/humanSegmentation/masks",
        epochs=200,
        batch_size=64
    )
    trainer.run()
