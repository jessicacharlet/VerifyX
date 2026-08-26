import os
import shutil

DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "dataset")
GENUINE_DIR = os.path.join(DATASET_DIR, "genuine")
MANIPULATED_DIR = os.path.join(DATASET_DIR, "manipulated")

def init_dataset_structure():
    """
    Initialize dataset directory structure for training genuine vs manipulated product images.
    """
    os.makedirs(GENUINE_DIR, exist_ok=True)
    os.makedirs(MANIPULATED_DIR, exist_ok=True)
    print(f"Dataset structure ready:\n  Genuine: {GENUINE_DIR}\n  Manipulated: {MANIPULATED_DIR}")

if __name__ == "__main__":
    init_dataset_structure()
