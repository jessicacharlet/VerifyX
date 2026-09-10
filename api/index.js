const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("../server/routes/authRoutes");
const assetRoutes = require("../server/routes/assetRoutes");
const verifyRoutes = require("../server/routes/verifyRoutes");
const dashboardRoutes = require("../server/routes/dashboardRoutes");
const blockchainRoutes = require("../server/routes/blockchainRoutes");
const productRoutes = require("../server/routes/productRoutes");
const adminRoutes = require("../server/routes/adminRoutes");
const orderRoutes = require("../server/routes/orderRoutes");
const scanRoutes = require("../server/routes/scanRoutes");
const issueRoutes = require("../server/routes/issueRoutes");
const shipmentRoutes = require("../server/routes/shipmentRoutes");

const app = express();

// Enable CORS for Vercel Serverless Functions
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Disable Mongoose query buffering on serverless environments
mongoose.set("bufferCommands", false);

// Static uploads folder
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Serverless MongoDB Connection Caching
let cachedDb = null;
let lastDbError = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";
  
  try {
    const db = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    cachedDb = db;
    lastDbError = null;
    return cachedDb;
  } catch (err) {
    lastDbError = err.message;
    console.error("⚠️ Serverless MongoDB connection error:", err.message);
    return null;
  }
}

// Middleware to ensure DB connection attempt per serverless invocation
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    lastDbError = err.message;
  }
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/shipments", shipmentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "VerifyX Digital Asset Authentication API (Vercel Serverless)",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "production",
    dbConnected: mongoose.connection.readyState === 1,
    dbError: lastDbError,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Serverless Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

