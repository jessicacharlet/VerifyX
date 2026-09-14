const Asset = require("../models/Asset");
const VerificationHistory = require("../models/VerificationHistory");
const BlockchainRecord = require("../models/BlockchainRecord");
const { ensureDbConnected } = require("../utils/dbConnect");

// Helper to determine query filters based on user role
const getRoleFilters = (user) => {
  const isNonAdmin = user && user.role !== "admin";
  const assetFilter = isNonAdmin ? { ownerId: user._id } : {};
  const verificationFilter = isNonAdmin ? { userId: user._id } : {};
  return { assetFilter, verificationFilter };
};

// @desc    Get aggregated dashboard statistics from MongoDB
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    await ensureDbConnected();

    const { assetFilter, verificationFilter } = getRoleFilters(req.user);

    const [
      totalRegisteredAssets,
      authenticVerifications,
      modifiedAssets,
      notRegisteredCount,
      blockchainRegisteredCount,
    ] = await Promise.all([
      Asset.countDocuments(assetFilter),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "AUTHENTIC" }),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "MODIFIED" }),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "NOT_REGISTERED" }),
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
// @access  Private
const getRecentAssets = async (req, res) => {
  try {
    await ensureDbConnected();

    const { assetFilter } = getRoleFilters(req.user);

    const recentAssets = await Asset.find(assetFilter)
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
// @access  Private
const getRecentVerifications = async (req, res) => {
  try {
    await ensureDbConnected();

    const { verificationFilter } = getRoleFilters(req.user);

    const recentVerifications = await VerificationHistory.find(verificationFilter)
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

// @desc    Get complete unified dashboard summary (stats + recent assets + recent verifications in 1 roundtrip)
// @route   GET /api/dashboard or GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    await ensureDbConnected();

    const { assetFilter, verificationFilter } = getRoleFilters(req.user);

    const [
      totalRegisteredAssets,
      authenticVerifications,
      modifiedAssets,
      notRegisteredCount,
      blockchainRegisteredCount,
      recentAssets,
      recentVerifications,
    ] = await Promise.all([
      Asset.countDocuments(assetFilter),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "AUTHENTIC" }),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "MODIFIED" }),
      VerificationHistory.countDocuments({ ...verificationFilter, result: "NOT_REGISTERED" }),
      BlockchainRecord.countDocuments({ status: "CONFIRMED" }),
      Asset.find(assetFilter).sort({ createdAt: -1 }).limit(6).populate("ownerId", "name email").lean(),
      VerificationHistory.find(verificationFilter).sort({ timestamp: -1 }).limit(6).populate("userId", "name email").lean(),
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
      assets: recentAssets,
      verifications: recentVerifications,
    });
  } catch (error) {
    console.error("Get Dashboard Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard summary.",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
  getDashboardStats,
  getRecentAssets,
  getRecentVerifications,
};


