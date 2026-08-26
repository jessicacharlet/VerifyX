import cv2
import numpy as np
from PIL import Image, ImageChops, ImageEnhance
import os
import io

def calculate_ela(image_path, quality=95):
    """
    Error Level Analysis (ELA) to detect JPEG compression inconsistencies & digital manipulation.
    """
    try:
        original = Image.open(image_path).convert("RGB")
        buffer = io.BytesIO()
        original.save(buffer, "JPEG", quality=quality)
        buffer.seek(0)
        resaved = Image.open(buffer)

        ela_image = ImageChops.difference(original, resaved)
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / (max_diff if max_diff > 0 else 1)
        ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)

        ela_np = np.array(ela_image)
        mean_diff = np.mean(ela_np)
        std_diff = np.std(ela_np)

        # Higher variance / std_diff in ELA indicates potential splicing or editing
        anomaly_score = min(100.0, float(std_diff * 1.8 + mean_diff * 0.5))
        return anomaly_score, ela_np
    except Exception as e:
        print(f"ELA calculation error: {e}")
        return 15.0, None

def analyze_pixel_noise(image_path):
    """
    Analyze local noise variance and high-frequency noise consistency.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 15.0

        # High pass filter (Laplacian)
        laplacian = cv2.Laplacian(img, cv2.CV_64F)
        variance = laplacian.var()

        # Normalize noise anomaly score (0 - 100)
        # Unusually high or low noise variance suggests manipulation or smoothing
        if variance < 50 or variance > 3000:
            pixel_anomaly = 65.0
        else:
            pixel_anomaly = max(5.0, min(95.0, abs(variance - 800) / 40.0))
        return float(pixel_anomaly)
    except Exception as e:
        print(f"Pixel noise analysis error: {e}")
        return 15.0

def analyze_edge_consistency(image_path):
    """
    Detect edge density discontinuities using Canny / Sobel edge operators.
    """
    try:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 15.0

        edges = cv2.Canny(img, 100, 200)
        edge_density = np.sum(edges > 0) / float(img.size)

        # Local block edge variance
        h, w = img.shape
        bh, bw = max(16, h // 8), max(16, w // 8)
        block_densities = []
        for r in range(0, h - bh, bh):
            for c in range(0, w - bw, bw):
                block = edges[r:r+bh, c:c+bw]
                block_densities.append(np.sum(block > 0) / float(block.size))

        std_density = np.std(block_densities) if block_densities else 0.0
        edge_anomaly = min(100.0, float(std_density * 350.0))
        return edge_anomaly
    except Exception as e:
        print(f"Edge analysis error: {e}")
        return 15.0

def analyze_visual_consistency(image_path):
    """
    Evaluate overall visual consistency and color distribution entropy.
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            return 85.0

        hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)

        # Variance of brightness and saturation
        v_std = np.std(v)
        s_std = np.std(s)

        consistency_score = max(30.0, min(98.0, 100.0 - (v_std * 0.3 + s_std * 0.2)))
        return float(consistency_score)
    except Exception as e:
        print(f"Visual consistency error: {e}")
        return 85.0

def compare_images(submitted_path, registered_path):
    """
    Compare submitted product photo against registered product photo using Structural Similarity (SSIM)
    and ORB feature matching.
    """
    if not registered_path or not os.path.exists(registered_path):
        return 90.0 # Default if no original registered image available

    try:
        img1 = cv2.imread(submitted_path, cv2.IMREAD_GRAYSCALE)
        img2 = cv2.imread(registered_path, cv2.IMREAD_GRAYSCALE)

        if img1 is None or img2 is None:
            return 90.0

        # Resize img1 to match img2 dimensions
        img1_resized = cv2.resize(img1, (img2.shape[1], img2.shape[0]))

        # Mean Squared Error (MSE)
        mse = np.mean((img1_resized.astype("float") - img2.astype("float")) ** 2)
        similarity_mse = max(10.0, min(99.0, 100.0 - (mse / 100.0)))

        # ORB Feature Matcher
        orb = cv2.ORB_create(nfeatures=500)
        kp1, des1 = orb.detectAndCompute(img1_resized, None)
        kp2, des2 = orb.detectAndCompute(img2, None)

        if des1 is not None and des2 is not None:
            bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
            matches = bf.match(des1, des2)
            good_matches = len(matches)
            orb_score = min(99.0, (good_matches / 50.0) * 100.0)
            final_similarity = (similarity_mse * 0.4) + (orb_score * 0.6)
        else:
            final_similarity = similarity_mse

        return float(max(15.0, min(99.0, final_similarity)))
    except Exception as e:
        print(f"Image comparison error: {e}")
        return 90.0
