const Product = require("../models/Product");
const ScanEvent = require("../models/ScanEvent");
const Order = require("../models/Order");
const ProductIssue = require("../models/ProductIssue");
const Shipment = require("../models/Shipment");
const { recordLifecycleEventOnChain } = require("../services/blockchainService");
const { ensureDbConnected } = require("../utils/dbConnect");
const crypto = require("crypto");

// Allowed Strict Lifecycle Sequence
const STAGE_ORDER = [
  "ORDER_RECEIVED",
  "PRODUCT_ASSIGNED",
  "QR_GENERATED",
  "PACKED",
  "QUALITY_CHECK",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
];

// @desc    Employee QR Scan & Stage Transition Handler
// @route   POST /api/scans
// @access  Private / Public
const recordScanEvent = async (req, res) => {
  try {
    await ensureDbConnected();

    const {
      productId,
      targetStage,
      location,
      condition = "GOOD",
      sealCondition = "INTACT",
      accessoriesCondition = "COMPLETE",
      damageDetected = false,
      damageType,
      damageDescription,
      replacementRequired = false,
      courier,
      trackingNumber,
      remarks,
    } = req.body;

    if (!productId || !targetStage) {
      return res.status(400).json({
        success: false,
        message: "Please provide Product ID and target stage.",
      });
    }

    // Clean Product ID input
    let cleanId = String(productId).trim();
    try { cleanId = decodeURIComponent(cleanId); } catch (e) {}
    if (cleanId.includes("/verify/")) cleanId = cleanId.split("/verify/")[1].split("?")[0];
    if (cleanId.includes("/track/")) cleanId = cleanId.split("/track/")[1].split("?")[0];
    cleanId = cleanId.replace(/\/+$/, "").trim().toUpperCase();

    const product = await Product.findOne({
      $or: [{ productId: cleanId }, { serialNumber: cleanId }],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product '${cleanId}' not found in database.`,
      });
    }

    const currentStageIndex = STAGE_ORDER.indexOf(product.currentStage);
    const targetStageIndex = STAGE_ORDER.indexOf(targetStage);

    // Enforce strict stage transition progression
    if (targetStageIndex === -1) {
      return res.status(400).json({
        success: false,
        message: `Invalid stage '${targetStage}'. Must be one of: ${STAGE_ORDER.join(", ")}.`,
      });
    }

    // Rule: Cannot jump forward past the immediate next stage
    if (currentStageIndex !== -1 && targetStageIndex > currentStageIndex + 1) {
      // Special allowance: multiple IN_TRANSIT checkpoints after DISPATCHED or IN_TRANSIT
      const isMultipleTransit = targetStage === "IN_TRANSIT" && (product.currentStage === "DISPATCHED" || product.currentStage === "IN_TRANSIT");
      
      if (!isMultipleTransit) {
        return res.status(400).json({
          success: false,
          message: `Invalid stage jump! Product is currently at '${product.currentStage}'. Next required stage is '${STAGE_ORDER[currentStageIndex + 1] || targetStage}'. Cannot jump directly to '${targetStage}'.`,
        });
      }
    }

    // Rule: IN_TRANSIT requires DISPATCHED or prior IN_TRANSIT
    if (targetStage === "IN_TRANSIT" && product.currentStage !== "DISPATCHED" && product.currentStage !== "IN_TRANSIT") {
      return res.status(400).json({
        success: false,
        message: `Invalid transition! Product must be in 'DISPATCHED' stage before recording 'IN_TRANSIT' checkpoints. Current stage: '${product.currentStage}'.`,
      });
    }

    // Rule: DELIVERED requires IN_TRANSIT or DISPATCHED
    if (targetStage === "DELIVERED" && product.currentStage !== "IN_TRANSIT" && product.currentStage !== "DISPATCHED") {
      return res.status(400).json({
        success: false,
        message: `Invalid transition! Product must be in 'IN_TRANSIT' or 'DISPATCHED' stage before confirming 'DELIVERED'. Current stage: '${product.currentStage}'.`,
      });
    }

    const scanId = "SCAN-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
    const loc = location || product.currentLocation || "Central Logistics Hub";
    const employeeName = req.user ? req.user.name : "Supply Chain Operator";
    const empId = req.user ? req.user._id : null;

    let blockchainHash = "";
    try {
      const eventHashResult = await recordLifecycleEventOnChain(product.productId, targetStage, loc);
      blockchainHash = eventHashResult?.transactionHash || "";
    } catch (bcErr) {
      console.warn("Blockchain audit log skipped:", bcErr.message);
    }

    const scanEvent = await ScanEvent.create({
      scanId,
      productId: product.productId,
      orderId: product.orderId || "",
      stage: targetStage,
      employeeId: empId,
      employeeName,
      location: loc,
      condition: condition === "DAMAGED" || damageDetected ? "DAMAGED" : "GOOD",
      sealCondition,
      accessoriesCondition,
      damageDetected: Boolean(damageDetected || condition === "DAMAGED"),
      replacementRequired: Boolean(replacementRequired),
      remarks: remarks || `Scan completed at stage ${targetStage}`,
      blockchainHash,
      timestamp: new Date(),
    });

    if (damageDetected || condition === "DAMAGED" || targetStage === "QUALITY_ISSUE") {
      const issueId = "ISSUE-" + Date.now().toString(36).toUpperCase();
      await ProductIssue.create({
        issueId,
        productId: product.productId,
        orderId: product.orderId || "",
        issueType: damageType || "DAMAGE",
        stage: targetStage,
        location: loc,
        reportedBy: empId,
        reportedByName: employeeName,
        description: damageDescription || remarks || "Damage detected during scan checkpoint.",
        status: "OPEN",
      });
      product.condition = "DAMAGED";
      product.damageDetected = true;
    }

    if (replacementRequired) {
      product.replacementRequired = true;
      product.currentStage = "REPLACED";
    } else {
      product.currentStage = targetStage;
    }

    product.currentLocation = loc;
    await product.save();

    if (product.orderId) {
      const order = await Order.findOne({ orderId: product.orderId });
      if (order) {
        order.status = targetStage;
        await order.save();
      }
    }

    if (targetStage === "DISPATCHED") {
      const trackNo = trackingNumber || "TRK-VX-" + Math.floor(10000000 + Math.random() * 90000000) + "-" + Date.now().toString(36).toUpperCase();
      try {
        await Shipment.create({
          trackingNumber: trackNo,
          orderId: product.orderId || "",
          productId: product.productId,
          courier: courier || "VerifyX Express Logistics",
          origin: loc,
          destination: "Customer Destination",
          dispatchTime: new Date(),
          estimatedDelivery: new Date(Date.now() + 48 * 60 * 60 * 1000),
          status: "DISPATCHED",
          currentLocation: loc,
        });
      } catch (shpErr) {
        console.warn("Shipment record creation warning:", shpErr.message);
      }
    } else if (targetStage === "IN_TRANSIT") {
      const shipment = await Shipment.findOne({ productId: product.productId });
      if (shipment) {
        shipment.status = "IN_TRANSIT";
        shipment.currentLocation = loc;
        await shipment.save();
      }
    } else if (targetStage === "DELIVERED") {
      const shipment = await Shipment.findOne({ productId: product.productId });
      if (shipment) {
        shipment.status = "DELIVERED";
        shipment.currentLocation = loc;
        shipment.actualDelivery = new Date();
        await shipment.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: `Product ${product.productId} successfully updated to stage '${targetStage}'.`,
      scanEvent,
      product,
    });
  } catch (error) {
    console.error("Record Scan Event Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record scan event.",
      error: error.message,
    });
  }
};

// @desc    Get scan history logs for a product
// @route   GET /api/products/:id/scans
// @access  Public / Private
const getProductScans = async (req, res) => {
  try {
    await ensureDbConnected();

    const param = req.params.id.trim().toUpperCase();
    const scans = await ScanEvent.find({
      $or: [{ productId: param }, { orderId: param }],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: scans.length,
      scans,
    });
  } catch (error) {
    console.error("Get Product Scans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch scan history.",
    });
  }
};

module.exports = {
  recordScanEvent,
  getProductScans,
};
