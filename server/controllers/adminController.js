const User = require("../models/User");
const Product = require("../models/Product");
const Verification = require("../models/Verification");

// @desc    Get system users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    console.error("Get Admin Users Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// @desc    Get all products for monitoring
// @route   GET /api/admin/products
// @access  Private (Admin)
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("manufacturer", "name companyName email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    console.error("Get Admin Products Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// @desc    Get global verifications
// @route   GET /api/admin/verifications
// @access  Private (Admin)
const getAdminVerifications = async (req, res) => {
  try {
    const verifications = await Verification.find().sort({ timestamp: -1 }).limit(100);
    return res.status(200).json({ success: true, count: verifications.length, verifications });
  } catch (error) {
    console.error("Get Admin Verifications Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch verification activity" });
  }
};

// @desc    Get administrative & AI telemetry analytics summary & chart stats
// @route   GET /api/admin/analytics
// @access  Private (Admin / Manufacturer)
const getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const manufacturers = await User.countDocuments({ role: "manufacturer" });
    const customers = await User.countDocuments({ role: "customer" });

    const totalProducts = await Product.countDocuments();
    const authenticProducts = await Product.countDocuments({ status: "AUTHENTIC" });
    const activeProducts = await Product.countDocuments({ status: "ACTIVE" });
    const recalledProducts = await Product.countDocuments({ status: "RECALLED" });
    const suspendedProducts = await Product.countDocuments({ status: "SUSPENDED" });

    const totalVerifications = await Verification.countDocuments();
    const successfulVerifications = await Verification.countDocuments({ verificationStatus: "SUCCESS" });
    const suspiciousVerifications = await Verification.countDocuments({
      verificationStatus: { $ne: "SUCCESS" },
    });

    // AI Telemetry & Risk Analytics
    const totalAiAnalyses = await Verification.countDocuments();
    const lowRiskCount = await Verification.countDocuments({ aiRiskScore: { $lte: 30 } });
    const moderateRiskCount = await Verification.countDocuments({ aiRiskScore: { $gt: 30, $lte: 60 } });
    const highRiskCount = await Verification.countDocuments({ aiRiskScore: { $gt: 60 } });

    const avgRiskAgg = await Verification.aggregate([
      { $group: { _id: null, avgRisk: { $avg: "$aiRiskScore" } } },
    ]);
    const averageRiskScore = avgRiskAgg.length > 0 ? Math.round(avgRiskAgg[0].avgRisk || 12) : 12;

    const aiRiskDistribution = [
      { name: "Low Risk", value: lowRiskCount || (totalVerifications > 0 ? totalVerifications : 1) },
      { name: "Moderate Risk", value: moderateRiskCount },
      { name: "High Risk", value: highRiskCount },
    ];

    // Category distribution
    const categoryAgg = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Status distribution
    const statusAgg = await Product.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent verifications log
    const recentVerifications = await Verification.find().sort({ timestamp: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        manufacturers,
        customers,
        totalProducts,
        authenticProducts,
        activeProducts,
        recalledProducts,
        suspendedProducts,
        totalVerifications,
        successfulVerifications,
        suspiciousVerifications,
        categories: categoryAgg.map((c) => ({ name: c._id, value: c.count })),
        statuses: statusAgg.map((s) => ({ status: s._id, count: s.count })),
        recentVerifications,
        // AI Analytics
        totalAiAnalyses,
        lowRiskCount,
        moderateRiskCount,
        highRiskCount,
        averageRiskScore,
        aiRiskDistribution,
      },
    });
  } catch (error) {
    console.error("Get Analytics Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to load dashboard analytics" });
  }
};

// @desc    Toggle user status (Active / Inactive)
// @route   PUT /api/admin/users/:id/toggle
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User status changed to ${user.isActive ? "Active" : "Deactivated"}`,
      user: { id: user._id, name: user.name, isActive: user.isActive },
    });
  } catch (error) {
    console.error("Toggle User Status Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to update user status" });
  }
};

// @desc    Update product status (e.g., flag as SUSPENDED / COUNTERFEIT)
// @route   PUT /api/admin/products/:id/status
// @access  Private (Admin)
const updateAdminProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findOne({ productId: req.params.id.trim().toUpperCase() });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = status || "SUSPENDED";
    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ${product.productId} status updated to ${product.status}`,
      product,
    });
  } catch (error) {
    console.error("Update Admin Product Status Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to update product status" });
  }
};

module.exports = {
  getAdminUsers,
  getAdminProducts,
  getAdminVerifications,
  getAdminAnalytics,
  toggleUserStatus,
  updateAdminProductStatus,
};
