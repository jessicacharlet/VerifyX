const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  transferOwnership,
  deactivateProduct,
} = require("../controllers/productController");
const { getProductHistory } = require("../controllers/verifyController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure Multer storage
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.post("/", protect, authorize("manufacturer", "admin"), upload.single("productImage"), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/history", getProductHistory);
router.put("/:id", protect, authorize("manufacturer", "admin"), updateProduct);
router.post("/:id/transfer", protect, authorize("manufacturer", "admin"), transferOwnership);
router.post("/:id/deactivate", protect, authorize("manufacturer", "admin"), deactivateProduct);

module.exports = router;
