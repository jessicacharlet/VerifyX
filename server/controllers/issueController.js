const ProductIssue = require("../models/ProductIssue");
const Product = require("../models/Product");

// @desc    Report a new product damage / quality issue
// @route   POST /api/issues
// @access  Public / Private
const createIssue = async (req, res) => {
  try {
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

    // Mark product as damaged / requiring attention
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

module.exports = {
  createIssue,
  getIssues,
  updateIssueStatus,
};
