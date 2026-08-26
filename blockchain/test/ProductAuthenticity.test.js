const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProductAuthenticity Smart Contract", function () {
  let contract;
  let owner;
  let manufacturer;
  let buyer;
  let attacker;

  const testProductId = "PROD-2026-X900";
  const testProductHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  beforeEach(async function () {
    [owner, manufacturer, buyer, attacker] = await ethers.getSigners();

    const ProductAuthenticity = await ethers.getContractFactory("ProductAuthenticity");
    contract = await ProductAuthenticity.deploy();
    await contract.waitForDeployment();
  });

  describe("Product Registration", function () {
    it("should allow manufacturer to register a product with hash", async function () {
      await expect(contract.connect(manufacturer).registerProduct(testProductId, testProductHash))
        .to.emit(contract, "ProductRegistered")
        .withArgs(testProductId, testProductHash, manufacturer.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const product = await contract.getProduct(testProductId);
      expect(product.productId).to.equal(testProductId);
      expect(product.productHash).to.equal(testProductHash);
      expect(product.manufacturer).to.equal(manufacturer.address);
      expect(product.currentOwner).to.equal(manufacturer.address);
      expect(product.isActive).to.equal(true);
      expect(product.exists).to.equal(true);
    });

    it("should reject duplicate product registration", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      await expect(
        contract.connect(manufacturer).registerProduct(testProductId, testProductHash)
      ).to.be.revertedWith("Product already registered on blockchain");
    });

    it("should reject registration with empty parameters", async function () {
      await expect(
        contract.connect(manufacturer).registerProduct("", testProductHash)
      ).to.be.revertedWith("Product ID cannot be empty");

      await expect(
        contract.connect(manufacturer).registerProduct(testProductId, "")
      ).to.be.revertedWith("Product hash cannot be empty");
    });
  });

  describe("Product Verification", function () {
    it("should verify existing product accurately", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      const res = await contract.verifyProduct(testProductId);
      expect(res.exists).to.equal(true);
      expect(res.productHash).to.equal(testProductHash);
      expect(res.manufacturer).to.equal(manufacturer.address);
      expect(res.currentOwner).to.equal(manufacturer.address);
      expect(res.isActive).to.equal(true);
    });

    it("should return exists = false for unregistered product", async function () {
      const res = await contract.verifyProduct("NON-EXISTENT-ID");
      expect(res.exists).to.equal(false);
    });
  });

  describe("Ownership Transfer", function () {
    it("should allow current owner to transfer ownership", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      await expect(contract.connect(manufacturer).transferOwnership(testProductId, buyer.address))
        .to.emit(contract, "OwnershipTransferred")
        .withArgs(testProductId, manufacturer.address, buyer.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const product = await contract.getProduct(testProductId);
      expect(product.currentOwner).to.equal(buyer.address);
    });

    it("should prevent non-owner from transferring ownership", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      await expect(
        contract.connect(attacker).transferOwnership(testProductId, attacker.address)
      ).to.be.revertedWith("Only current product owner or contract admin can perform this action");
    });
  });

  describe("Product Deactivation", function () {
    it("should allow owner to deactivate product", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      await expect(contract.connect(manufacturer).deactivateProduct(testProductId))
        .to.emit(contract, "ProductDeactivated")
        .withArgs(testProductId, manufacturer.address, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const product = await contract.getProduct(testProductId);
      expect(product.isActive).to.equal(false);
    });

    it("should prevent unauthorized deactivation", async function () {
      await contract.connect(manufacturer).registerProduct(testProductId, testProductHash);

      await expect(
        contract.connect(attacker).deactivateProduct(testProductId)
      ).to.be.revertedWith("Only current product owner or contract admin can perform this action");
    });
  });
});
