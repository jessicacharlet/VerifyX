import os
import sys
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from training.extract_features import extract_features_from_dataset

MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))
MODEL_PATH = os.path.join(MODEL_DIR, "forgery_detector.pkl")

def train_forgery_model():
    """
    Train Random Forest classifier on image feature vectors and save model pickle.
    """
    os.makedirs(MODEL_DIR, exist_ok=True)
    X, y = extract_features_from_dataset()

    if len(X) < 4:
        print("Insufficient training dataset images. Generating synthetic baseline feature samples for initialization...")
        # Synthetic baseline dataset (GENUINE vs MANIPULATED feature distribution)
        np.random.seed(42)
        # Genuine: low ELA, low pixel noise, low edge anomaly, high visual, high similarity
        X_gen = np.column_stack([
            np.random.normal(12.0, 4.0, 50), # ela
            np.random.normal(15.0, 5.0, 50), # pixel
            np.random.normal(12.0, 4.0, 50), # edge
            np.random.normal(92.0, 4.0, 50), # visual
            np.random.normal(95.0, 3.0, 50), # similarity
        ])
        y_gen = np.zeros(50)

        # Manipulated: high ELA, high pixel noise, high edge anomaly, lower visual, lower similarity
        X_man = np.column_stack([
            np.random.normal(68.0, 12.0, 50), # ela
            np.random.normal(65.0, 10.0, 50), # pixel
            np.random.normal(62.0, 11.0, 50), # edge
            np.random.normal(60.0, 10.0, 50), # visual
            np.random.normal(55.0, 12.0, 50), # similarity
        ])
        y_man = np.ones(50)

        X = np.vstack([X_gen, X_man])
        y = np.concatenate([y_gen, y_man])

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)

    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)

    print(f"RandomForest Forgery Model trained & saved to: {MODEL_PATH}")
    return clf

if __name__ == "__main__":
    train_forgery_model()
