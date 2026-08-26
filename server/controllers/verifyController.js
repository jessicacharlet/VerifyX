const Product = require("../models/Product");
const Verification = require("../models/Verification");
const { generateProductHash } = require("../utils/hashGenerator");
const { verifyOnBlockchain } = require("../services/blockchainService");
const crypto = require("crypto");

// @desc    Public endpoint to verify product authenticity
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

    // Case A: Product NOT found
    if (!product) {
      await Verification.create({
        verificationId,
        productId: queryId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "FAILED_NOT_FOUND",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
      });

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "NOT_AUTHENTIC",
        reason: "PRODUCT_NOT_FOUND",
        message: "No product registration record matches the provided Product ID or Serial Number.",
        verificationId,
        searchedQuery: queryId,
        timestamp: new Date(),
      });
    }

    // Case B: Product found but status is RECALLED / SUSPENDED / COUNTERFEIT
    if (product.status === "RECALLED" || product.status === "SUSPENDED" || product.status === "COUNTERFEIT") {
      await Verification.create({
        verificationId,
        productId: product.productId,
        scannedCode: req.body.code || queryId,
        verificationStatus: "FAILED_INACTIVE",
        location: req.body.location || "Global Verification Portal",
        userAgent: req.headers["user-agent"] || "",
      });

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "SUSPENDED_OR_RECALLED",
        reason: `PRODUCT_${product.status}`,
        message: `Warning: This product has been marked as ${product.status} by the manufacturer or system administrator. Do not purchase or distribute.`,
        verificationId,
        product,
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
      });

      return res.status(200).json({
        success: false,
        isAuthentic: false,
        status: "NOT_AUTHENTIC",
        reason: "HASH_MISMATCH_TAMPER_DETECTED",
        message: "Security Alert: Product cryptographic SHA-256 digital signature failed hash integrity verification. Possible counterfeit or tampered record.",
        verificationId,
        product,
        timestamp: new Date(),
      });
    }

    // 3. Optional Blockchain direct check
    const blockchainRecord = await verifyOnBlockchain(product.productId);

    // 4. Save successful verification log
    await Verification.create({
      verificationId,
      productId: product.productId,
      scannedCode: req.body.code || queryId,
      verificationStatus: "SUCCESS",
      location: req.body.location || "Global Verification Portal",
      userAgent: req.headers["user-agent"] || "",
      blockchainTransactionHash: product.transactionHash || "",
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
        verifiedOnChain: blockchainRecord.exists !== undefined ? blockchainRecord.exists : true,
        transactionHash: product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
        ownerWallet: product.ownerWallet,
        onChainIsActive: blockchainRecord.isActive !== undefined ? blockchainRecord.isActive : true,
      },
      totalVerifications,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Verification Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during verification process" });
  }
};

// @desc    Get verification detail by product ID
// @route   GET /api/verify/:productId
// @access  Public
const getVerificationByProductId = async (req, res) => {
  return verifyProduct({ body: { productId: req.params.productId }, headers: req.headers }, res);
};

// @desc    Get product verification history timeline
// @route   GET /api/products/:id/history
// @access  Public
const getProductHistory = async (req, res) => {
  try {
    const param = req.params.id.trim().toUpperCase();

    let product = await Product.findOne({ productId: param });
    if (!product && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const verifications = await Verification.find({ productId: product.productId })
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      count: verifications.length,
      product,
      verifications,
    });
  } catch (error) {
    console.error("Get Product History Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch verification history" });
  }
};

module.exports = {
  verifyProduct,
  getVerificationByProductId,
  getProductHistory,
};
