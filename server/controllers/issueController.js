const ProductIssue = require("../models/ProductIssue");
const Product = require("../models/Product");
const Order = require("../models/Order");
const ScanEvent = require("../models/ScanEvent");
const QRCode = require("qrcode");
const { generateProductHash } = require("../utils/hashGenerator");
const { ensureDbConnected } = require("../utils/dbConnect");

// @desc    Report a new product damage / quality issue
// @route   POST /api/issues
// @access  Public / Private
const createIssue = async (req, res) => {
  try {
    await ensureDbConnected();

    const { productId, issueType, stage, location, description, photoUrl } = req.body;

    if (!productId || !issueType || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide Product ID, issue type, and description.",
      });
    }

    const cleanId = String(productId).trim().toUpperCase();
    const issueId = "ISSUE-" + Date.now().toString(36).toUpperCase();

    const issue = await ProductIssue.create({
      issueId,
      productId: cleanId,
      issueType,
      stage: stage || "QUALITY_CHECK",
      location: location || "Central Warehouse",
      reportedBy: req.user ? req.user._id : null,
      reportedByName: req.user ? req.user.name : "Quality Operator",
      description: description.trim(),
      photoUrl: photoUrl || "",
      status: "OPEN",
    });

    await Product.findOneAndUpdate(
      { productId: cleanId },
      { condition: "DAMAGED", damageDetected: true }
    );

    return res.status(201).json({
      success: true,
      message: `Issue ${issueId} logged successfully.`,
      issue,
    });
  } catch (error) {
    console.error("Create Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create issue report.",
      error: error.message,
    });
  }
};

// @desc    Get all product issues with status filter
// @route   GET /api/issues
// @access  Public / Private
const getIssues = async (req, res) => {
  try {
    await ensureDbConnected();

    const { status } = req.query;
    const query = {};
    if (status && status !== "ALL") query.status = status;

    const issues = await ProductIssue.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: issues.length,
      issues,
    });
  } catch (error) {
    console.error("Get Issues Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch issues.",
    });
  }
};

// @desc    Update / Resolve issue status
// @route   PUT /api/issues/:id
// @access  Public / Private
const updateIssueStatus = async (req, res) => {
  try {
    await ensureDbConnected();

    const { status, resolutionRemarks } = req.body;
    const issue = await ProductIssue.findOne({ issueId: req.params.id });

    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found." });
    }

    if (status) issue.status = status;
    if (resolutionRemarks) issue.resolutionRemarks = resolutionRemarks;

    await issue.save();

    if (status === "RESOLVED") {
      await Product.findOneAndUpdate(
        { productId: issue.productId },
        { condition: "GOOD", damageDetected: false }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Issue ${issue.issueId} updated to ${issue.status}.`,
      issue,
    });
  } catch (error) {
    console.error("Update Issue Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update issue.",
    });
  }
};

// @desc    Process Product Replacement — Retires damaged unit and issues fresh unit
// @route   POST /api/issues/:id/replacement
// @access  Private / Public
const processReplacement = async (req, res) => {
  try {
    await ensureDbConnected();

    const issue = await ProductIssue.findOne({ issueId: req.params.id });
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found." });
    }

    const origProduct = await Product.findOne({ productId: issue.productId });
    if (!origProduct) {
      return res.status(404).json({ success: false, message: "Original product record not found." });
    }

    // 1. Generate Replacement Product ID (e.g. VX-S21FE-000124)
    const prefix = origProduct.productName
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 5)
      .toUpperCase();
    const newProductId = `VX-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newSN = `SN-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBatch = `BATCH-2026-REPLACEMENT-${prefix}`;
    const wh = origProduct.warehouse || "Chennai Central Warehouse";

    const newProductHash = generateProductHash({
      productId: newProductId,
      serialNumber: newSN,
      batchNumber: newBatch,
      brandName: origProduct.brandName,
      category: origProduct.category,
    });

    const clientUrl = process.env.CLIENT_URL || "https://verify-x-tawny.vercel.app";
    const verificationUrl = `${clientUrl}/verify/${newProductId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });

    // 2. Create NEW Physical Product Unit linked to original
    const newProduct = await Product.create({
      productId: newProductId,
      orderId: origProduct.orderId,
      productName: origProduct.productName,
      modelName: origProduct.modelName,
      brandName: origProduct.brandName,
      category: origProduct.category,
      manufacturer: origProduct.manufacturer,
      batchNumber: newBatch,
      serialNumber: newSN,
      manufacturingDate: new Date(),
      warehouse: wh,
      currentLocation: wh,
      currentStage: "QR_GENERATED",
      condition: "GOOD",
      replacementFor: origProduct.productId,
      productHash: newProductHash,
      qrCode: qrCodeDataUrl,
      status: "AUTHENTIC",
    });

    // 3. Mark Original Product as REPLACED and link to new product
    origProduct.currentStage = "REPLACED";
    origProduct.replacementRequired = true;
    origProduct.replacedBy = newProductId;
    await origProduct.save();

    // 4. Create Replacement Audit Events
    await ScanEvent.create({
      scanId: "SCAN-" + Date.now().toString(36).toUpperCase() + "-REPLACED",
      productId: origProduct.productId,
      orderId: origProduct.orderId || "",
      stage: "REPLACED",
      employeeName: req.user ? req.user.name : "Quality Control Manager",
      location: wh,
      remarks: `Product retired & replaced by new unit ${newProductId} due to Issue ${issue.issueId}`,
      timestamp: new Date(),
    });

    await ScanEvent.create({
      scanId: "SCAN-" + Date.now().toString(36).toUpperCase() + "-NEW-QR",
      productId: newProductId,
      orderId: origProduct.orderId || "",
      stage: "QR_GENERATED",
      employeeName: req.user ? req.user.name : "Quality Control Manager",
      location: wh,
      remarks: `Replacement product generated for damaged unit ${origProduct.productId}. Verification URL: ${verificationUrl}`,
      timestamp: new Date(),
    });

    // 5. Update Order reference and Issue status
    if (origProduct.orderId) {
      const order = await Order.findOne({ orderId: origProduct.orderId });
      if (order) {
        order.assignedProducts.push(newProduct._id);
        order.status = "QR_GENERATED";
        await order.save();
      }
    }

    issue.status = "RESOLVED";
    issue.resolutionRemarks = `Replacement unit ${newProductId} issued for customer.`;
    await issue.save();

    return res.status(201).json({
      success: true,
      message: `Replacement product ${newProductId} issued for original unit ${origProduct.productId}.`,
      originalProduct: origProduct,
      replacementProduct: newProduct,
    });
  } catch (error) {
    console.error("Process Replacement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process replacement.",
      error: error.message,
    });
  }
};

module.exports = {
  createIssue,
  getIssues,
  updateIssueStatus,
  processReplacement,
};
