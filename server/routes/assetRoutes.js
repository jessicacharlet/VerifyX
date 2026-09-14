const express = require("express");
const router = express.Router();
const { registerAsset, getAssets, getAssetById } = require("../controllers/assetController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/register", protect, upload.single("file"), registerAsset);
router.get("/", protect, getAssets);
router.get("/:id", protect, getAssetById);

module.exports = router;
