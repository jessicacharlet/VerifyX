const express = require("express");
const router = express.Router();
const { verifyAsset, getVerificationHistory, getVerificationById } = require("../controllers/verifyAssetController");
const { verifyProduct, getVerificationByProductId } = require("../controllers/verifyController");
const { optionalAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// POST /api/verify - handles both file upload verification and product code JSON verification
router.post("/", optionalAuth, upload.single("file"), (req, res, next) => {
  if (req.file || req.body?.fileBuffer) {
    return verifyAsset(req, res, next);
  }
  return verifyProduct(req, res, next);
});

router.get("/history", getVerificationHistory);
router.get("/history/:id", getVerificationById);
router.get("/:productId", getVerificationByProductId);

module.exports = router;
