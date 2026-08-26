const crypto = require("crypto");

/**
 * Generates a deterministic SHA-256 cryptographic hash for a product.
 * @param {Object} productData
 * @param {string} productData.productId
 * @param {string} productData.serialNumber
 * @param {string} productData.batchNumber
 * @param {string} productData.brandName
 * @param {string} productData.category
 * @returns {string} Hex encoded SHA-256 hash string
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

module.exports = { generateProductHash };
