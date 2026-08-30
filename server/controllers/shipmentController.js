const Shipment = require("../models/Shipment");
const { ensureDbConnected } = require("../utils/dbConnect");

// @desc    Get all active shipments with filter
// @route   GET /api/shipments
// @access  Public / Private
const getShipments = async (req, res) => {
  try {
    await ensureDbConnected();

    const { status, search } = req.query;
    const query = {};

    if (status && status !== "ALL") query.status = status;
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: "i" } },
        { orderId: { $regex: search, $options: "i" } },
        { productId: { $regex: search, $options: "i" } },
      ];
    }

    const shipments = await Shipment.find(query).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: shipments.length,
      shipments,
    });
  } catch (error) {
    console.error("Get Shipments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch shipments.",
    });
  }
};

module.exports = {
  getShipments,
};
