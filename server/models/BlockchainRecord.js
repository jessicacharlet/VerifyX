const mongoose = require("mongoose");

const blockchainRecordSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    scanId: {
      type: String,
      default: "",
    },
    stage: {
      type: String,
      required: true,
    },
    eventHash: {
      type: String,
      required: true,
      index: true,
    },
    transactionHash: {
      type: String,
      default: "",
    },
    blockNumber: {
      type: Number,
      default: 0,
    },
    network: {
      type: String,
      default: "Ethereum Sepolia / Hardhat Local",
    },
    contractAddress: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "PENDING", "FAILED", "NOT_CONFIGURED"],
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
