const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Asset = require("../models/Asset");
const User = require("../models/User");
const { ensureDbConnected } = require("../utils/dbConnect");
const { registerAssetOnChain } = require("../services/blockchainService");
const { generateFileHashStream, generateBufferHash } = require("../utils/hashGenerator");

// @desc    Register a new Digital Asset (Upload File, Compute SHA-256 Hash, Save to MongoDB & Ethereum)
// @route   POST /api/assets/register
// @access  Private / Public
const registerAsset = async (req, res) => {
  try {
    await ensureDbConnected();

    if (!req.file && !req.body.fileBuffer) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please upload a valid digital asset file (PDF, DOCX, PNG, JPG, TXT).",
      });
    }

    const assetNameInput = req.body.assetName ? String(req.body.assetName).trim() : "";
    let originalFileName = "";
    let mimeType = "";
    let fileSize = 0;
    let savedStoragePath = "";
    let sha256Hash = "";

    if (req.file) {
      originalFileName = req.file.originalname;
      mimeType = req.file.mimetype || path.extname(req.file.originalname);
      fileSize = req.file.size;
      savedStoragePath = req.file.path;
      // High performance stream-based hash generation without loading entire file into RAM
      sha256Hash = await generateFileHashStream(req.file.path);
    } else if (req.body.fileBuffer) {
      const fileBuffer = Buffer.from(req.body.fileBuffer, "base64");
      originalFileName = req.body.fileName || "digital-asset.dat";
      mimeType = req.body.fileType || "application/octet-stream";
      fileSize = fileBuffer.length;
      sha256Hash = generateBufferHash(fileBuffer);
    }

    // Determine Owner ID (from JWT user or default fallback)
    let ownerId = req.user ? req.user._id : null;
    if (!ownerId) {
      const defaultUser = await User.findOne({}).select("_id").lean();
      if (defaultUser) ownerId = defaultUser._id;
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required to register digital asset.",
      });
    }

    // Check for exact duplicate asset registered by the same owner
    const existingAsset = await Asset.findOne({ ownerId, sha256Hash }).lean();
    if (existingAsset) {
      return res.status(400).json({
        success: false,
        isDuplicate: true,
        message: `This asset content has already been registered as '${existingAsset.assetName}' (ID: ${existingAsset.assetId}).`,
        asset: existingAsset,
      });
    }

    // Generate unique Asset ID (e.g., AST-749201)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const assetId = `AST-${randomNum}`;
    const finalAssetName = assetNameInput || originalFileName;

    // 1. Save Digital Asset Record to MongoDB immediately
    const asset = await Asset.create({
      assetId,
      ownerId,
      assetName: finalAssetName,
      fileName: originalFileName,
      fileType: mimeType,
      fileSize,
      sha256Hash,
      storagePath: savedStoragePath,
      blockchainStatus: "PENDING",
    });

    // 2. Trigger On-Chain Blockchain registration asynchronously in the background (Non-blocking)
    registerAssetOnChain(assetId, sha256Hash).catch((bcErr) => {
      console.warn("⚠️ Background blockchain registration warning:", bcErr.message);
    });

    // Return instant success response to client
    return res.status(201).json({
      success: true,
      message: `Digital asset '${finalAssetName}' registered successfully with Asset ID ${assetId}.`,
      asset,
      blockchain: {
        status: "PENDING",
        message: "Blockchain transaction queued for background execution.",
      },
    });
  } catch (error) {
    console.error("Register Asset Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register digital asset.",
      error: error.message,
    });
  }
};

// @desc    Get all registered assets (with search and filters)
// @route   GET /api/assets
// @access  Private / Public
const getAssets = async (req, res) => {
  try {
    await ensureDbConnected();

    const { search, fileType, blockchainStatus } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { assetId: { $regex: search, $options: "i" } },
        { assetName: { $regex: search, $options: "i" } },
        { fileName: { $regex: search, $options: "i" } },
        { sha256Hash: { $regex: search, $options: "i" } },
      ];
    }

    if (fileType) query.fileType = fileType;
    if (blockchainStatus) query.blockchainStatus = blockchainStatus;

    const assets = await Asset.find(query)
      .sort({ createdAt: -1 })
      .populate("ownerId", "name email role")
      .lean();

    return res.status(200).json({
      success: true,
      count: assets.length,
      assets,
    });
  } catch (error) {
    console.error("Get Assets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve registered assets.",
      error: error.message,
    });
  }
};

// @desc    Get single asset details by assetId or _id
// @route   GET /api/assets/:id
// @access  Public
const getAssetById = async (req, res) => {
  try {
    await ensureDbConnected();

    const queryId = req.params.id.trim();
    let asset = await Asset.findOne({
      $or: [{ assetId: queryId.toUpperCase() }, { assetId: queryId }],
    }).populate("ownerId", "name email role");

    if (!asset && queryId.match(/^[0-9a-fA-F]{24}$/)) {
      asset = await Asset.findById(queryId).populate("ownerId", "name email role");
    }

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: `Asset with ID '${queryId}' not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      asset,
    });
  } catch (error) {
    console.error("Get Asset By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve asset details.",
      error: error.message,
    });
  }
};

module.exports = {
  registerAsset,
  getAssets,
  getAssetById,
};

