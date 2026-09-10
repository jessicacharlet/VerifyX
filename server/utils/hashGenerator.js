const crypto = require("crypto");
const fs = require("fs");

/**
 * Generates a deterministic SHA-256 cryptographic hash for a product.
 */
function generateProductHash({ productId, serialNumber, batchNumber, brandName, category }) {
  const normalizedString = [
    String(productId || "").trim().toUpperCase(),
    String(serialNumber || "").trim().toUpperCase(),
    String(batchNumber || "").trim().toUpperCase(),
    String(brandName || "").trim().toLowerCase(),
    String(category || "").trim().toLowerCase(),
  ].join("|");

  return crypto.createHash("sha256").update(normalizedString).digest("hex");
}

/**
 * Calculates SHA-256 hash using a stream for high performance & minimal RAM usage on large files.
 * @param {string} filePath
 * @returns {Promise<string>} Hex encoded SHA-256 hash
 */
function generateFileHashStream(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex").toLowerCase()));
    stream.on("error", (err) => reject(err));
  });
}

/**
 * Calculates SHA-256 hash from a Buffer.
 * @param {Buffer} buffer
 * @returns {string} Hex encoded SHA-256 hash
 */
function generateBufferHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").toLowerCase();
}

module.exports = {
  generateProductHash,
  generateFileHashStream,
  generateBufferHash,
};

