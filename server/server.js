const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Disable Mongoose query buffering
mongoose.set("bufferCommands", false);

// Static uploads folder
const uploadsPath = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadsPath));

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
    service: "VeriMark Product Authenticity API",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, bufferCommands: false })
  .then(() => {
    console.log("✅ MongoDB connected successfully to database: verimark");
    app.listen(PORT, () => {
      console.log(`🚀 VeriMark REST API server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("Starting server without active MongoDB connection (fallback mode)...");
    app.listen(PORT, () => {
      console.log(`⚠️ VeriMark server running in offline fallback mode on http://localhost:${PORT}`);
    });
  });

module.exports = app;
