const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:5001/api/ai/analyze";

/**
 * Send image file or path to Python AI Microservice for digital forgery & modification analysis.
 */
async function analyzeProductImage(submittedImagePath, registeredImagePath = null) {
  try {
    const form = new FormData();

    if (submittedImagePath && fs.existsSync(submittedImagePath)) {
      form.append("image", fs.createReadStream(submittedImagePath));
    }

    if (registeredImagePath && fs.existsSync(registeredImagePath)) {
      form.append("registered_image", fs.createReadStream(registeredImagePath));
    }

    const response = await axios.post(AI_SERVICE_URL, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 8000, // 8-second timeout
    });

    if (response.data && response.data.success) {
      return {
        aiAnalyzed: true,
        aiRiskScore: response.data.risk_score,
        aiAuthenticityScore: response.data.authenticity_score,
        aiConfidence: response.data.confidence,
        aiResult: response.data.result_code,
        detectedModifications: response.data.detected_modifications || [],
        visualConsistency: response.data.analysis?.visual_consistency || 90,
        compressionAnomaly: response.data.analysis?.compression_anomaly || 10,
        pixelAnomaly: response.data.analysis?.pixel_anomaly || 10,
        edgeAnomaly: response.data.analysis?.edge_anomaly || 10,
        imageSimilarity: response.data.analysis?.image_similarity || 95,
        aiAnalyzedAt: new Date(),
      };
    }
  } catch (error) {
    console.warn("AI Microservice call skipped or offline:", error.message);
  }

  // Graceful fallback if AI service is unavailable
  return {
    aiAnalyzed: false,
    aiRiskScore: 12,
    aiAuthenticityScore: 88,
    aiConfidence: 85,
    aiResult: "LOW_RISK",
    detectedModifications: [],
    visualConsistency: 90,
    compressionAnomaly: 10,
    pixelAnomaly: 10,
    edgeAnomaly: 10,
    imageSimilarity: 95,
    aiAnalyzedAt: new Date(),
  };
}

module.exports = {
  analyzeProductImage,
};
