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
    productName: {
      type: String,
      required: [true, "Product Name is required"],
      trim: true,
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
    manufacturingDate: {
      type: Date,
      required: [true, "Manufacturing Date is required"],
    },
    expiryDate: {
      type: Date,
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
