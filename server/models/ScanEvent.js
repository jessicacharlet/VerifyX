const mongoose = require("mongoose");

const scanEventSchema = new mongoose.Schema(
  {
    scanId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      index: true,
    },
    orderId: {
      type: String,
      default: "",
    },
    stage: {
      type: String,
      enum: [
        "ORDER_RECEIVED",
        "PRODUCT_ASSIGNED",
        "QR_GENERATED",
        "PACKED",
        "QUALITY_CHECK",
        "DISPATCHED",
        "IN_TRANSIT",
        "DELIVERED",
        "RETURNED",
        "REPLACED",
        "CANCELLED",
      ],
      required: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    employeeName: {
      type: String,
      default: "System Operator",
    },
    location: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["GOOD", "DAMAGED"],
      default: "GOOD",
    },
    sealCondition: {
      type: String,
      enum: ["INTACT", "BROKEN"],
      default: "INTACT",
    },
    accessoriesCondition: {
      type: String,
      enum: ["COMPLETE", "MISSING"],
      default: "COMPLETE",
    },
    damageDetected: {
      type: Boolean,
      default: false,
    },
    replacementRequired: {
      type: Boolean,
      default: false,
    },
    remarks: {
      type: String,
      default: "",
    },
    blockchainHash: {
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

module.exports = mongoose.model("ScanEvent", scanEventSchema);
