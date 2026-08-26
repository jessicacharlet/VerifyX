def calculate_risk_score(features, ml_pred_prob=None):
    """
    Calculate explainable AI risk score (0-100), authenticity score, confidence,
    and detected modification signals.
    
    Risk score scale:
    0–30: LOW RISK (Authentic / Unmodified)
    31–60: MODERATE RISK (Potential modification / lighting difference)
    61–100: HIGH RISK (Possible digital forgery / manipulation)
    """
    ela = features.get("ela_anomaly", 15.0)
    pixel = features.get("pixel_anomaly", 15.0)
    edge = features.get("edge_anomaly", 15.0)
    visual = features.get("visual_consistency", 90.0)
    similarity = features.get("image_similarity", 95.0)

    detected_modifications = []

    # Individual component risk contributions
    ela_risk = min(100.0, ela * 0.9)
    pixel_risk = min(100.0, pixel * 0.8)
    edge_risk = min(100.0, edge * 0.85)
    visual_risk = max(0.0, 100.0 - visual)
    similarity_risk = max(0.0, 100.0 - similarity)

    # Anomaly signal detection logic
    if ela > 55.0:
        detected_modifications.append("Compression anomaly detected (Possible JPEG re-compression splicing)")
    if pixel > 50.0:
        detected_modifications.append("Pixel-level noise inconsistency detected")
    if edge > 50.0:
        detected_modifications.append("Unusual edge density & gradient discontinuity")
    if visual < 55.0:
        detected_modifications.append("Visual color/brightness distribution inconsistency")
    if similarity < 60.0:
        detected_modifications.append("Significant structural difference from registered product image")

    # Weighted Risk Score Calculation
    raw_risk = (
        ela_risk * 0.25 +
        pixel_risk * 0.20 +
        edge_risk * 0.20 +
        visual_risk * 0.15 +
        similarity_risk * 0.20
    )

    if ml_pred_prob is not None:
        raw_risk = (raw_risk * 0.5) + (ml_pred_prob * 100.0 * 0.5)

    risk_score = int(round(max(4.0, min(98.0, raw_risk))))
    authenticity_score = 100 - risk_score

    # Result Category Classification
    if risk_score <= 30:
        result_code = "LOW_RISK"
        confidence = 92
    elif risk_score <= 60:
        result_code = "MODERATE_RISK"
        confidence = 88
    else:
        result_code = "HIGH_RISK"
        confidence = 94

    return {
        "is_suspicious": risk_score > 45,
        "risk_score": risk_score,
        "authenticity_score": authenticity_score,
        "confidence": confidence,
        "result_code": result_code,
        "detected_modifications": detected_modifications,
        "analysis": {
            "visual_consistency": int(round(visual)),
            "compression_anomaly": int(round(ela_risk)),
            "pixel_anomaly": int(round(pixel_risk)),
            "edge_anomaly": int(round(edge_risk)),
            "image_similarity": int(round(similarity))
        }
    }
