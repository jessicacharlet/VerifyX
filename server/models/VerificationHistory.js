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
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fileName: {
      type: String,
      required: true,
    },
    submittedHash: {
      type: String,
      required: true,
      lowercase: true,
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
    },
    blockchainStatus: {
      type: String,
      enum: ["VERIFIED", "UNVERIFIED", "NOT_CONFIGURED", "FAILED"],
      default: "NOT_CONFIGURED",
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

module.exports = mongoose.model("VerificationHistory", verificationHistorySchema);
