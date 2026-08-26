const express = require("express");
const { verifyProduct, getVerificationByProductId, getProductHistory } = require("../controllers/verifyController");

const router = express.Router();

router.post("/", verifyProduct);
router.get("/:productId", getVerificationByProductId);

module.exports = router;
