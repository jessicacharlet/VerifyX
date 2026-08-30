const Order = require("../models/Order");
const Product = require("../models/Product");
const ScanEvent = require("../models/ScanEvent");
const { generateProductHash } = require("../utils/hashGenerator");
const QRCode = require("qrcode");
const crypto = require("crypto");

// @desc    Create a new customer order
// @route   POST /api/orders
// @access  Private / Public
const createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerContact,
      customerAddress,
      productName,
      model,
      quantity = 1,
      expectedDeliveryDate,
      remarks,
    } = req.body;

    if (!customerName || !customerContact || !customerAddress || !productName) {
      return res.status(400).json({
        success: false,
        message: "Please provide customer name, contact, address, and product name.",
      });
    }

    const orderId = "ORD-" + new Date().getFullYear() + "-" + Math.floor(10000 + Math.random() * 90000);

    const order = await Order.create({
      orderId,
      customerName: customerName.trim(),
      customerContact: customerContact.trim(),
      customerAddress: customerAddress.trim(),
      productName: productName.trim(),
      model: model ? model.trim() : "",
      quantity: Number(quantity) || 1,
      expectedDeliveryDate: expectedDeliveryDate
        ? new Date(expectedDeliveryDate)
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      paymentStatus: "PAID",
      status: "ORDER_RECEIVED",
      remarks: remarks || "",
    });

    return res.status(201).json({
      success: true,
      message: `Order ${orderId} created successfully.`,
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
      error: error.message,
    });
  }
};

// @desc    Get all orders with optional search and status filter
// @route   GET /api/orders
// @access  Public / Private
const getOrders = async (req, res) => {
  try {
    const { search, status } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("assignedProducts")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
    });
  }
};

// @desc    Get single order detail by Order ID
// @route   GET /api/orders/:id
// @access  Public / Private
const getOrderById = async (req, res) => {
  try {
    const param = req.params.id.trim().toUpperCase();
    let order = await Order.findOne({ orderId: param }).populate("assignedProducts");

    if (!order && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id).populate("assignedProducts");
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get Order By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details.",
    });
  }
};

// @desc    Assign a physical product to an order & generate unique QR code
// @route   POST /api/orders/:id/assign-product
// @access  Private / Public
const assignProductToOrder = async (req, res) => {
  try {
    const orderIdParam = req.params.id.trim().toUpperCase();
    const { serialNumber, batchNumber, brandName, category, imei, warehouse } = req.body;

    let order = await Order.findOne({ orderId: orderIdParam });
    if (!order && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    // Generate Unique Product ID: e.g. VX-S21FE-000123
    const prefix = order.productName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 5)
      .toUpperCase();
    const productId = `VX-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

    const sn = serialNumber ? serialNumber.trim().toUpperCase() : `SN-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const batch = batchNumber ? batchNumber.trim().toUpperCase() : `BATCH-2026-${prefix}`;
    const brand = brandName ? brandName.trim() : "Samsung";
    const cat = category ? category.trim() : "Smartphones";
    const wh = warehouse ? warehouse.trim() : "Chennai Central Warehouse";

    // Generate SHA-256 Hash
    const productHash = generateProductHash({
      productId,
      serialNumber: sn,
      batchNumber: batch,
      brandName: brand,
      category: cat,
    });

    // Generate QR Code URL
    const clientUrl = process.env.CLIENT_URL || "https://verify-x-tawny.vercel.app";
    const verificationUrl = `${clientUrl}/verify/${productId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });

    // Fallback system user ID if req.user is undefined
    let mfgId = req.user ? req.user._id : null;
    if (!mfgId) {
      const User = require("../models/User");
      const defaultUser = await User.findOne({});
      if (defaultUser) mfgId = defaultUser._id;
    }

    const product = await Product.create({
      productId,
      orderId: order.orderId,
      productName: order.productName,
      modelName: order.model || order.productName,
      brandName: brand,
      category: cat,
      manufacturer: mfgId,
      batchNumber: batch,
      serialNumber: sn,
      imei: imei || "",
      manufacturingDate: new Date(),
      warehouse: wh,
      currentLocation: wh,
      currentStage: "PRODUCT_ASSIGNED",
      productHash,
      qrCode: qrCodeDataUrl,
      status: "AUTHENTIC",
    });

    // Link assigned product to order
    order.assignedProducts.push(product._id);
    order.status = "PROCESSING";
    await order.save();

    // Create Audit Scan Events: ORDER_RECEIVED and PRODUCT_ASSIGNED
    await ScanEvent.create({
      scanId: "SCAN-" + Date.now().toString(36).toUpperCase() + "-1",
      productId,
      orderId: order.orderId,
      stage: "ORDER_RECEIVED",
      employeeName: req.user ? req.user.name : "Order Desk Operator",
      location: wh,
      remarks: `Order ${order.orderId} created for customer ${order.customerName}`,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-" + Date.now().toString(36).toUpperCase() + "-2",
      productId,
      orderId: order.orderId,
      stage: "PRODUCT_ASSIGNED",
      employeeName: req.user ? req.user.name : "Warehouse Manager",
      location: wh,
      remarks: `Unique Product ID ${productId} assigned & QR code generated`,
      timestamp: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: `Product ${productId} assigned to Order ${order.orderId}. Unique QR generated.`,
      product,
      order,
    });
  } catch (error) {
    console.error("Assign Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign product to order.",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  assignProductToOrder,
};
