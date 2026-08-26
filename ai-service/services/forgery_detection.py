import os
import pickle
import numpy as np
from services.image_analysis import extract_image_features
from services.risk_score import calculate_risk_score

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "forgery_detector.pkl")

class ForgeryDetector:
    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
                print(f"Loaded trained forgery detector model from {MODEL_PATH}")
            except Exception as e:
                print(f"Could not load ML model pickle: {e}")
                self.model = None
        else:
            self.model = None

    def analyze(self, submitted_image_path, registered_image_path=None):
        features = extract_image_features(submitted_image_path, registered_image_path)
        
        ml_prob = None
        if self.model is not None:
            try:
                # Prepare feature vector: [ela, pixel, edge, visual, similarity]
                vector = np.array([[
                    features["ela_anomaly"],
                    features["pixel_anomaly"],
                    features["edge_anomaly"],
                    features["visual_consistency"],
                    features["image_similarity"],
                ]])
                probs = self.model.predict_proba(vector)[0]
                # Assuming class 1 is SUSPICIOUS
                ml_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])
            except Exception as e:
                print(f"Model prediction exception: {e}")
                ml_prob = None

        result = calculate_risk_score(features, ml_prob)
        return result

detector_instance = ForgeryDetector()

def analyze_forgery(submitted_image_path, registered_image_path=None):
    return detector_instance.analyze(submitted_image_path, registered_image_path)
