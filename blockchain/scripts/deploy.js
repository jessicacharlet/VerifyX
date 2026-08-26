const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ProductAuthenticity smart contract...");

  const ProductAuthenticity = await hre.ethers.getContractFactory("ProductAuthenticity");
  const contract = await ProductAuthenticity.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`ProductAuthenticity contract deployed successfully to: ${contractAddress}`);

  // Obtain contract artifact (ABI)
  const artifactPath = path.join(__dirname, "../artifacts/contracts/ProductAuthenticity.sol/ProductAuthenticity.json");
  let artifactData = { abi: [] };
  if (fs.existsSync(artifactPath)) {
    const rawData = fs.readFileSync(artifactPath, "utf8");
    artifactData = JSON.parse(rawData);
  }

  const exportData = {
    address: contractAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    deployedAt: new Date().toISOString(),
    abi: artifactData.abi,
  };

  // Export artifact to backend & frontend config directories
  const serverConfigDir = path.join(__dirname, "../../server/config");
  const clientConfigDir = path.join(__dirname, "../../client/src/config");

  if (!fs.existsSync(serverConfigDir)) fs.mkdirSync(serverConfigDir, { recursive: true });
  if (!fs.existsSync(clientConfigDir)) fs.mkdirSync(clientConfigDir, { recursive: true });

  fs.writeFileSync(path.join(serverConfigDir, "contractArtifact.json"), JSON.stringify(exportData, null, 2));
  fs.writeFileSync(path.join(clientConfigDir, "contractArtifact.json"), JSON.stringify(exportData, null, 2));

  console.log("Exported contract address and ABI to server and client configuration!");
}

main().catch((error) => {
  console.error("Error during deployment:", error);
  process.exitCode = 1;
});
