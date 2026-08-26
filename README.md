# VeriMark — Blockchain-Based Product Authentication System

> A production-grade, full-stack decentralized product authenticity verification platform leveraging **Ethereum Solidity Smart Contracts**, **SHA-256 Cryptographic Hashing**, **Node.js/Express REST API**, **MongoDB**, and **React + Vite**. Inspired by the research on decentralized product anti-counterfeiting using QR code integration and distributed ledgers.

---

## 1. Problem Statement

Product counterfeiting is a multi-billion-dollar global crisis affecting consumer safety, brand reputation, and economic integrity across luxury goods, electronics, pharmaceuticals, apparel, and automotive parts. Traditional physical security labels (holograms, standard barcodes, paper certificates) are vulnerable to duplication, tampering, and central database manipulation.

---

## 2. Solution Overview

**VeriMark** solves counterfeit detection through a multi-layered cryptographic approach:

1. **Deterministic SHA-256 Cryptographic Hashing**: When a manufacturer registers a product, important metadata (Product ID, Serial Number, Batch Number, Brand, Category) is hashed into an unalterable 64-character digital fingerprint.
2. **Immutable Blockchain Ledger**: The SHA-256 hash, manufacturer wallet address, and registration timestamp are committed to an Ethereum smart contract (`ProductAuthenticity.sol`).
3. **Unique QR Code Integration**: Each physical item receives a unique QR code encoding a direct public verification route (`/verify/{productId}`).
4. **Instant Multi-Method Public Verification**: Customers scan the QR code or enter the Product ID / Serial Number without needing to log in. The system compares the stored MongoDB state against the on-chain smart contract state, returning a visual **✓ AUTHENTIC PRODUCT** or **⚠ PRODUCT COULD NOT BE AUTHENTICATED** alert.

---

## 3. Architecture

```
 ┌─────────────────────────────────────────────────────────────┐
 │                     React 18 + Vite Client                  │
 │ (Tailwind CSS, Lucide Icons, Recharts, Ethers.js, HTML5-QR) │
 └──────────────┬───────────────────────────────┬──────────────┘
                │ REST API Calls                │ Web3 / RPC Calls
                ▼                               ▼
 ┌─────────────────────────────┐   ┌─────────────────────────────┐
 │   Node.js + Express REST    │   │  Hardhat / Ethereum Node    │
 │ (JWT, Multer, SHA-256, CORS)│   │  ProductAuthenticity.sol    │
 └──────────────┬──────────────┘   └─────────────────────────────┘
                │ Mongoose ODM
                ▼
 ┌─────────────────────────────┐
 │      MongoDB Database       │
 └─────────────────────────────┘
```

- **Off-Chain Storage**: Full product metadata, brand information, batch histories, high-resolution product images, and customer scan activity logs are stored in MongoDB.
- **On-Chain Storage**: Lightweight cryptographic data (Product ID, SHA-256 Hash, Manufacturer Address, Current Owner, Registration Timestamp, Active Status) is stored on-chain to minimize gas fees.

---

## 4. Key Features & User Roles

### 🏢 Manufacturer Role
- **Account Registration & Authentication**: Secure sign up and login with bcrypt password hashing and JWT.
- **Product Registration**: Upload product image, input serial numbers and batch details, compute SHA-256 hash.
- **Blockchain Smart Contract Minting**: Connect MetaMask wallet to sign on-chain transaction registering product identity on Ethereum.
- **QR Code Label Generation**: Automatically generate downloadable PNG and printable QR code labels.
- **Operations Dashboard**: View total products, authentic items, active market status, recalled products, and interactive Recharts analytics (scans over time, product category donut chart, status bar chart).
- **Ownership Transfer & Recall**: Transfer product ownership to a new wallet or deactivate/recall suspicious items.

### 👤 Customer Role (Public / No Login Required)
- **Instant QR Camera Scanner**: Live camera viewfinder or image upload option to scan physical product labels.
- **Manual Product Lookup**: Query by Product ID or Serial Number.
- **Verification Screen**:
  - **✓ AUTHENTIC**: Displays green glowing shield, 100% hash match indicator, manufacturer identity, serial specs, scan count, and Etherscan transaction link.
  - **⚠ NOT AUTHENTIC**: Displays red warning banner, failure analysis (hash mismatch, unregistered serial, recalled status), and consumer anti-counterfeit guidance.
- **Lifecycle Timeline**: View vertical timeline showing product registration, on-chain contract timestamp, ownership transfers, and verification history.

### 🛡️ Admin Security Role
- **Governance Dashboard**: Monitor total system users, registered products, verification attempts, and suspicious alerts.
- **User Management**: Search, filter, and toggle active/inactive account status.
- **Suspicious Activity Monitoring**: Review failed verification attempts, flagged products, and deactivate fraudulent registrations.

---

## 5. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Ethers.js, HTML5-QRCode, QRCode generator.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer (file upload), Crypto (SHA-256).
- **Database**: MongoDB & Mongoose.
- **Blockchain**: Solidity 0.8.24, Hardhat, Ethers.js, MetaMask Web3 provider.

---

## 6. Smart Contract Details (`ProductAuthenticity.sol`)

The `ProductAuthenticity.sol` Solidity contract defines:

```solidity
struct ProductRecord {
    string productId;
    string productHash;
    address manufacturer;
    address currentOwner;
    uint256 registrationTimestamp;
    bool isActive;
    bool exists;
}
```

