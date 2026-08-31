const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getRecentAssets,
  getRecentVerifications,
} = require("../controllers/dashboardController");

router.get("/stats", getDashboardStats);
router.get("/recent-assets", getRecentAssets);
router.get("/recent-verifications", getRecentVerifications);

module.exports = router;
