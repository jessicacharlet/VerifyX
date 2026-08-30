const express = require("express");
const router = express.Router();
const { recordScanEvent, getProductScans } = require("../controllers/scanController");

router.route("/").post(recordScanEvent);
router.route("/products/:id/scans").get(getProductScans);

module.exports = router;
