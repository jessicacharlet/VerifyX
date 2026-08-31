const mongoose = require("mongoose");
const crypto = require("crypto");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../server/models/User");
const Asset = require("../server/models/Asset");
const VerificationHistory = require("../server/models/VerificationHistory");
const BlockchainRecord = require("../server/models/BlockchainRecord");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";

async function seedDigitalAssets() {
  console.log("=== SEEDING VERIFYX DIGITAL ASSET DEMO DATA ===");
  await mongoose.connect(MONGO_URI);

  // Clear existing collections
  await User.deleteMany({});
  await Asset.deleteMany({});
  await VerificationHistory.deleteMany({});
  await BlockchainRecord.deleteMany({});

  // 1. Create Demo User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  const demoUser = await User.create({
    name: "Jessica Charlet",
    email: "jessica@example.com",
    passwordHash,
    role: "USER",
  });

  console.log("✓ Seeded User: Jessica Charlet (jessica@example.com / password123)");

  // 2. Demo Digital Assets Data
  const sampleAssetsData = [
    {
      assetId: "AST-104921",
      assetName: "Q3 Financial Audit Certificate.pdf",
      fileName: "Q3_Financial_Audit_Certificate.pdf",
      fileType: "application/pdf",
      fileSize: 245760, // 240 KB
      content: "Official Q3 Financial Audit Certificate for Enterprise Compliance 2026",
    },
    {
      assetName: "Blockchain Research Paper.pdf",
      assetId: "AST-209843",
      fileName: "Blockchain_Research_Paper.pdf",
      fileType: "application/pdf",
      fileSize: 1048576, // 1 MB
      content: "Decentralized Cryptographic Fingerprinting for Digital Asset Authentication",
    },
    {
      assetName: "Project Final Specification Report.docx",
      assetId: "AST-305812",
      fileName: "Project_Final_Specification_Report.docx",
      fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      fileSize: 524288, // 512 KB
      content: "VerifyX Architecture and Verification Protocol Specifications",
    },
    {
      assetName: "Technical System Blueprint Diagram.png",
      assetId: "AST-401928",
      fileName: "Technical_System_Blueprint_Diagram.png",
      fileType: "image/png",
      fileSize: 3145728, // 3 MB
      content: "System Architecture Vector Blueprint SHA-256 Cryptographic Hash Representation",
    },
  ];

  const createdAssets = [];

  for (const item of sampleAssetsData) {
    const sha256Hash = crypto.createHash("sha256").update(Buffer.from(item.content)).digest("hex").toLowerCase();
    const txHash = "0x" + crypto.randomBytes(32).toString("hex");
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const asset = await Asset.create({
      assetId: item.assetId,
      ownerId: demoUser._id,
      assetName: item.assetName,
      fileName: item.fileName,
      fileType: item.fileType,
      fileSize: item.fileSize,
      sha256Hash,
      storagePath: `uploads/demo-${item.fileName}`,
      blockchainStatus: "CONFIRMED",
      transactionHash: txHash,
      blockNumber: Math.floor(14000000 + Math.random() * 500000),
      contractAddress,
      network: "Ethereum Sepolia Testnet",
    });

    createdAssets.push(asset);

    // Create Blockchain Record
    await BlockchainRecord.create({
      recordId: "BCR-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase(),
      assetId: item.assetId,
      sha256Hash,
      transactionHash: txHash,
      blockNumber: asset.blockNumber,
      network: "Ethereum Sepolia Testnet",
      contractAddress,
      status: "CONFIRMED",
      timestamp: asset.createdAt,
    });
  }

  console.log(`✓ Seeded ${createdAssets.length} Digital Assets & Blockchain Audit Records.`);

  // 3. Seed Verification History Logs
  const targetAsset = createdAssets[0];

  // Authentic Verification Attempt
  await VerificationHistory.create({
    verificationId: "VRF-889012",
    assetId: targetAsset.assetId,
    userId: demoUser._id,
    fileName: targetAsset.fileName,
    submittedHash: targetAsset.sha256Hash,
    storedHash: targetAsset.sha256Hash,
    result: "AUTHENTIC",
    blockchainStatus: "VERIFIED",
    timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  });

  // Modified / Tampered Verification Attempt
  const tamperedHash = crypto.createHash("sha256").update(Buffer.from(targetAsset.content + " TAMPERED")).digest("hex").toLowerCase();
  await VerificationHistory.create({
    verificationId: "VRF-994123",
    assetId: targetAsset.assetId,
    userId: demoUser._id,
    fileName: "Q3_Financial_Audit_Certificate_modified.pdf",
    submittedHash: tamperedHash,
    storedHash: targetAsset.sha256Hash,
    result: "MODIFIED",
    blockchainStatus: "UNVERIFIED",
    timestamp: new Date(Date.now() - 3600000 * 1), // 1 hour ago
  });

  // Unregistered Verification Attempt
  const unregisteredHash = crypto.createHash("sha256").update(Buffer.from("Unregistered document file content")).digest("hex").toLowerCase();
  await VerificationHistory.create({
    verificationId: "VRF-102934",
    assetId: "UNREGISTERED",
    userId: demoUser._id,
    fileName: "Unregistered_Contract_Draft.pdf",
    submittedHash: unregisteredHash,
    storedHash: "",
    result: "NOT_REGISTERED",
    blockchainStatus: "NOT_CONFIGURED",
    timestamp: new Date(),
  });

  console.log("✓ Seeded 3 Verification History Logs (AUTHENTIC, MODIFIED, NOT_REGISTERED).");
  console.log("\n=== SEED COMPLETE CLEAN ===");
  await mongoose.disconnect();
}

seedDigitalAssets().catch(console.error);
