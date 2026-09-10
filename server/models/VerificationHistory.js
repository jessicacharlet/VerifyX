const mongoose = require("mongoose");

const verificationHistorySchema = new mongoose.Schema(
  {
    verificationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    assetId: {
      type: String,
      default: "",
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    submittedHash: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    storedHash: {
      type: String,
      default: "",
      lowercase: true,
    },
    result: {
      type: String,
      enum: ["AUTHENTIC", "MODIFIED", "NOT_REGISTERED", "VERIFICATION_ERROR"],
      required: true,
      index: true,
    },
    blockchainStatus: {
      type: String,
      enum: ["VERIFIED", "UNVERIFIED", "NOT_CONFIGURED", "FAILED", "PENDING", "CONFIRMED"],
      default: "NOT_CONFIGURED",
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

verificationHistorySchema.index({ timestamp: -1, result: 1 });
verificationHistorySchema.index({ createdAt: -1 });

module.exports = mongoose.model("VerificationHistory", verificationHistorySchema);
