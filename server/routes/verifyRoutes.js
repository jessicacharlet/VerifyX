const express = require("express");
const router = express.Router();
const { verifyAsset, getVerificationHistory, getVerificationById } = require("../controllers/verifyAssetController");
const { optionalAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/", optionalAuth, upload.single("file"), verifyAsset);
router.get("/history", getVerificationHistory);
router.get("/history/:id", getVerificationById);

module.exports = router;
