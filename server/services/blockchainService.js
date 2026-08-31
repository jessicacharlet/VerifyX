const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const BlockchainRecord = require("../models/BlockchainRecord");

let contractInstance = null;
let providerInstance = null;
let walletInstance = null;

function getContract() {
  if (contractInstance) return contractInstance;

  try {
    const artifactPath = path.join(__dirname, "../config/contractArtifact.json");
    if (!fs.existsSync(artifactPath)) {
      return null;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const contractAddress = process.env.CONTRACT_ADDRESS || artifact.address;

    if (!rpcUrl || !privateKey) {
      return null;
    }

    providerInstance = new ethers.JsonRpcProvider(rpcUrl);
    walletInstance = new ethers.Wallet(privateKey, providerInstance);
    contractInstance = new ethers.Contract(contractAddress, artifact.abi, walletInstance);
    return contractInstance;
  } catch (error) {
    console.warn("⚠️ Unable to connect to blockchain node:", error.message);
    return null;
  }
}

/**
 * Register a digital asset's SHA-256 hash on Ethereum smart contract
 */
async function registerAssetOnChain(assetId, sha256Hash) {
  const recordId = "BCR-" + Date.now().toString(36).toUpperCase() + "-" + crypto.randomBytes(2).toString("hex").toUpperCase();
  const contract = getContract();

  if (!contract) {
    // Record as NOT_CONFIGURED in MongoDB
    const dbRecord = await BlockchainRecord.create({
      recordId,
      assetId,
      sha256Hash,
      transactionHash: "",
      network: process.env.BLOCKCHAIN_NETWORK || "Ethereum Testnet / Database Audit",
      contractAddress: "",
      status: "NOT_CONFIGURED",
      timestamp: new Date(),
    });

    return {
      connected: false,
      status: "NOT_CONFIGURED",
      transactionHash: "",
      record: dbRecord,
    };
  }

  try {
    // Convert SHA-256 hex string to bytes32 format
    const bytes32Hash = "0x" + sha256Hash;
    const tx = await contract.registerAsset(assetId, bytes32Hash);
    const receipt = await tx.wait();

    const dbRecord = await BlockchainRecord.create({
      recordId,
      assetId,
      sha256Hash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      network: process.env.BLOCKCHAIN_NETWORK || "Ethereum Sepolia",
      contractAddress: contract.target || "",
      status: "CONFIRMED",
      timestamp: new Date(),
    });

    return {
      connected: true,
      status: "CONFIRMED",
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      contractAddress: contract.target || "",
      record: dbRecord,
    };
  } catch (err) {
    console.warn("⚠️ Blockchain contract execution failed, recording FAILED status:", err.message);

    const dbRecord = await BlockchainRecord.create({
      recordId,
      assetId,
      sha256Hash,
      transactionHash: "",
      network: process.env.BLOCKCHAIN_NETWORK || "Ethereum Sepolia",
      contractAddress: contract?.target || "",
      status: "FAILED",
      timestamp: new Date(),
    });

    return {
      connected: false,
      status: "FAILED",
      error: err.message,
      record: dbRecord,
    };
  }
}

/**
 * Verify asset hash against smart contract record on-chain
 */
async function verifyAssetOnChain(assetId, submittedHash) {
  const contract = getContract();
  if (!contract) {
    return { connected: false, status: "NOT_CONFIGURED", message: "Blockchain node connection unconfigured" };
  }

  try {
    const bytes32Hash = "0x" + submittedHash;
    const [isMatch, timestamp] = await contract.verifyAsset(assetId, bytes32Hash);

    return {
      connected: true,
      status: isMatch ? "VERIFIED" : "UNVERIFIED",
      isMatch,
      timestamp: Number(timestamp),
    };
  } catch (error) {
    console.error("Blockchain verification error:", error.message);
    return { connected: false, status: "FAILED", error: error.message };
  }
}

module.exports = {
  getContract,
  registerAssetOnChain,
  verifyAssetOnChain,
};
