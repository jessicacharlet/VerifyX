const express = require("express");
const { verifyOnBlockchain } = require("../services/blockchainService");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/blockchain/product/:id - Direct blockchain verification readout
router.get("/product/:id", async (req, res) => {
  try {
    const result = await verifyOnBlockchain(req.params.id);
    return res.status(200).json({ success: true, blockchain: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/blockchain/register - Update product on-chain tx hash in DB
router.post("/register", async (req, res) => {
  try {
    const { productId, transactionHash, ownerWallet } = req.body;
    const product = await Product.findOne({ productId: productId.trim().toUpperCase() });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (transactionHash) product.transactionHash = transactionHash;
    if (ownerWallet) product.ownerWallet = ownerWallet;
    await product.save();

    return res.status(200).json({ success: true, message: "Blockchain transaction recorded", product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
