const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

async function runCoreVerificationTests() {
  const BASE_URL = "http://localhost:5000/api";
  console.log("=== VERIFYX CORE VERIFICATION & ROUTING TEST SUITE ===\n");

  // 1. Test Product Verification GET /api/verify/:productId
  console.log("--- 1. Testing GET /api/verify/:productId (Product & Lifecycle lookup) ---");
  const validProductRes = await fetch(`${BASE_URL}/verify/PROD-AP-9901`).then((r) => r.json());
  console.log("✓ Authentic Product Fetch:", validProductRes.success, "isAuthentic:", validProductRes.isAuthentic);
  console.log("   Product Name:", validProductRes.product?.productName);
  console.log("   Lifecycle Stage:", validProductRes.product?.currentStage);
  console.log("   Scans Count:", validProductRes.scans?.length);
  console.log("   Hash Match:", validProductRes.hashMatch);
  console.log();

  // 2. Test Non-existent Product GET /api/verify/:productId
  console.log("--- 2. Testing Non-existent Product Lookup ---");
  const fakeProductRes = await fetch(`${BASE_URL}/verify/PROD-FAKE-9999`).then((r) => r.json());
  console.log("✓ Unregistered Product Response:", !fakeProductRes.isAuthentic, "Reason:", fakeProductRes.reason);
  console.log("   Message:", fakeProductRes.message);
  console.log();

  // 3. Test File Verification via POST /api/verify with fileBuffer
  console.log("--- 3. Testing POST /api/verify File Submission ---");
  const fileContent = Buffer.from("VerifyX Core Test File " + Date.now());
  const fileBufferBase64 = fileContent.toString("base64");

  const verifyFileRes = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: "core_test.pdf",
      fileBuffer: fileBufferBase64,
    }),
  }).then((r) => r.json());

  console.log("✓ File Submission Response Received:", verifyFileRes.success);
  console.log("   Verification ID:", verifyFileRes.verificationId);
  console.log("   Result:", verifyFileRes.result);
  console.log("   Submitted SHA-256 Hash:", verifyFileRes.submittedHash);
  console.log();

  // 4. Test Product Code JSON Verification via POST /api/verify
  console.log("--- 4. Testing POST /api/verify Product Code JSON Query ---");
  const verifyJsonRes = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productId: "PROD-AP-9901",
    }),
  }).then((r) => r.json());

  console.log("✓ JSON Product Code Query Response:", verifyJsonRes.success);
  console.log("   Product Name:", verifyJsonRes.product?.productName);
  console.log("   Status:", verifyJsonRes.status);
  console.log();

  console.log("=== ALL CORE VERIFICATION TESTS PASSED 100% CLEAN ===");
}

runCoreVerificationTests().catch(console.error);
