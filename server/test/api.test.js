const assert = require("assert");
const { generateProductHash } = require("../utils/hashGenerator");

console.log("Running VeriMark Backend Unit Tests...");

// Test 1: Deterministic SHA-256 Hashing
const hash1 = generateProductHash({
  productId: "PROD-TEST-100",
  serialNumber: "SN-99001",
  batchNumber: "BATCH-2026-X",
  brandName: "Apple",
  category: "Electronics",
});

const hash2 = generateProductHash({
  productId: "PROD-TEST-100",
  serialNumber: "SN-99001",
  batchNumber: "BATCH-2026-X",
  brandName: "Apple",
  category: "Electronics",
});

const hash3 = generateProductHash({
  productId: "PROD-TEST-100",
  serialNumber: "SN-99001-TAMPERED",
  batchNumber: "BATCH-2026-X",
  brandName: "Apple",
  category: "Electronics",
});

assert.strictEqual(hash1.length, 64, "SHA-256 hash output should be 64 hexadecimal characters");
assert.strictEqual(hash1, hash2, "Identical product inputs must yield identical SHA-256 hashes");
assert.notStrictEqual(hash1, hash3, "Tampered serial number must produce a different SHA-256 hash");

console.log("✅ SHA-256 Cryptographic Hash Unit Tests PASSED!");
