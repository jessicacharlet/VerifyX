const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const BlockchainRecord = require("../models/BlockchainRecord");

let contractInstance = null;
let providerInstance = null;

function getContract() {
  if (contractInstance) return contractInstance;

  try {
    const artifactPath = path.join(__dirname, "../config/contractArtifact.json");
    if (!fs.existsSync(artifactPath)) {
      return null;
    }

    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || "http://127.0.0.1:8545";
    const contractAddress = process.env.CONTRACT_ADDRESS || artifact.address;

    providerInstance = new ethers.JsonRpcProvider(rpcUrl);
    contractInstance = new ethers.Contract(contractAddress, artifact.abi, providerInstance);
    return contractInstance;
  } catch (error) {
    console.warn("⚠️ Unable to connect to blockchain node:", error.message);
    return null;
  }
}

/**
 * Record a lifecycle event proof on-chain or store as NOT_CONFIGURED
 */
async function recordLifecycleEventOnChain(productId, stage, location, scanId = "") {
  // Generate deterministic SHA-256 event hash
  const timestampStr = new Date().toISOString();
  const rawData = `${productId}|${stage}|${location}|${timestampStr}`;
  const eventHash = "0x" + crypto.createHash("sha256").update(rawData).digest("hex");

  const contract = getContract();
  if (!contract) {
    // Record as NOT_CONFIGURED in MongoDB
    const dbRecord = await BlockchainRecord.create({
      productId,
      scanId,
      stage,
      eventHash,
      transactionHash: "",
      network: "Offline / Database Audit Only",
      contractAddress: "",
      status: "NOT_CONFIGURED",
      timestamp: new Date(),
    });

    return {
      connected: false,
      eventHash,
      transactionHash: "",
      status: "NOT_CONFIGURED",
      record: dbRecord,
    };
  }

  try {
    // Attempt contract call if RPC node is connected
    const tx = await contract.recordEvent(productId, stage, eventHash);
    const receipt = await tx.wait();

    const dbRecord = await BlockchainRecord.create({
      productId,
      scanId,
      stage,
      eventHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      network: "Ethereum Sepolia / Hardhat Local",
      contractAddress: contract.target || "",
      status: "CONFIRMED",
      timestamp: new Date(),
    });

    return {
      connected: true,
      eventHash,
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      status: "CONFIRMED",
      record: dbRecord,
    };
  } catch (err) {
    console.warn("⚠️ Blockchain contract execution failed, recording FAILED status:", err.message);

    const dbRecord = await BlockchainRecord.create({
      productId,
      scanId,
      stage,
      eventHash,
      transactionHash: "",
      network: "Ethereum Sepolia / Hardhat Local",
      contractAddress: contract.target || "",
      status: "FAILED",
      timestamp: new Date(),
    });

    return {
      connected: false,
      eventHash,
      transactionHash: "",
      status: "FAILED",
      error: err.message,
      record: dbRecord,
    };
  }
}

/**
 * Verify product hash against smart contract record on blockchain
 */
async function verifyOnBlockchain(productId) {
  const contract = getContract();
  if (!contract) {
    return { connected: false, message: "Blockchain node connection unavailable" };
  }

  try {
    const [exists, productHash, manufacturer, currentOwner, registrationTimestamp, isActive] =
      await contract.verifyProduct(productId);

    return {
      connected: true,
      exists,
      productHash,
      manufacturer,
      currentOwner,
      registrationTimestamp: Number(registrationTimestamp),
      isActive,
    };
  } catch (error) {
    console.error("Blockchain verification error:", error.message);
    return { connected: false, error: error.message };
  }
}

module.exports = {
  getContract,
  recordLifecycleEventOnChain,
  verifyOnBlockchain,
};
