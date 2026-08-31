const mongoose = require("mongoose");

const blockchainRecordSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    assetId: {
      type: String,
      required: true,
      index: true,
    },
    sha256Hash: {
      type: String,
      required: true,
    },
    transactionHash: {
      type: String,
      default: "",
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    network: {
      type: String,
      default: "Ethereum",
    },
    contractAddress: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "FAILED", "NOT_CONFIGURED"],
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

module.exports = mongoose.model("BlockchainRecord", blockchainRecordSchema);
