const mongoose = require("mongoose");

const verificationSchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    scannedCode: {
      type: String,
      default: "",
    },
    verificationStatus: {
      type: String,
      enum: ["SUCCESS", "FAILED_HASH_MISMATCH", "FAILED_NOT_FOUND", "FAILED_INACTIVE"],
      required: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    ipHash: {
      type: String,
      default: "ANONYMOUS_IP",
    },
    userAgent: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "Global Direct Scan",
    },
    blockchainTransactionHash: {
      type: String,
      default: "",
    },
    // AI Analysis Fields
    aiAnalyzed: {
      type: Boolean,
      default: false,
    },
    aiRiskScore: {
      type: Number,
      default: 0,
    },
    aiAuthenticityScore: {
      type: Number,
      default: 100,
    },
    aiConfidence: {
      type: Number,
      default: 90,
    },
    aiResult: {
      type: String,
      enum: ["LOW_RISK", "MODERATE_RISK", "HIGH_RISK", "NOT_ANALYZED"],
      default: "LOW_RISK",
    },
    detectedModifications: [
      {
        type: String,
      },
    ],
    visualConsistency: {
      type: Number,
      default: 90,
    },
    compressionAnomaly: {
      type: Number,
      default: 10,
    },
    pixelAnomaly: {
      type: Number,
      default: 10,
    },
    edgeAnomaly: {
      type: Number,
      default: 10,
    },
    imageSimilarity: {
      type: Number,
      default: 95,
    },
    aiAnalyzedAt: {
      type: Date,
      default: Date.now,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Verification", verificationSchema);
