const Product = require("../models/Product");
const { generateProductHash } = require("../utils/hashGenerator");
const QRCode = require("qrcode");

// @desc    Register a new product
// @route   POST /api/products
// @access  Private (Manufacturer / Admin)
const createProduct = async (req, res) => {
  try {
    const {
      productId,
      productName,
      brandName,
      category,
      description,
      batchNumber,
      serialNumber,
      manufacturingDate,
      expiryDate,
      productImage,
      ownerWallet,
      transactionHash,
      blockchainProductId,
    } = req.body;

    if (!productId || !productName || !brandName || !category || !batchNumber || !serialNumber || !manufacturingDate) {
      return res.status(400).json({ success: false, message: "Please provide all required product fields" });
    }

    // Check duplicate productId or serialNumber
    const existingProduct = await Product.findOne({
      $or: [{ productId: productId.trim().toUpperCase() }, { serialNumber: serialNumber.trim().toUpperCase() }],
    });

    if (existingProduct) {
      if (existingProduct.productId === productId.trim().toUpperCase()) {
        return res.status(400).json({ success: false, message: `Product ID '${productId}' is already registered` });
      }
      return res.status(400).json({ success: false, message: `Serial Number '${serialNumber}' is already registered` });
    }

    // Generate SHA-256 Hash
    const productHash = generateProductHash({
      productId,
      serialNumber,
      batchNumber,
      brandName,
      category,
    });

    // Generate QR Code URL & Base64 Data URL
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const verificationUrl = `${clientUrl}/verify/${productId.trim().toUpperCase()}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    });

    let imageUrl = productImage || "";
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      productId: productId.trim().toUpperCase(),
      productName: productName.trim(),
      brandName: brandName.trim(),
      category: category.trim(),
      manufacturer: req.user._id,
      description: description || "",
      batchNumber: batchNumber.trim(),
      serialNumber: serialNumber.trim().toUpperCase(),
      manufacturingDate: new Date(manufacturingDate),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      productImage: imageUrl,
      productHash,
      ownerWallet: ownerWallet || req.user.walletAddress || "",
      blockchainProductId: blockchainProductId || productId.trim().toUpperCase(),
      transactionHash: transactionHash || "",
      qrCode: qrCodeDataUrl,
      status: "AUTHENTIC",
    });

    return res.status(201).json({
      success: true,
      message: "Product registered successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error.message);
    return res.status(500).json({ success: false, message: error.message || "Failed to register product" });
  }
};

// @desc    Get all products with search, filter, and pagination
// @route   GET /api/products
// @access  Public / Private
const getProducts = async (req, res) => {
  try {
    const { search, category, status, manufacturer, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { productId: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { brandName: { $regex: search, $options: "i" } },
        { serialNumber: { $regex: search, $options: "i" } },
        { batchNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "ALL") {
      query.category = category;
    }

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (manufacturer) {
      query.manufacturer = manufacturer;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .populate("manufacturer", "name email companyName walletAddress")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// @desc    Get product details by ID or Mongo ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const param = req.params.id.trim().toUpperCase();

    let product = await Product.findOne({ productId: param }).populate(
      "manufacturer",
      "name email companyName phone walletAddress"
    );

    if (!product && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id).populate(
        "manufacturer",
        "name email companyName phone walletAddress"
      );
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product Details Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error retrieving product details" });
  }
};

// @desc    Update product information
// @route   PUT /api/products/:id
// @access  Private (Manufacturer / Admin)
const updateProduct = async (req, res) => {
  try {
    const { status, description, ownerWallet, transactionHash } = req.body;

    let product = await Product.findOne({ productId: req.params.id.trim().toUpperCase() });
    if (!product && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (status) product.status = status;
    if (description !== undefined) product.description = description;
    if (ownerWallet) product.ownerWallet = ownerWallet;
    if (transactionHash) product.transactionHash = transactionHash;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// @desc    Transfer product ownership
// @route   POST /api/products/:id/transfer
// @access  Private
const transferOwnership = async (req, res) => {
  try {
    const { newOwnerWallet, transactionHash } = req.body;

    if (!newOwnerWallet) {
      return res.status(400).json({ success: false, message: "New owner wallet address is required" });
    }

    const product = await Product.findOne({ productId: req.params.id.trim().toUpperCase() });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.ownerWallet = newOwnerWallet;
    if (transactionHash) product.transactionHash = transactionHash;

    await product.save();

    return res.status(200).json({
      success: true,
      message: `Product ownership transferred to wallet: ${newOwnerWallet}`,
      product,
    });
  } catch (error) {
    console.error("Transfer Ownership Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to transfer product ownership" });
  }
};

// @desc    Deactivate / Recall product
// @route   POST /api/products/:id/deactivate
// @access  Private (Manufacturer / Admin)
const deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.id.trim().toUpperCase() });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.status = "RECALLED";
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deactivated/recalled successfully",
      product,
    });
  } catch (error) {
    console.error("Deactivate Product Error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to deactivate product" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  transferOwnership,
  deactivateProduct,
};
