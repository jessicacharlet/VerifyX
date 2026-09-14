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
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const scanRoutes = require("./routes/scanRoutes");
const issueRoutes = require("./routes/issueRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

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

// Root Landing Endpoint
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.setHeader("Content-Type", "text/html");
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>VerifyX API Service</title>
        <style>
          body { background-color: #070B14; color: #E2E8F0; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background-color: #0D1422; border: 1px solid #22304A; border-radius: 16px; padding: 40px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .badge { display: inline-flex; align-items: center; gap: 6px; background-color: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34D399; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-bottom: 16px; }
          .dot { width: 8px; height: 8px; background-color: #10B981; border-radius: 50%; display: inline-block; }
          h1 { color: #FFFFFF; margin: 0 0 8px 0; font-size: 24px; font-weight: 700; }
          p { color: #94A3B8; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5; }
          .btn-group { display: flex; flex-direction: column; gap: 12px; }
          .btn-primary { background: linear-gradient(135deg, #38BDF8, #3B82F6); color: #070B14; font-weight: 700; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; transition: opacity 0.2s; }
          .btn-secondary { background: #111A2A; color: #38BDF8; border: 1px solid #22304A; font-weight: 600; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> VerifyX Backend API Online</div>
          <h1>VerifyX REST API Server</h1>
          <p>This port (5000) hosts the backend API server. To view the user web application, open the frontend dev server at <strong>localhost:5173</strong>.</p>
          <div class="btn-group">
            <a href="http://localhost:5173" class="btn-primary">Launch VerifyX Frontend (Port 5173)</a>
            <a href="/api/health" class="btn-secondary">Check Backend Health (/api/health)</a>
          </div>
        </div>
      </body>
      </html>
    `);
  }
  res.status(200).json({
    status: "OK",
    service: "VerifyX Digital Asset Authentication REST API",
    frontendUrl: "http://localhost:5173",
    healthEndpoint: "/api/health",
  });
});

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
  console.error("Unhandled Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";

mongoose
  .connect(MONGO_URI, {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
  })
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

