const mongoose = require("mongoose");

const productIssueSchema = new mongoose.Schema(
  {
    issueId: {
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
    issueType: {
      type: String,
      enum: [
        "DAMAGE",
        "MISSING_ACCESSORY",
        "BROKEN_SEAL",
        "WRONG_PRODUCT",
        "SERIAL_MISMATCH",
        "REPLACEMENT",
        "OTHER",
      ],
      required: true,
    },
    stage: {
      type: String,
      default: "QUALITY_CHECK",
    },
    location: {
      type: String,
      default: "Central Warehouse",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedByName: {
      type: String,
      default: "Warehouse Employee",
    },
    description: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"],
      default: "OPEN",
    },
    resolutionRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProductIssue", productIssueSchema);
