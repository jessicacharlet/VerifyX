const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const authRoutes = require("./routes/authRoutes");
const assetRoutes = require("./routes/assetRoutes");
const verifyRoutes = require("./routes/verifyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");

const app = express();

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Disable Mongoose query buffering
mongoose.set("bufferCommands", false);

// Static uploads folder
const uploadsPath = path.join(__dirname, "./uploads");
app.use("/uploads", express.static(uploadsPath));

// Digital Asset API Routes
app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/verify", verifyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/blockchain", blockchainRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "VerifyX Digital Asset Authentication API",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
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
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`🚀 VerifyX Digital Asset API listening on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`⚠️ VerifyX server running in offline fallback mode on http://localhost:${PORT}`);
      });
    }
  });

module.exports = app;
