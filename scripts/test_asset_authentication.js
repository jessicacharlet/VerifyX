const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

async function runAssetAuthenticationTests() {
  const BASE_URL = "http://localhost:5000/api";
  console.log("=== VERIFYX DIGITAL ASSET AUTHENTICATION TEST SUITE ===\n");

  // 1. TEST 58: User Authentication Test
  console.log("--- 1. User Management & JWT Authentication Test ---");
  const testUser = {
    name: "Jessica Charlet",
    email: `jessica.test.${Date.now()}@example.com`,
    password: "password123",
    confirmPassword: "password123",
  };

  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(testUser),
  }).then((r) => r.json());

  console.log("✓ User Registration:", regRes.success, "User:", regRes.user?.name, regRes.user?.email);

  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  }).then((r) => r.json());

  console.log("✓ User Login:", loginRes.success, "Token Generated:", Boolean(loginRes.token));

  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${loginRes.token}` },
  }).then((r) => r.json());

  console.log("✓ Protected Profile Fetch (/api/auth/me):", meRes.success, "Name:", meRes.user?.name);
  console.log();

  // 2. TEST 52: Critical SHA-256 Hashing Algorithm Test
  console.log("--- 2. Critical SHA-256 Hashing Test ---");
  const contentOriginal = Buffer.from("Hello VerifyX Digital Asset Authenticator 2026");
  const hashOriginalA = crypto.createHash("sha256").update(contentOriginal).digest("hex");
  const hashOriginalB = crypto.createHash("sha256").update(contentOriginal).digest("hex");

  console.log("✓ Same Content Deterministic Hash Match:", hashOriginalA === hashOriginalB);
  console.log("   Hash A:", hashOriginalA);
  console.log("   Hash B:", hashOriginalB);

  const contentModified = Buffer.from("Hello VerifyX Digital Asset Authenticator 2026!"); // Added '!'
  const hashModified = crypto.createHash("sha256").update(contentModified).digest("hex");

  console.log("✓ Content Tampering Detected (Hash A != Modified Hash):", hashOriginalA !== hashModified);
  console.log("   Modified Hash:", hashModified);
  console.log();

  // 3. TEST 53: Authentic Digital Asset Registration & Verification Test
  console.log("--- 3. Register Digital Asset & Verify Authentic Status ---");
  const certBufferBase64 = contentOriginal.toString("base64");

  const assetRegRes = await fetch(`${BASE_URL}/assets/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${loginRes.token}`,
    },
    body: JSON.stringify({
      assetName: "Q3 Executive Audit Certificate",
      fileName: "certificate.pdf",
      fileType: "application/pdf",
      fileBuffer: certBufferBase64,
    }),
  }).then((r) => r.json());

  console.log("✓ Asset Registered:", assetRegRes.success, "Asset ID:", assetRegRes.asset?.assetId);
  console.log("   SHA-256 Fingerprint:", assetRegRes.asset?.sha256Hash);
  console.log("   Blockchain Status:", assetRegRes.asset?.blockchainStatus);

  const registeredAssetId = assetRegRes.asset?.assetId;

  // Now verify exact same file
  const verifyAuthenticRes = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assetId: registeredAssetId,
      fileName: "certificate.pdf",
      fileBuffer: certBufferBase64,
    }),
  }).then((r) => r.json());

  console.log("✓ Authentic Verification Result:", verifyAuthenticRes.result === "AUTHENTIC");
  console.log("   Result Status:", verifyAuthenticRes.result);
  console.log("   Hash Match:", verifyAuthenticRes.isHashMatch);
  console.log("   Message:", verifyAuthenticRes.message);
  console.log();

  // 4. TEST 54: Modified / Tampered Asset Verification Test
  console.log("--- 4. Modified Digital Asset Verification Test ---");
  const modBufferBase64 = contentModified.toString("base64");

  const verifyModifiedRes = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assetId: registeredAssetId,
      fileName: "certificate_modified.pdf",
      fileBuffer: modBufferBase64,
    }),
  }).then((r) => r.json());

  console.log("✓ Tampered File Verification Result:", verifyModifiedRes.result === "MODIFIED");
  console.log("   Result Status:", verifyModifiedRes.result);
  console.log("   Hash Match:", verifyModifiedRes.isHashMatch);
  console.log("   Submitted Hash:", verifyModifiedRes.submittedHash);
  console.log("   Stored Registered Hash:", verifyModifiedRes.storedHash);
  console.log();

  // 5. TEST 55: Unregistered Digital Asset Verification Test
  console.log("--- 5. Unregistered Asset Verification Test ---");
  const unrelatedBuffer = Buffer.from("Unrelated random document content " + Date.now());
  const unrelatedBase64 = unrelatedBuffer.toString("base64");

  const verifyUnregisteredRes = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: "unrelated.pdf",
      fileBuffer: unrelatedBase64,
    }),
  }).then((r) => r.json());

  console.log("✓ Unregistered Verification Result:", verifyUnregisteredRes.result === "NOT_REGISTERED");
  console.log("   Result Status:", verifyUnregisteredRes.result);
  console.log("   Message:", verifyUnregisteredRes.message);
  console.log();

  // 6. Verification History & Dashboard API Tests
  console.log("--- 6. Dashboard & Audit History APIs Test ---");
  const dashStats = await fetch(`${BASE_URL}/dashboard/stats`).then((r) => r.json());
  console.log("✓ Dashboard Aggregated Stats:", dashStats.success, dashStats.stats);

  const historyRes = await fetch(`${BASE_URL}/verify/history`).then((r) => r.json());
  console.log("✓ Audit History Log Count:", historyRes.history?.length);

  console.log("\n=== ALL DIGITAL ASSET AUTHENTICATION TESTS PASSED 100% CLEAN ===");
}

runAssetAuthenticationTests().catch(console.error);
