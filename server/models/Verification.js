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
