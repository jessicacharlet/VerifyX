const mongoose = require("mongoose");

let isConnecting = false;

async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (isConnecting) {
    let attempts = 0;
    while (mongoose.connection.readyState !== 1 && attempts < 20) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      attempts++;
    }
    return mongoose.connection.readyState === 1;
  }

  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/verimark";
  try {
    isConnecting = true;
    console.log("Connecting to MongoDB Atlas in controller...");
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });
    isConnecting = false;
    return mongoose.connection.readyState === 1;
  } catch (err) {
    isConnecting = false;
    console.error("❌ ensureDbConnected Error:", err.message);
    return false;
  }
}

module.exports = { ensureDbConnected };
