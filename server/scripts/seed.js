const mongoose = require("mongoose");
const path = require("path");
const QRCode = require("qrcode");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const Product = require("../models/Product");
const Verification = require("../models/Verification");
const { generateProductHash } = require("../utils/hashGenerator");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for seeding...");
    await mongoose.connect(MONGO_URI);

    console.log("Cleaning existing database records...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Verification.deleteMany({});

    console.log("Seeding User Accounts...");
    const adminUser = await User.create({
      name: "System Admin",
      email: "admin@verimark.io",
      password: "password123",
      role: "admin",
      companyName: "VeriMark Governance Core",
      phone: "+1 800 555 0199",
      walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    });

    const manufacturer1 = await User.create({
      name: "Apple Inc.",
      email: "manufacturer@apple.com",
      password: "password123",
      role: "manufacturer",
      companyName: "Apple Corporate HQ",
      phone: "+1 408 996 1010",
      walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    });

    const manufacturer2 = await User.create({
      name: "Samsung Electronics",
      email: "manufacturer@samsung.com",
      password: "password123",
      role: "manufacturer",
      companyName: "Samsung Global Product Operations",
      phone: "+82 2 2255 0114",
      walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    });

    const customerUser = await User.create({
      name: "Jane Customer",
      email: "customer@gmail.com",
      password: "password123",
      role: "customer",
      walletAddress: "0x90F79bf6EB2c4f80806530203660702885674044",
    });

    console.log("Seeding Products with SHA-256 Hashes and QR Codes...");

    const productsData = [
      {
        productId: "PROD-AP-9901",
        productName: "AirPods Pro (2nd Gen)",
        brandName: "Apple",
        category: "Electronics",
        manufacturer: manufacturer1._id,
        description: "Active Noise Cancelling Wireless Earbuds with H2 Chip and MagSafe Case",
        batchNumber: "BATCH-2026-A1",
        serialNumber: "SN-AP-98213890",
        manufacturingDate: new Date("2026-02-15"),
        expiryDate: null,
        productImage: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
        ownerWallet: manufacturer1.walletAddress,
        transactionHash: "0x8a92329381c8172901c8282710102b378129e0192837192830192830129e8129",
      },
      {
        productId: "PROD-SG-8820",
        productName: "Galaxy S25 Ultra 512GB",
        brandName: "Samsung",
        category: "Smartphones",
        manufacturer: manufacturer2._id,
        description: "Flagship AI Smartphone with Titanium Armor Frame and Built-in S-Pen",
        batchNumber: "BATCH-2026-S5",
        serialNumber: "SN-SG-77291034",
        manufacturingDate: new Date("2026-03-01"),
        expiryDate: null,
        productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
        ownerWallet: manufacturer2.walletAddress,
        transactionHash: "0x91823719283b0192e81928370129381928301928370192830192837102938102",
      },
      {
        productId: "PROD-SN-7730",
        productName: "Sony WH-1000XM6 Headphones",
        brandName: "Sony",
        category: "Audio",
        manufacturer: manufacturer1._id,
        description: "Industry-leading noise cancelling wireless headphones with LDAC audio",
        batchNumber: "BATCH-2026-XM6",
        serialNumber: "SN-SN-11293847",
        manufacturingDate: new Date("2026-01-20"),
        expiryDate: null,
        productImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
        ownerWallet: manufacturer1.walletAddress,
        transactionHash: "0x2837192830192837019283019283710293810293810293810293810293810293",
      },
      {
        productId: "PROD-RL-5510",
        productName: "Rolex Submariner Date 41mm",
        brandName: "Rolex",
        category: "Luxury Watches",
        manufacturer: manufacturer1._id,
        description: "Oystersteel and Cerachrom bezel luxury diving chronometer",
        batchNumber: "BATCH-2026-RLX",
        serialNumber: "SN-RL-90812736",
        manufacturingDate: new Date("2025-11-10"),
        expiryDate: null,
        productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        ownerWallet: manufacturer1.walletAddress,
        transactionHash: "0x5510293810293810293810293810293810293810293810293810293810293810",
      },
      {
        productId: "PROD-NK-3320",
        productName: "Nike Air Jordan 1 High OG",
        brandName: "Nike",
        category: "Apparel",
        manufacturer: manufacturer2._id,
        description: "Limited edition Chicago colorway premium leather sneakers",
        batchNumber: "BATCH-2026-AJ1",
        serialNumber: "SN-NK-44582910",
        manufacturingDate: new Date("2026-04-10"),
        expiryDate: null,
        productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        ownerWallet: manufacturer2.walletAddress,
        transactionHash: "0x3320192830192837019283019283710293810293810293810293810293810293",
      },
    ];

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    for (const data of productsData) {
      const productHash = generateProductHash({
        productId: data.productId,
        serialNumber: data.serialNumber,
        batchNumber: data.batchNumber,
        brandName: data.brandName,
        category: data.category,
      });

      const qrUrl = `${clientUrl}/verify/${data.productId}`;
      const qrCode = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: "H",
        margin: 2,
        color: { dark: "#0F172A", light: "#FFFFFF" },
      });

      const product = await Product.create({
        ...data,
        productHash,
        qrCode,
        status: "AUTHENTIC",
      });

      // Create initial verification log
      await Verification.create({
        verificationId: "VERIF-INIT-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        productId: product.productId,
        scannedCode: product.productId,
        verificationStatus: "SUCCESS",
        verifiedBy: customerUser._id,
        location: "New York, USA",
        blockchainTransactionHash: product.transactionHash,
      });
    }

    console.log("✅ Seed completed successfully!");
    console.log("-----------------------------------------");
    console.log("Admin Login: admin@verimark.io / password123");
    console.log("Manufacturer 1 Login: manufacturer@apple.com / password123");
    console.log("Manufacturer 2 Login: manufacturer@samsung.com / password123");
    console.log("Customer Login: customer@gmail.com / password123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
}

seedDatabase();
