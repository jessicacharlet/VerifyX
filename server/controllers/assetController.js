const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const Asset = require("../models/Asset");
const User = require("../models/User");
const { ensureDbConnected } = require("../utils/dbConnect");
const { registerAssetOnChain } = require("../services/blockchainService");

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
    let fileBuffer;
    let originalFileName = "";
    let mimeType = "";
    let fileSize = 0;
    let savedStoragePath = "";

    if (req.file) {
      originalFileName = req.file.originalname;
      mimeType = req.file.mimetype || path.extname(req.file.originalname);
      fileSize = req.file.size;
      savedStoragePath = req.file.path;
      fileBuffer = fs.readFileSync(req.file.path);
    } else if (req.body.fileBuffer) {
      // Direct base64/buffer payload fallback
      fileBuffer = Buffer.from(req.body.fileBuffer, "base64");
      originalFileName = req.body.fileName || "digital-asset.dat";
      mimeType = req.body.fileType || "application/octet-stream";
      fileSize = fileBuffer.length;
    }

    // Compute REAL deterministic SHA-256 Hash from raw file bytes
    const sha256Hash = crypto.createHash("sha256").update(fileBuffer).digest("hex").toLowerCase();

    // Determine Owner ID (from JWT user or default fallback)
    let ownerId = req.user ? req.user._id : null;
    if (!ownerId) {
      const defaultUser = await User.findOne({});
      if (defaultUser) ownerId = defaultUser._id;
    }

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "User authentication required to register digital asset.",
      });
    }

    // Check for exact duplicate asset registered by the same owner
    const existingAsset = await Asset.findOne({ ownerId, sha256Hash });
    if (existingAsset) {
      return res.status(400).json({
        success: false,
        isDuplicate: true,
        message: `This asset content has already been registered as '${existingAsset.assetName}' (ID: ${existingAsset.assetId}).`,
        asset: existingAsset,
      });
    }

    // Generate unique Asset ID (e.g., AST-749201)
    let assetId = "";
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      assetId = `AST-${randomNum}`;
      const exists = await Asset.findOne({ assetId });
      if (!exists) isUnique = true;
      attempts++;
    }

    const finalAssetName = assetNameInput || originalFileName;

    // 1. Save Digital Asset Record to MongoDB
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

    console.log(`✅ Asset ${assetId} created with SHA-256: ${sha256Hash}`);

    // 2. Register SHA-256 Hash on Ethereum Smart Contract / Blockchain Service
    let bcResult = { status: "NOT_CONFIGURED", transactionHash: "" };
    try {
      bcResult = await registerAssetOnChain(assetId, sha256Hash);
      asset.blockchainStatus = bcResult.status;
      asset.transactionHash = bcResult.transactionHash || "";
      asset.blockNumber = bcResult.blockNumber || null;
      asset.contractAddress = bcResult.contractAddress || "";
      asset.network = bcResult.network || "Ethereum";
      await asset.save();
    } catch (bcErr) {
      console.warn("⚠️ On-chain registration warning:", bcErr.message);
    }

    return res.status(201).json({
      success: true,
      message: `Digital asset '${finalAssetName}' registered successfully with Asset ID ${assetId}.`,
      asset,
      blockchain: bcResult,
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
      .populate("ownerId", "name email role");

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
