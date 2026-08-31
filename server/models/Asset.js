const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, "Asset ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assetName: {
      type: String,
      required: [true, "Asset Name is required"],
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    sha256Hash: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
    },
    storagePath: {
      type: String,
      default: "",
    },
    blockchainStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED", "NOT_CONFIGURED"],
      default: "NOT_CONFIGURED",
    },
    transactionHash: {
      type: String,
      default: "",
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    contractAddress: {
      type: String,
      default: "",
    },
    network: {
      type: String,
      default: "ethereum-sepolia",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);
