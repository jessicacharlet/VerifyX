const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("../server/routes/authRoutes");
const productRoutes = require("../server/routes/productRoutes");
const verifyRoutes = require("../server/routes/verifyRoutes");
const adminRoutes = require("../server/routes/adminRoutes");
const blockchainRoutes = require("../server/routes/blockchainRoutes");

const app = express();

// Enable CORS for Vercel Serverless Functions
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Disable Mongoose query buffering on serverless environments
mongoose.set("bufferCommands", false);

// Static uploads folder
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

// Serverless MongoDB Connection Caching
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";
  
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    cachedDb = db;
    console.log("✅ Serverless MongoDB connected successfully");
    return cachedDb;
  } catch (err) {
    console.error("⚠️ Serverless MongoDB connection error:", err.message);
    return null;
  }
}

// Middleware to ensure DB connection attempt per serverless invocation
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Serverless middleware DB connect error:", err.message);
  }
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "VeriMark Product Authenticity API (Vercel Serverless)",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "production",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Serverless Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
