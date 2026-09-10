const express = require("express");
const router = express.Router();
const {
  getDashboardSummary,
  getDashboardStats,
  getRecentAssets,
  getRecentVerifications,
} = require("../controllers/dashboardController");

router.get("/", getDashboardSummary);
router.get("/summary", getDashboardSummary);
router.get("/stats", getDashboardStats);
router.get("/recent-assets", getRecentAssets);
router.get("/recent-verifications", getRecentVerifications);

module.exports = router;

