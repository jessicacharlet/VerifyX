const express = require("express");
const {
  getAdminUsers,
  getAdminProducts,
  getAdminVerifications,
  getAdminAnalytics,
  toggleUserStatus,
  updateAdminProductStatus,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/users", authorize("admin"), getAdminUsers);
router.get("/products", authorize("admin"), getAdminProducts);
router.get("/verifications", authorize("admin"), getAdminVerifications);
router.get("/analytics", authorize("admin", "manufacturer"), getAdminAnalytics);
router.put("/users/:id/toggle", authorize("admin"), toggleUserStatus);
router.put("/products/:id/status", authorize("admin"), updateAdminProductStatus);

module.exports = router;