Key Contract Functions:
- `registerProduct(string productId, string productHash)`: Registers a new product identity on-chain.
- `verifyProduct(string productId)`: View function returning product existence, stored SHA-256 hash, owner address, timestamp, and active status.
- `transferOwnership(string productId, address newOwner)`: Allows current product owner or admin to transfer ownership on-chain.
- `deactivateProduct(string productId)`: Marks product as inactive/recalled.
- Events emitted: `ProductRegistered`, `OwnershipTransferred`, `ProductDeactivated`.

---

## 7. System Workflow & Data Flow

```
Manufacturer Form Data -> SHA-256 Hash Computation -> Save MongoDB Metadata
                                      │
                                      ▼
                        MetaMask / Web3 Wallet Sign
                                      │
                                      ▼
               ProductAuthenticity.sol registerProduct()
                                      │
                                      ▼
                    Generate QR Code (/verify/PROD-100)
                                      │
                                      ▼
             Customer Scans QR -> Backend Fetches On-Chain Record
                                      │
                                      ▼
         MongoDB Hash == On-Chain Hash ? AUTHENTIC : COUNTERFEIT
```

---

## 8. Database Schema

### `User` Schema
`name`, `email` (unique), `password` (bcrypt), `role` (`manufacturer`, `customer`, `admin`), `walletAddress`, `companyName`, `phone`, `isActive`, `createdAt`, `updatedAt`.

### `Product` Schema
`productId` (unique), `productName`, `brandName`, `category`, `manufacturer` (ref User), `description`, `batchNumber`, `serialNumber` (unique), `manufacturingDate`, `expiryDate`, `productImage`, `productHash` (SHA-256), `ownerWallet`, `blockchainProductId`, `transactionHash`, `qrCode` (Data URL), `status` (`AUTHENTIC`, `ACTIVE`, `RECALLED`, `SUSPENDED`, `COUNTERFEIT`).

### `Verification` Schema
`verificationId` (unique), `productId`, `scannedCode`, `verificationStatus` (`SUCCESS`, `FAILED_HASH_MISMATCH`, `FAILED_NOT_FOUND`, `FAILED_INACTIVE`), `location`, `timestamp`, `blockchainTransactionHash`.

---

## 9. API Endpoints

### Auth Endpoints
- `POST /api/auth/register` — Register manufacturer/user account
- `POST /api/auth/login` — Authenticate and return JWT token
- `GET /api/auth/me` — Get logged in user profile

### Product Endpoints
- `POST /api/products` — Create product, calculate SHA-256, upload image & generate QR
- `GET /api/products` — Search, filter, and paginate products
- `GET /api/products/:id` — Retrieve product details and history
- `PUT /api/products/:id` — Update product details
- `POST /api/products/:id/transfer` — Transfer product ownership
- `POST /api/products/:id/deactivate` — Deactivate / Recall product

### Verification Endpoints
- `POST /api/verify` — Public endpoint verifying Product ID / QR against on-chain hash
- `GET /api/verify/:productId` — Public verification readout
- `GET /api/products/:id/history` — Get product verification timeline

### Admin & Blockchain Endpoints
- `GET /api/admin/analytics` — Global dashboard analytics summary
- `GET /api/admin/users` — List and filter users
- `PUT /api/admin/users/:id/toggle` — Toggle user active status
- `GET /api/blockchain/product/:id` — Query on-chain smart contract status

---

## 10. Installation & Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI
- Git

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/jessicacharlet/VerifyX.git
cd VerifyX

# Install all subfolder dependencies
npm run install:all
```

### 2. Environment Variables Setup
Create `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/verimark
JWT_SECRET=verimark_jwt_secret_key_2026_secure_hash_authentication
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 3. Compile & Deploy Smart Contracts
```bash
# Compile Solidity contracts & run Hardhat tests
npm run hardhat:test

# Deploy contract locally
npm run hardhat:deploy
```

### 4. Seed Realistic Demo Data
```bash
npm run seed
```

### 5. Launch Application
In separate terminal windows (or using `npm start`):
```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client

# Terminal 3 (Optional): Local Hardhat Blockchain Node (Port 8545)
npm run hardhat:node
```

Access the app at: `http://localhost:5173`

---

## 11. Testing

### Run Smart Contract Hardhat Tests
```bash
cd blockchain
npx hardhat test
```
*Tests 9 core scenarios: Product registration, duplicate rejection, hash verification, ownership transfer, unauthorized action rejection, and contract events.*

### Run Server Unit Tests
```bash
cd server
npm test
```
*Tests SHA-256 cryptographic hash determinism and string normalization.*

---

## 12. Future Enhancements

- **NFC Tag & RFID Integration**: Physical hardware tap verification using mobile WebNFC API.
- **IPFS Storage**: Decoupled decentralized file storage for high-res product certificates and images.
- **Supply Chain IoT Sensor Tracking**: Real-time temperature, location, and humidity telemetry logged to smart contracts.
- **Zero-Knowledge Proofs (ZKP)**: Verify product authenticity without revealing sensitive batch size or manufacturer identity.
- **AI Counterfeit Pattern Analysis**: Machine learning models detecting suspicious geographic scan clusters and anomalous verification spikes.

---

## 13. License

Distributed under the MIT License. See `LICENSE` for more information.
