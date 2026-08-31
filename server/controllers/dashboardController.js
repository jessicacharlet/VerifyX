const Asset = require("../models/Asset");
const VerificationHistory = require("../models/VerificationHistory");
const BlockchainRecord = require("../models/BlockchainRecord");
const { ensureDbConnected } = require("../utils/dbConnect");

// @desc    Get aggregated dashboard statistics from MongoDB
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    await ensureDbConnected();

    const [
      totalRegisteredAssets,
      authenticVerifications,
      modifiedAssets,
      notRegisteredCount,
      blockchainRegisteredCount,
    ] = await Promise.all([
      Asset.countDocuments(),
      VerificationHistory.countDocuments({ result: "AUTHENTIC" }),
      VerificationHistory.countDocuments({ result: "MODIFIED" }),
      VerificationHistory.countDocuments({ result: "NOT_REGISTERED" }),
      BlockchainRecord.countDocuments({ status: "CONFIRMED" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalRegisteredAssets,
        authenticVerifications,
        modifiedAssets,
        notRegisteredCount,
        blockchainRegisteredCount,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
      error: error.message,
    });
  }
};

// @desc    Get recent registered digital assets
// @route   GET /api/dashboard/recent-assets
// @access  Public
const getRecentAssets = async (req, res) => {
  try {
    await ensureDbConnected();

    const recentAssets = await Asset.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("ownerId", "name email");

    return res.status(200).json({
      success: true,
      count: recentAssets.length,
      assets: recentAssets,
    });
  } catch (error) {
    console.error("Get Recent Assets Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load recent assets.",
    });
  }
};

// @desc    Get recent asset verification attempts
// @route   GET /api/dashboard/recent-verifications
// @access  Public
const getRecentVerifications = async (req, res) => {
  try {
    await ensureDbConnected();

    const recentVerifications = await VerificationHistory.find()
      .sort({ timestamp: -1 })
      .limit(6)
      .populate("userId", "name email");

    return res.status(200).json({
      success: true,
      count: recentVerifications.length,
      verifications: recentVerifications,
    });
  } catch (error) {
    console.error("Get Recent Verifications Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load recent verifications.",
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentAssets,
  getRecentVerifications,
};
