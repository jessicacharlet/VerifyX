// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ProductAuthenticity
 * @dev Decentralized Product Authenticity Verification Smart Contract
 * Stores cryptographic SHA-256 hashes of products and manages verification, ownership, and status.
 */
contract ProductAuthenticity {
    address public contractOwner;

    struct ProductRecord {
        string productId;
        string productHash;
        address manufacturer;
        address currentOwner;
        uint256 registrationTimestamp;
        bool isActive;
        bool exists;
    }

    // Mapping from productId -> ProductRecord
    mapping(string => ProductRecord) private products;

    // List of registered product IDs for iteration / counting
    string[] private registeredProductIds;

    // Events
    event ProductRegistered(
        string indexed productId,
        string productHash,
        address indexed manufacturer,
        uint256 timestamp
    );

    event OwnershipTransferred(
        string indexed productId,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 timestamp
    );

    event ProductDeactivated(
        string indexed productId,
        address indexed deactivatedBy,
        uint256 timestamp
    );

    modifier onlyContractOwner() {
        require(msg.sender == contractOwner, "Only contract owner can perform this action");
        _;
    }

    modifier onlyProductOwner(string memory _productId) {
        require(products[_productId].exists, "Product does not exist");
        require(
            msg.sender == products[_productId].currentOwner || msg.sender == contractOwner,
            "Only current product owner or contract admin can perform this action"
        );
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    /**
     * @dev Register a new product on the blockchain with its cryptographic SHA-256 hash.
     */
    function registerProduct(string memory _productId, string memory _productHash) external {
        require(bytes(_productId).length > 0, "Product ID cannot be empty");
        require(bytes(_productHash).length > 0, "Product hash cannot be empty");
        require(!products[_productId].exists, "Product already registered on blockchain");

        products[_productId] = ProductRecord({
            productId: _productId,
            productHash: _productHash,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            registrationTimestamp: block.timestamp,
            isActive: true,
            exists: true
        });

        registeredProductIds.push(_productId);

        emit ProductRegistered(_productId, _productHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify product authenticity against stored blockchain state.
     */
    function verifyProduct(string memory _productId)
        external
        view
        returns (
            bool exists,
            string memory productHash,
            address manufacturer,
            address currentOwner,
            uint256 registrationTimestamp,
            bool isActive
        )
    {
        ProductRecord memory p = products[_productId];
        return (
            p.exists,
            p.productHash,
            p.manufacturer,
            p.currentOwner,
            p.registrationTimestamp,
            p.isActive
        );
    }

    /**
     * @dev Get complete product struct.
     */
    function getProduct(string memory _productId) external view returns (ProductRecord memory) {
        require(products[_productId].exists, "Product does not exist");
        return products[_productId];
    }

    /**
     * @dev Transfer ownership of a product to a new wallet address.
     */
    function transferOwnership(string memory _productId, address _newOwner)
        external
        onlyProductOwner(_productId)
    {
        require(_newOwner != address(0), "Invalid new owner address");
        require(products[_productId].isActive, "Cannot transfer inactive/recalled product");

        address previousOwner = products[_productId].currentOwner;
        products[_productId].currentOwner = _newOwner;

        emit OwnershipTransferred(_productId, previousOwner, _newOwner, block.timestamp);
    }

    /**
     * @dev Deactivate / Recall a product.
     */
    function deactivateProduct(string memory _productId) external onlyProductOwner(_productId) {
        require(products[_productId].isActive, "Product is already deactivated");

        products[_productId].isActive = false;

        emit ProductDeactivated(_productId, msg.sender, block.timestamp);
    }

    /**
     * @dev Get total count of registered products on-chain.
     */
    function getProductCount() external view returns (uint256) {
        return registeredProductIds.length;
    }
}
