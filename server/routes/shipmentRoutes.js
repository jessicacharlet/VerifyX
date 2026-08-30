const express = require("express");
const router = express.Router();
const { getShipments } = require("../controllers/shipmentController");

router.route("/").get(getShipments);

module.exports = router;
