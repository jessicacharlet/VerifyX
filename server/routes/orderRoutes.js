const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  assignProductToOrder,
} = require("../controllers/orderController");

router.route("/").post(createOrder).get(getOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/assign-product").post(assignProductToOrder);

module.exports = router;
