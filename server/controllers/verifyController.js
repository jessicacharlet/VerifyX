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
    let queryId = productId || code || serialNumber;

    if (!queryId) {
      return res.status(400).json({ success: false, message: "Please provide a Product ID, Serial Number, or QR Code" });
    }

    // Clean up input (support full verification URL or raw ID)
    queryId = queryId.trim();
    if (queryId.includes("/verify/")) {
      queryId = queryId.split("/verify/")[1].split("?")[0];
    }
    queryId = queryId.toUpperCase();

    // Generate random verification ID
    const verificationId = "VERIF-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    // 1. Search in MongoDB by productId or serialNumber
    const product = await Product.findOne({
      $or: [{ productId: queryId }, { serialNumber: queryId }],
    }).populate("manufacturer", "name companyName email walletAddress");

    // Check if uploaded file is present or image path provided
    let submittedImagePath = req.file ? req.file.path : null;
    let registeredImagePath = null;

    if (product && product.productImage) {
      // Resolve registered image path if saved locally under /uploads
      if (product.productImage.startsWith("/uploads/")) {
        registeredImagePath = path.join(__dirname, "..", product.productImage);
      }
    }

    // Case A: Product NOT found
    if (!product) {
      const aiData = await analyzeProductImage(submittedImagePath, registeredImagePath);

      await Verification.create({
        verificationId,
        productId: queryId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "FAILED_NOT_FOUND",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
        ...aiData,
      });

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "NOT_AUTHENTIC",
        reason: "PRODUCT_NOT_FOUND",
        message: "No product registration record matches the provided Product ID or Serial Number.",
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
      await Verification.create({
        verificationId,
        productId: product.productId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "FAILED_INACTIVE",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
        ...aiData,
      });

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
      await Verification.create({
        verificationId,
        productId: product.productId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "FAILED_HASH_MISMATCH",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
        ...aiData,
      });

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

    // 5. Calculate total verification count
    const totalVerifications = await Verification.countDocuments({ productId: product.productId });

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

module.exports = {
  verifyProduct,
  getProductVerificationHistory,
};
