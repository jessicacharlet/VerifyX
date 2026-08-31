const express = require("express");
const router = express.Router();
const { registerAsset, getAssets, getAssetById } = require("../controllers/assetController");
const { optionalAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/register", optionalAuth, upload.single("file"), registerAsset);
router.get("/", getAssets);
router.get("/:id", getAssetById);

module.exports = router;
