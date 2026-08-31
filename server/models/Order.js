const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, "Order ID is required"],
      unique: true,
      trim: true,
      index: true,
    },
    externalOrderId: {
      type: String,
      trim: true,
      default: "",
    },
    salesChannel: {
      type: String,
      trim: true,
      default: "Direct Sales",
    },
    customerName: {
      type: String,
      required: [true, "Customer Name is required"],
      trim: true,
    },
    customerContact: {
      type: String,
      required: [true, "Customer Contact is required"],
      trim: true,
    },
    customerAddress: {
      type: String,
      required: [true, "Customer Address is required"],
      trim: true,
    },
    productName: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    assignedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orderDate: {
      type: Date,
      default: Date.now,
    },
    expectedDeliveryDate: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING", "REFUNDED"],
      default: "PAID",
    },
    status: {
      type: String,
      enum: [
        "ORDER_RECEIVED",
        "PRODUCT_ASSIGNED",
        "QR_GENERATED",
        "PROCESSING",
        "PACKED",
        "QUALITY_CHECK",
        "DISPATCHED",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "ORDER_RECEIVED",
      index: true,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
