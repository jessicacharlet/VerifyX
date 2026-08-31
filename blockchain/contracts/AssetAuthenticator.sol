// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AssetAuthenticator
 * @dev Smart contract for registering and verifying digital asset SHA-256 cryptographic fingerprints on Ethereum.
 */
contract AssetAuthenticator {
    struct AssetRecord {
        string assetId;
        bytes32 sha256Hash;
        address owner;
        uint256 timestamp;
        bool isRegistered;
    }

    // Mapping from Asset ID to AssetRecord
    mapping(string => AssetRecord) private _assets;

    // Event emitted when a digital asset is registered on-chain
    event AssetRegistered(
        string indexed assetId,
        bytes32 sha256Hash,
        address indexed owner,
        uint256 timestamp
    );

    /**
     * @dev Register a digital asset's SHA-256 hash on-chain
     * @param assetId Unique string identifier for the asset (e.g., AST-000001)
     * @param sha256Hash 32-byte representation of the asset SHA-256 hash
     */
    function registerAsset(string calldata assetId, bytes32 sha256Hash) external {
        require(bytes(assetId).length > 0, "Asset ID cannot be empty");
        require(sha256Hash != bytes32(0), "SHA-256 hash cannot be empty");
        require(!_assets[assetId].isRegistered, "Asset ID is already registered");

        _assets[assetId] = AssetRecord({
            assetId: assetId,
            sha256Hash: sha256Hash,
            owner: msg.sender,
            timestamp: block.timestamp,
            isRegistered: true
        });

        emit AssetRegistered(assetId, sha256Hash, msg.sender, block.timestamp);
    }

    /**
     * @dev Get registered asset details by Asset ID
     */
    function getAsset(string calldata assetId)
        external
        view
        returns (
            string memory id,
            bytes32 sha256Hash,
            address owner,
            uint256 timestamp,
            bool isRegistered
        )
    {
        AssetRecord memory record = _assets[assetId];
        require(record.isRegistered, "Asset not found on blockchain");

        return (
            record.assetId,
            record.sha256Hash,
            record.owner,
            record.timestamp,
            record.isRegistered
        );
    }

    /**
     * @dev Check whether an Asset ID is registered on-chain
     */
    function assetExists(string calldata assetId) external view returns (bool) {
        return _assets[assetId].isRegistered;
    }

    /**
     * @dev Verify if a submitted SHA-256 hash matches the on-chain recorded hash
     */
    function verifyAsset(string calldata assetId, bytes32 submittedHash)
        external
        view
        returns (bool isMatch, uint256 timestamp)
    {
        AssetRecord memory record = _assets[assetId];
        if (!record.isRegistered) {
            return (false, 0);
        }
        return (record.sha256Hash == submittedHash, record.timestamp);
    }
}
