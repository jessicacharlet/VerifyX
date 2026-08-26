import os
import sys
import pickle
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from training.extract_features import extract_features_from_dataset

MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "forgery_detector.pkl"))

def evaluate_forgery_model():
    """
    Evaluate trained forgery detector model and print classification metrics.
    """
    if not os.path.exists(MODEL_PATH):
        print("No trained model pickle found. Run train_model.py first.")
        return

    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)

    X, y = extract_features_from_dataset()
    if len(X) == 0:
        print("No image evaluation dataset available.")
        return

    y_pred = model.predict(X)
    acc = accuracy_score(y, y_pred)
    f1 = f1_score(y, y_pred, average="weighted")
    cm = confusion_matrix(y, y_pred)

    print("=== MODEL EVALUATION METRICS ===")
    print(f"Accuracy : {acc * 100:.2f}%")
    print(f"F1 Score : {f1:.4f}")
    print("Confusion Matrix:")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y, y_pred, target_names=["GENUINE", "MANIPULATED"]))

if __name__ == "__main__":
    evaluate_forgery_model()
