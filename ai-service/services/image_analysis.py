from utils.image_processing import (
    calculate_ela,
    analyze_pixel_noise,
    analyze_edge_consistency,
    analyze_visual_consistency,
    compare_images,
)

def extract_image_features(submitted_path, registered_path=None):
    """
    Extract comprehensive visual feature vector for digital forgery detection.
    """
    ela_anomaly, _ = calculate_ela(submitted_path)
    pixel_anomaly = analyze_pixel_noise(submitted_path)
    edge_anomaly = analyze_edge_consistency(submitted_path)
    visual_consistency = analyze_visual_consistency(submitted_path)
    image_similarity = compare_images(submitted_path, registered_path) if registered_path else 95.0

    features = {
        "ela_anomaly": round(ela_anomaly, 2),
        "pixel_anomaly": round(pixel_anomaly, 2),
        "edge_anomaly": round(edge_anomaly, 2),
        "visual_consistency": round(visual_consistency, 2),
        "image_similarity": round(image_similarity, 2),
    }

    return features
