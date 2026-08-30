const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Product ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    orderId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
    },
    modelName: {
      type: String,
      trim: true,
      default: "",
    },
    brandName: {
      type: String,
      required: [true, "Brand Name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    batchNumber: {
      type: String,
      required: [true, "Batch Number is required"],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, "Serial Number is required"],
      unique: true,
      trim: true,
      index: true,
    },
    imei: {
      type: String,
      trim: true,
      default: "",
    },
    manufacturingDate: {
      type: Date,
      required: [true, "Manufacturing Date is required"],
    },
    expiryDate: {
      type: Date,
    },
    warehouse: {
      type: String,
      default: "Central Logistics Hub",
    },
    currentLocation: {
      type: String,
      default: "Warehouse Dispatch Bay",
    },
    currentStage: {
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
      default: "ORDER_RECEIVED",
      index: true,
    },
    condition: {
      type: String,
      enum: ["GOOD", "DAMAGED", "UNDER_REVIEW"],
      default: "GOOD",
    },
    damageDetected: {
      type: Boolean,
      default: false,
    },
    replacementRequired: {
      type: Boolean,
      default: false,
    },
    replacementFor: {
      type: String,
      default: "",
    },
    replacedBy: {
      type: String,
      default: "",
    },
    productImage: {
      type: String,
      default: "",
    },
    productHash: {
      type: String,
      required: [true, "SHA-256 Product Hash is required"],
      trim: true,
    },
    ownerWallet: {
      type: String,
      trim: true,
      default: "",
    },
    blockchainProductId: {
      type: String,
      trim: true,
      default: "",
    },
    transactionHash: {
      type: String,
      trim: true,
      default: "",
    },
    qrCode: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["AUTHENTIC", "ACTIVE", "RECALLED", "SUSPENDED", "COUNTERFEIT"],
      default: "AUTHENTIC",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
