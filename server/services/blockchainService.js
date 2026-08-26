const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

let contractInstance = null;
let providerInstance = null;

function getContract() {
  if (contractInstance) return contractInstance;

  try {
    const artifactPath = path.join(__dirname, "../config/contractArtifact.json");
    if (!fs.existsSync(artifactPath)) {
      console.warn("⚠️ Contract artifact file not found. Blockchain direct queries disabled.");
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
  verifyOnBlockchain,
};
