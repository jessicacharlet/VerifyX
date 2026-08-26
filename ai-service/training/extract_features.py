import os
import sys
import numpy as np

# Ensure parent directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from services.image_analysis import extract_image_features

DATASET_DIR = os.path.join(os.path.dirname(__file__), "..", "dataset")

def extract_features_from_dataset():
    """
    Extract feature vectors from genuine and manipulated dataset folders.
    """
    X = []
    y = []

    genuine_dir = os.path.join(DATASET_DIR, "genuine")
    manipulated_dir = os.path.join(DATASET_DIR, "manipulated")

    if os.path.exists(genuine_dir):
        for fname in os.listdir(genuine_dir):
            fpath = os.path.join(genuine_dir, fname)
            if os.path.isfile(fpath) and fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                feat = extract_image_features(fpath)
                X.append([
                    feat["ela_anomaly"],
                    feat["pixel_anomaly"],
                    feat["edge_anomaly"],
                    feat["visual_consistency"],
                    feat["image_similarity"],
                ])
                y.append(0) # 0 = GENUINE

    if os.path.exists(manipulated_dir):
        for fname in os.listdir(manipulated_dir):
            fpath = os.path.join(manipulated_dir, fname)
            if os.path.isfile(fpath) and fname.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                feat = extract_image_features(fpath)
                X.append([
                    feat["ela_anomaly"],
                    feat["pixel_anomaly"],
                    feat["edge_anomaly"],
                    feat["visual_consistency"],
                    feat["image_similarity"],
                ])
                y.append(1) # 1 = SUSPICIOUS/MANIPULATED

    return np.array(X), np.array(y)

if __name__ == "__main__":
    X, y = extract_features_from_dataset()
    print(f"Extracted {len(X)} dataset feature samples.")
