const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Asset = require("../models/Asset");
const VerificationHistory = require("../models/VerificationHistory");
const { ensureDbConnected } = require("../utils/dbConnect");
const { verifyAssetOnChain } = require("../services/blockchainService");

// @desc    Verify uploaded digital asset against registered cryptographic records
// @route   POST /api/verify
// @access  Public
const verifyAsset = async (req, res) => {
  try {
    await ensureDbConnected();

    if (!req.file && !req.body.fileBuffer) {
      return res.status(400).json({
        success: false,
        message: "No file provided for verification. Please upload a file.",
      });
    }

    const providedAssetId = req.body.assetId ? String(req.body.assetId).trim().toUpperCase() : "";
    let fileBuffer;
    let originalFileName = "";

    if (req.file) {
      originalFileName = req.file.originalname;
      fileBuffer = fs.readFileSync(req.file.path);
    } else if (req.body.fileBuffer) {
      fileBuffer = Buffer.from(req.body.fileBuffer, "base64");
      originalFileName = req.body.fileName || "verification-file.dat";
    }

    // Compute REAL deterministic SHA-256 Hash from submitted file bytes
    const submittedHash = crypto.createHash("sha256").update(fileBuffer).digest("hex").toLowerCase();

    // Search Database for matching asset record
    let targetAsset = null;
    if (providedAssetId) {
      targetAsset = await Asset.findOne({ assetId: providedAssetId }).populate("ownerId", "name email role");
    }

    if (!targetAsset) {
      targetAsset = await Asset.findOne({ sha256Hash: submittedHash }).populate("ownerId", "name email role");
    }

    const verificationId = "VRF-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
    let result = "NOT_REGISTERED";
    let message = "No authenticity record was found for this digital asset.";
    let storedHash = "";
    let isHashMatch = false;

    if (targetAsset) {
      storedHash = targetAsset.sha256Hash.toLowerCase();
      if (storedHash === submittedHash) {
        result = "AUTHENTIC";
        isHashMatch = true;
        message = "✓ AUTHENTIC ASSET VERIFIED: Submitted file matches registered SHA-256 cryptographic signature.";
      } else {
        result = "MODIFIED";
        isHashMatch = false;
        message = "✕ ASSET MODIFIED / TAMPERED: Submitted file SHA-256 hash does not match registered fingerprint.";
      }
    }

    // Perform Blockchain Check if Asset Exists
    let blockchainVerification = { status: "NOT_CONFIGURED", isMatch: false };
    if (targetAsset) {
      try {
        blockchainVerification = await verifyAssetOnChain(targetAsset.assetId, submittedHash);
      } catch (bcErr) {
        console.warn("⚠️ Blockchain check warning:", bcErr.message);
      }
    }

    // Save Verification Attempt to VerificationHistory MongoDB collection
    const historyRecord = await VerificationHistory.create({
      verificationId,
      assetId: targetAsset ? targetAsset.assetId : providedAssetId || "UNREGISTERED",
      userId: req.user ? req.user._id : null,
      fileName: originalFileName,
      submittedHash,
      storedHash,
      result,
      blockchainStatus: blockchainVerification.status || "NOT_CONFIGURED",
      timestamp: new Date(),
    });

    return res.status(200).json({
      success: true,
      result,
      message,
      isAuthentic: result === "AUTHENTIC",
      isModified: result === "MODIFIED",
      isRegistered: result !== "NOT_REGISTERED",
      verificationId,
      submittedHash,
      storedHash,
      isHashMatch,
      asset: targetAsset,
      blockchain: blockchainVerification,
      timestamp: historyRecord.timestamp,
    });
  } catch (error) {
    console.error("Verify Asset Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Verification service error.",
      error: error.message,
    });
  }
};

// @desc    Get complete verification history logs
// @route   GET /api/verify/history
// @access  Public
const getVerificationHistory = async (req, res) => {
  try {
    await ensureDbConnected();

    const { result, search } = req.query;
    const query = {};

    if (result) query.result = result;
    if (search) {
      query.$or = [
        { verificationId: { $regex: search, $options: "i" } },
        { assetId: { $regex: search, $options: "i" } },
        { fileName: { $regex: search, $options: "i" } },
        { submittedHash: { $regex: search, $options: "i" } },
      ];
    }

    const history = await VerificationHistory.find(query)
      .sort({ timestamp: -1 })
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Get Verification History Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve verification history.",
      error: error.message,
    });
  }
};

// @desc    Get single verification attempt details
// @route   GET /api/verify/history/:id
// @access  Public
const getVerificationById = async (req, res) => {
  try {
    await ensureDbConnected();

    const queryId = req.params.id.trim();
    const record = await VerificationHistory.findOne({
      $or: [{ verificationId: queryId.toUpperCase() }, { verificationId: queryId }],
    }).populate("userId", "name email");

    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Verification record '${queryId}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    console.error("Get Verification Record Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve verification record details.",
    });
  }
};

module.exports = {
  verifyAsset,
  getVerificationHistory,
  getVerificationById,
};
