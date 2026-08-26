# VerifyX — AI Digital Forgery & Image Modification Detection Microservice

This microservice provides an **AI-Based Suspicious Modification and Digital Forgery Detection** layer for the VerifyX Product Authentication System.

## Architecture
- **Framework**: Python 3.9+, Flask, Flask-CORS
- **Computer Vision & ML**: OpenCV, Pillow (PIL), NumPy, scikit-learn, scikit-image
- **Port**: `5001` (Default: `http://localhost:5001`)

## Key Analysis Metrics
1. **Error Level Analysis (ELA)**: Detects JPEG re-compression anomalies and copy-paste splicing artifacts.
2. **Pixel Noise Anomaly**: Measures local noise variance and high-frequency noise consistency.
3. **Edge Density & Gradient Anomaly**: Detects unnatural edge sharpness or regional blur discontinuities using Canny/Sobel filters.
4. **Visual Color Consistency**: Evaluates saturation and brightness distribution entropy.
5. **Image Similarity & SSIM**: Compares submitted product photos against original registered images using Structural Similarity (SSIM) and ORB feature matching.

## API Endpoint
### `POST /api/ai/analyze`
**Input**: Multipart form data with `image` file or JSON with `submitted_image_path`.

**Output**:
```json
{
  "success": true,
  "is_suspicious": false,
  "risk_score": 12,
  "authenticity_score": 88,
  "confidence": 91,
  "result_code": "LOW_RISK",
  "detected_modifications": [],
  "analysis": {
    "visual_consistency": 92,
    "compression_anomaly": 14,
    "pixel_anomaly": 10,
    "edge_anomaly": 12,
    "image_similarity": 95
  }
}
```

## Running the Service
```bash
python app.py
```

## Model Training & Evaluation Pipeline
```bash
# Prepare dataset directory structure
python training/prepare_dataset.py

# Train Random Forest classifier and output models/forgery_detector.pkl
python training/train_model.py

# Evaluate metrics (Accuracy, F1, Confusion Matrix)
python training/evaluate_model.py
```
