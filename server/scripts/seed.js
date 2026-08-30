const mongoose = require("mongoose");
const path = require("path");
const QRCode = require("qrcode");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const ScanEvent = require("../models/ScanEvent");
const ProductIssue = require("../models/ProductIssue");
const Shipment = require("../models/Shipment");
const Verification = require("../models/Verification");
const { generateProductHash } = require("../utils/hashGenerator");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB for seeding enterprise supply chain...");
    await mongoose.connect(MONGO_URI);

    console.log("Cleaning existing database records...");
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await ScanEvent.deleteMany({});
    await ProductIssue.deleteMany({});
    await Shipment.deleteMany({});
    await Verification.deleteMany({});

    console.log("Seeding Role-Based User Accounts...");
    const adminUser = await User.create({
      name: "System Admin",
      email: "admin@verimark.io",
      password: "password123",
      role: "admin",
      companyName: "VerifyX Enterprise Operations",
      phone: "+1 800 555 0199",
      walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    });

    const warehouseUser = await User.create({
      name: "Arun Kumar (Warehouse Ops)",
      email: "warehouse@verimark.io",
      password: "password123",
      role: "warehouse",
      companyName: "Chennai Logistics Hub",
      phone: "+91 98400 11223",
      location: "Chennai Central Warehouse",
    });

    const qcUser = await User.create({
      name: "Priya Sharma (QC Inspector)",
      email: "qc@verimark.io",
      password: "password123",
      role: "quality_control",
      companyName: "VerifyX Quality Assurance Labs",
      phone: "+91 98400 44556",
      location: "Quality Check Station A",
    });

    const logisticsUser = await User.create({
      name: "Karthik Raja (Logistics Manager)",
      email: "logistics@verimark.io",
      password: "password123",
      role: "logistics",
      companyName: "VerifyX Express Logistics",
      phone: "+91 98400 77889",
      location: "Bangalore Transit Hub",
    });

    const deliveryUser = await User.create({
      name: "Ramesh Delivery Agent",
      email: "delivery@verimark.io",
      password: "password123",
      role: "delivery",
      companyName: "VerifyX Last-Mile Fleet",
      phone: "+91 98400 99000",
      location: "Mumbai Delivery Zone",
    });

    const customerUser = await User.create({
      name: "Rahul Kumar",
      email: "customer@gmail.com",
      password: "password123",
      role: "customer",
      phone: "+91 98765 43210",
      walletAddress: "0x90F79bf6EB2c4f80806530203660702885674044",
    });

    const clientUrl = process.env.CLIENT_URL || "https://verify-x-tawny.vercel.app";

    console.log("Seeding Customer Orders & Products...");

    // Order 1: Samsung Galaxy S21 FE (Complete 8-Stage Journey)
    const order1 = await Order.create({
      orderId: "ORD-2026-10452",
      customerName: "Rahul Kumar",
      customerContact: "+91 98765 43210",
      customerAddress: "42 Connaught Place, New Delhi, 110001",
      productName: "Samsung Galaxy S21 FE 5G",
      model: "Galaxy S21 FE",
      quantity: 1,
      expectedDeliveryDate: new Date("2026-08-31"),
      paymentStatus: "PAID",
      status: "DELIVERED",
      remarks: "Priority Customer Shipment",
    });

    const s21Hash = generateProductHash({
      productId: "VX-S21FE-000123",
      serialNumber: "SN-S21FE-928374",
      batchNumber: "BATCH-2026-S21",
      brandName: "Samsung",
      category: "Smartphones",
    });

    const s21QrUrl = `${clientUrl}/verify/VX-S21FE-000123`;
    const s21QrCode = await QRCode.toDataURL(s21QrUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });

    const product1 = await Product.create({
      productId: "VX-S21FE-000123",
      orderId: order1.orderId,
      productName: "Samsung Galaxy S21 FE 5G",
      modelName: "Galaxy S21 FE",
      brandName: "Samsung",
      category: "Smartphones",
      manufacturer: adminUser._id,
      description: "Flagship 5G Smartphone with 120Hz AMOLED display and pro-grade triple camera",
      batchNumber: "BATCH-2026-S21",
      serialNumber: "SN-S21FE-928374",
      imei: "359821098234123",
      manufacturingDate: new Date("2026-08-01"),
      warehouse: "Chennai Central Warehouse",
      currentLocation: "Customer Destination - New Delhi",
      currentStage: "DELIVERED",
      condition: "GOOD",
      productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      productHash: s21Hash,
      transactionHash: "0x91823719283b0192e81928370129381928301928370192830192837102938102",
      qrCode: s21QrCode,
      status: "AUTHENTIC",
    });

    order1.assignedProducts.push(product1._id);
    await order1.save();

    // Scan Events for Order 1 (Chronological 8-stage complete timeline)
    const baseTime = new Date("2026-08-30T10:10:00Z").getTime();

    await ScanEvent.create({
      scanId: "SCAN-S21-1",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "ORDER_RECEIVED",
      employeeName: "System Auto Dispatch",
      location: "VerifyX Order Processing System",
      condition: "GOOD",
      remarks: "Order ORD-2026-10452 received from customer Rahul Kumar",
      timestamp: new Date(baseTime),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-2",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "PRODUCT_ASSIGNED",
      employeeName: warehouseUser.name,
      location: "Chennai Central Warehouse",
      condition: "GOOD",
      remarks: "Physical product VX-S21FE-000123 assigned to order",
      timestamp: new Date(baseTime + 5 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-3",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "QR_GENERATED",
      employeeName: warehouseUser.name,
      location: "Chennai Packaging Station 4",
      condition: "GOOD",
      remarks: "Unique Product QR label printed and affixed to physical box",
      timestamp: new Date(baseTime + 6 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-4",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "PACKED",
      employeeName: warehouseUser.name,
      location: "Chennai Dispatch Bay",
      condition: "GOOD",
      sealCondition: "INTACT",
      accessoriesCondition: "COMPLETE",
      remarks: "Product box packed securely with tamper-proof security tape",
      timestamp: new Date(baseTime + 55 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-5",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "QUALITY_CHECK",
      employeeName: qcUser.name,
      location: "Quality Control Lab B",
      condition: "GOOD",
      sealCondition: "INTACT",
      accessoriesCondition: "COMPLETE",
      remarks: "Passed 12-point quality & security barcode inspection",
      timestamp: new Date(baseTime + 70 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-6",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "DISPATCHED",
      employeeName: logisticsUser.name,
      location: "Chennai Express Logistics Gateway",
      condition: "GOOD",
      remarks: "Handed over to courier with tracking number TRK-VX-889021",
      timestamp: new Date(baseTime + 4 * 60 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-7",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "IN_TRANSIT",
      employeeName: logisticsUser.name,
      location: "Bangalore Logistics Transit Hub",
      condition: "GOOD",
      remarks: "Scanned at regional sort facility in transit to destination",
      timestamp: new Date(baseTime + 8 * 60 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-S21-8",
      productId: product1.productId,
      orderId: order1.orderId,
      stage: "DELIVERED",
      employeeName: deliveryUser.name,
      location: "Customer Destination - New Delhi",
      condition: "GOOD",
      sealCondition: "INTACT",
      remarks: "Delivered to Rahul Kumar. Signature and OTP confirmed.",
      timestamp: new Date(baseTime + 24 * 60 * 60 * 1000),
    });

    // Create Shipment for Order 1
    await Shipment.create({
      trackingNumber: "TRK-VX-889021",
      orderId: order1.orderId,
      productId: product1.productId,
      courier: "VerifyX Express Logistics",
      origin: "Chennai Central Warehouse",
      destination: "New Delhi Destination",
      dispatchTime: new Date(baseTime + 4 * 60 * 60 * 1000),
      estimatedDelivery: new Date(baseTime + 24 * 60 * 60 * 1000),
      actualDelivery: new Date(baseTime + 24 * 60 * 60 * 1000),
      status: "DELIVERED",
      currentLocation: "Customer Destination - New Delhi",
    });

    // Product 2: AirPods Pro (2nd Gen) - Authentic Active Demo
    const apHash = generateProductHash({
      productId: "PROD-AP-9901",
      serialNumber: "SN-AP-98213890",
      batchNumber: "BATCH-2026-A1",
      brandName: "Apple",
      category: "Electronics",
    });

    const apQrCode = await QRCode.toDataURL(`${clientUrl}/verify/PROD-AP-9901`, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });

    const product2 = await Product.create({
      productId: "PROD-AP-9901",
      orderId: "ORD-2026-9901",
      productName: "AirPods Pro (2nd Gen)",
      modelName: "AirPods Pro",
      brandName: "Apple",
      category: "Electronics",
      manufacturer: adminUser._id,
      description: "Active Noise Cancelling Wireless Earbuds with H2 Chip and MagSafe Case",
      batchNumber: "BATCH-2026-A1",
      serialNumber: "SN-AP-98213890",
      manufacturingDate: new Date("2026-02-15"),
      warehouse: "Cupertino Distribution Hub",
      currentLocation: "In Transit - Frankfurt Hub",
      currentStage: "IN_TRANSIT",
      condition: "GOOD",
      productImage: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80",
      productHash: apHash,
      transactionHash: "0x8a92329381c8172901c8282710102b378129e0192837192830192830129e8129",
      qrCode: apQrCode,
      status: "AUTHENTIC",
    });

    await ScanEvent.create({
      scanId: "SCAN-AP-1",
      productId: product2.productId,
      orderId: "ORD-2026-9901",
      stage: "PACKED",
      employeeName: warehouseUser.name,
      location: "Cupertino Hub",
      remarks: "Item packed in verified shock-proof casing",
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
    });

    await ScanEvent.create({
      scanId: "SCAN-AP-2",
      productId: product2.productId,
      orderId: "ORD-2026-9901",
      stage: "IN_TRANSIT",
      employeeName: logisticsUser.name,
      location: "Frankfurt Transit Hub",
      remarks: "Scanned at international transit checkpoint",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    });

    // Product 3: Galaxy S25 Ultra - Authentic Active Demo
    const sgHash = generateProductHash({
      productId: "PROD-SG-8820",
      serialNumber: "SN-SG-77291034",
      batchNumber: "BATCH-2026-S5",
      brandName: "Samsung",
      category: "Smartphones",
    });

    const sgQrCode = await QRCode.toDataURL(`${clientUrl}/verify/PROD-SG-8820`, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0F172A", light: "#FFFFFF" },
    });

    const product3 = await Product.create({
      productId: "PROD-SG-8820",
      orderId: "ORD-2026-8820",
      productName: "Galaxy S25 Ultra 512GB",
      modelName: "Galaxy S25 Ultra",
      brandName: "Samsung",
      category: "Smartphones",
      manufacturer: adminUser._id,
      description: "Flagship AI Smartphone with Titanium Armor Frame and Built-in S-Pen",
      batchNumber: "BATCH-2026-S5",
      serialNumber: "SN-SG-77291034",
      manufacturingDate: new Date("2026-03-01"),
      warehouse: "Seoul Logistics Hub",
      currentLocation: "Quality Check Bay 2",
      currentStage: "QUALITY_CHECK",
      condition: "GOOD",
      productImage: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80",
      productHash: sgHash,
      transactionHash: "0x91823719283b0192e81928370129381928301928370192830192837102938102",
      qrCode: sgQrCode,
      status: "AUTHENTIC",
    });

    await ScanEvent.create({
      scanId: "SCAN-SG-1",
      productId: product3.productId,
      orderId: "ORD-2026-8820",
      stage: "QUALITY_CHECK",
      employeeName: qcUser.name,
      location: "Seoul Quality Check Bay 2",
      remarks: "Quality check in progress",
      timestamp: new Date(),
    });

    // Product 4: Sample with Reported Damage Issue
    const issueProduct = await Product.create({
      productId: "VX-DMG-9904",
      orderId: "ORD-2026-7710",
      productName: "Sony WH-1000XM6 Headphones",
      modelName: "WH-1000XM6",
      brandName: "Sony",
      category: "Audio",
      manufacturer: adminUser._id,
      batchNumber: "BATCH-2026-XM6",
      serialNumber: "SN-SN-99881122",
      manufacturingDate: new Date("2026-01-20"),
      warehouse: "Chennai Central Warehouse",
      currentLocation: "Inspection Station B",
      currentStage: "QUALITY_CHECK",
      condition: "DAMAGED",
      damageDetected: true,
      productHash: "2837192830192837019283019283710293810293810293810293810293810293",
      qrCode: await QRCode.toDataURL(`${clientUrl}/verify/VX-DMG-9904`),
      status: "AUTHENTIC",
    });

    await ProductIssue.create({
      issueId: "ISSUE-2026-001",
      productId: issueProduct.productId,
      orderId: "ORD-2026-7710",
      issueType: "DAMAGE",
      stage: "QUALITY_CHECK",
      location: "Chennai Inspection Station B",
      reportedBy: qcUser._id,
      reportedByName: qcUser.name,
      description: "Outer retail box corner crushed during pallet transport. Product seal intact.",
      status: "OPEN",
    });

    // Verification records for analytics
    await Verification.create({
      verificationId: "VERIF-INIT-1",
      productId: product1.productId,
      scannedCode: product1.productId,
      verificationStatus: "SUCCESS",
      verifiedBy: customerUser._id,
      location: "New Delhi, India",
      blockchainTransactionHash: product1.transactionHash,
    });

    console.log("✅ Enterprise Seed Completed Successfully!");
    console.log("-----------------------------------------");
    console.log("Admin Login: admin@verimark.io / password123");
    console.log("Warehouse Login: warehouse@verimark.io / password123");
    console.log("QC Login: qc@verimark.io / password123");
    console.log("Logistics Login: logistics@verimark.io / password123");
    console.log("Delivery Login: delivery@verimark.io / password123");
    console.log("Customer Login: customer@gmail.com / password123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error);
    process.exit(1);
  }
}

seedDatabase();
