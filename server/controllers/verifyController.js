const mongoose = require("mongoose");
const Product = require("../models/Product");
const Verification = require("../models/Verification");
const { generateProductHash } = require("../utils/hashGenerator");
const { verifyOnBlockchain } = require("../services/blockchainService");
const { analyzeProductImage } = require("../services/aiService");
const crypto = require("crypto");
const path = require("path");

// @desc    Public endpoint to verify product authenticity with AI forgery analysis
// @route   POST /api/verify
// @access  Public
const verifyProduct = async (req, res) => {
  try {
    const { code, productId, serialNumber } = req.body;
    let rawInput = productId || code || serialNumber;

    if (!rawInput) {
      return res.status(400).json({
        success: false,
        message: "Please provide a Product ID, Serial Number, or QR Code data.",
      });
    }

    // Clean and normalize input (support full verification URL or raw ID)
    let queryId = String(rawInput).trim();
    try {
      queryId = decodeURIComponent(queryId);
    } catch (e) {}

    if (queryId.includes("/verify/")) {
      queryId = queryId.split("/verify/")[1].split("?")[0];
    }

    queryId = queryId.replace(/\/+$/, "").trim().toUpperCase();

    // Verify DB Connection State
    if (mongoose.connection.readyState !== 1) {
      console.warn("⚠️ Database connection offline in verifyController");
      return res.status(503).json({
        success: false,
        message: "Database service unavailable. Please check MONGO_URI configuration.",
      });
    }

    // Generate unique audit verification ID
    const verificationId =
      "VERIF-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    // 1. Search in MongoDB by productId or serialNumber
    const product = await Product.findOne({
      $or: [{ productId: queryId }, { serialNumber: queryId }],
    }).populate("manufacturer", "name companyName email walletAddress");

    // Check if uploaded file is present or image path provided
    let submittedImagePath = req.file ? req.file.path : null;
    let registeredImagePath = null;

    if (product && product.productImage) {
      if (product.productImage.startsWith("/uploads/")) {
        registeredImagePath = path.join(__dirname, "..", product.productImage);
      }
    }

    // Case A: Product NOT found in database
    if (!product) {
      const aiData = await analyzeProductImage(submittedImagePath, registeredImagePath);

      try {
        await Verification.create({
          verificationId,
          productId: queryId,
          scannedCode: req.body.code || queryId,
          verificationStatus: "FAILED_NOT_FOUND",
          location: req.body.location || "Global Verification Portal",
          userAgent: req.headers["user-agent"] || "",
          ...aiData,
        });
      } catch (logErr) {
        console.warn("Verification log creation skipped:", logErr.message);
      }

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "NOT_AUTHENTIC",
        reason: "PRODUCT_NOT_FOUND",
        message: `No product registration record matches the query '${queryId}'.`,
        verificationId,
        searchedQuery: queryId,
        ai: aiData,
        timestamp: new Date(),
      });
    }

    // Perform AI Forgery Analysis for valid product record
    const aiData = await analyzeProductImage(submittedImagePath, registeredImagePath);

    // Case B: Product found but status is RECALLED / SUSPENDED / COUNTERFEIT
    if (product.status === "RECALLED" || product.status === "SUSPENDED" || product.status === "COUNTERFEIT") {
      try {
        await Verification.create({
          verificationId,
          productId: product.productId,
          scannedCode: req.body.code || queryId,
          verificationStatus: "FAILED_INACTIVE",
          location: req.body.location || "Global Verification Portal",
          userAgent: req.headers["user-agent"] || "",
          ...aiData,
        });
      } catch (logErr) {
        console.warn("Verification log creation skipped:", logErr.message);
      }

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "SUSPENDED_OR_RECALLED",
        reason: `PRODUCT_${product.status}`,
        message: `Warning: This product has been marked as ${product.status} by the manufacturer or system administrator. Do not purchase or distribute.`,
        verificationId,
        product,
        ai: aiData,
        timestamp: new Date(),
      });
    }

    // 2. Validate SHA-256 Hash Integrity
    const recomputedHash = generateProductHash({
      productId: product.productId,
      serialNumber: product.serialNumber,
      batchNumber: product.batchNumber,
      brandName: product.brandName,
      category: product.category,
    });

    const isHashValid = recomputedHash === product.productHash;

    if (!isHashValid) {
      try {
        await Verification.create({
          verificationId,
          productId: product.productId,
          scannedCode: req.body.code || queryId,
          verificationStatus: "FAILED_HASH_MISMATCH",
          location: req.body.location || "Global Verification Portal",
          userAgent: req.headers["user-agent"] || "",
          ...aiData,
        });
      } catch (logErr) {
        console.warn("Verification log creation skipped:", logErr.message);
      }

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "NOT_AUTHENTIC",
        reason: "HASH_MISMATCH_TAMPER_DETECTED",
        message: "Security Alert: Product cryptographic SHA-256 digital signature failed hash integrity verification. Possible counterfeit or tampered record.",
        verificationId,
        product,
        ai: aiData,
        timestamp: new Date(),
      });
    }

    // 3. Optional Blockchain direct check
    const blockchainRecord = await verifyOnBlockchain(product.productId);

    // 4. Save successful verification log with AI analysis results
    try {
      await Verification.create({
        verificationId,
        productId: product.productId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "SUCCESS",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
        blockchainTransactionHash: product.transactionHash || "",
        ...aiData,
      });
    } catch (logErr) {
      console.warn("Verification log creation skipped:", logErr.message);
    }

    // 5. Calculate total verification count
    let totalVerifications = 1;
    try {
      totalVerifications = await Verification.countDocuments({ productId: product.productId });
    } catch (countErr) {
      totalVerifications = 1;
    }

    return res.status(200).json({
      success: true,
      isAuthentic: true,
      status: "AUTHENTIC",
      message: "✓ Authentic Product Verified on Ethereum Blockchain",
      verificationId,
      product,
      hashMatch: true,
      computedHash: recomputedHash,
      storedHash: product.productHash,
      blockchain: {
        verified: blockchainRecord?.isVerified ?? true,
        contractAddress: blockchainRecord?.contractAddress || "",
        ownerWallet: product.ownerWallet || "",
        transactionHash: product.transactionHash || "",
      },
      ai: aiData,
      totalVerifications,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Verification Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification service error.",
      error: error.message,
    });
  }
};

// @desc    Get verification history for a product
// @route   GET /api/products/:productId/history
// @access  Public
const getProductVerificationHistory = async (req, res) => {
  try {
    const { productId } = req.params;

    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 0,
        verifications: [],
      });
    }

    const verifications = await Verification.find({ productId: productId.toUpperCase() })
      .sort({ createdAt: -1 })
      .populate("verifiedBy", "name email role");

    return res.status(200).json({
      success: true,
      count: verifications.length,
      verifications,
    });
  } catch (error) {
    console.error("Get History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch verification history.",
    });
  }
};

// @desc    Get verification by product ID URL param
// @route   GET /api/verify/:productId
// @access  Public
const getVerificationByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    req.body = { productId };
    return await verifyProduct(req, res);
  } catch (error) {
    console.error("Get Verification Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProductHistory = getProductVerificationHistory;

module.exports = {
  verifyProduct,
  getVerificationByProductId,
  getProductVerificationHistory,
  getProductHistory,
};
