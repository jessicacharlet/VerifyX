# VeriMark — Blockchain-Based Product Authentication System

> A production-grade, full-stack decentralized product authenticity verification platform leveraging **Ethereum Solidity Smart Contracts**, **SHA-256 Cryptographic Hashing**, **Node.js/Express REST API**, **MongoDB**, **Python AI Image Analysis Microservice**, and **React 18 + Vite**. Inspired by research on decentralized product anti-counterfeiting using QR code integration and distributed ledgers.

🌐 **Live Vercel Production Deployment**: [https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)

---

## 1. Problem Statement

Product counterfeiting is a multi-billion-dollar global crisis affecting consumer safety, brand reputation, and economic integrity across luxury goods, electronics, pharmaceuticals, apparel, and automotive parts. Traditional physical security labels (holograms, standard barcodes, paper certificates) are vulnerable to duplication, tampering, and central database manipulation.

---

## 2. Solution Overview

**VerifyX** solves counterfeit detection through a multi-layered cryptographic approach:

1. **Deterministic SHA-256 Cryptographic Hashing**: When a manufacturer registers a product, important metadata (Product ID, Serial Number, Batch Number, Brand, Category) is hashed into an unalterable 64-character digital fingerprint.
2. **Immutable Blockchain Ledger**: The SHA-256 hash, manufacturer wallet address, and registration timestamp are committed to an Ethereum smart contract (`ProductAuthenticity.sol`).
3. **Unique QR Code Integration**: Each physical item receives a unique QR code encoding a direct public verification route (`/verify/{productId}`).
4. **AI Image Forensic Analysis**: Submits product label images to detect digital modifications, pixel anomalies, and compression tampering.
5. **Instant Multi-Method Public Verification**: Customers scan the QR code or enter the Product ID / Serial Number without needing to log in. The system compares the stored MongoDB state against the on-chain smart contract state, returning a visual **✓ AUTHENTIC PRODUCT** or **⚠ PRODUCT COULD NOT BE AUTHENTICATED** alert.

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
 │  Vercel Serverless / Express│   │  Ethereum Smart Contract    │
 │ (JWT, Multer, SHA-256, CORS)│   │  ProductAuthenticity.sol    │
 └──────────────┬──────────────┘   └─────────────────────────────┘
                │ Mongoose ODM
                ▼
 ┌─────────────────────────────┐
 │  MongoDB Atlas Cloud DB     │
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
- **Operations Dashboard**: View total products, authentic items, active market status, recalled products, and interactive Recharts analytics.
- **Ownership Transfer & Recall**: Transfer product ownership to a new wallet or deactivate/recall suspicious items.

### 👤 Customer Role (Public / No Login Required)
- **Instant QR Camera Scanner**: Live camera viewfinder or image upload option to scan physical product labels.
- **Manual Product Lookup**: Query by Product ID or Serial Number.
- **Verification Screen**:
  - **✓ AUTHENTIC PRODUCT**: Displays green glowing shield, 100% hash match indicator, manufacturer identity, serial specs, scan count, and Etherscan transaction link.
  - **Authenticity Score Meter**: Minimal 0-100% score component communicating verification confidence.
  - **Dedicated Blockchain Card**: Shows status, transaction hash, and SHA-256 digital signature with one-click copy buttons.
  - **Dedicated AI Forensic Analysis Card**: Displays modification risk percentage, confidence level, and image similarity gauges.
  - **Verification Evidence Checklist**: Displays real-time validation checks (`✓ Blockchain record matched`, `✓ SHA-256 hash verified`, `✓ Timestamp validated`, `✓ AI analysis completed`).
  - **⚠ NOT AUTHENTIC**: Displays red warning banner, failure analysis (hash mismatch, unregistered serial, recalled status), and consumer anti-counterfeit guidance.
- **Lifecycle Timeline**: View vertical timeline showing product registration, on-chain contract timestamp, ownership transfers, and verification history.

### 🛡️ Admin Security Role
- **Governance Dashboard**: Monitor total system users, registered products, verification attempts, and suspicious alerts.
- **User Management**: Search, filter, and toggle active/inactive account status.
- **Suspicious Activity Monitoring**: Review failed verification attempts, flagged products, and deactivate fraudulent registrations.

---

## 5. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Ethers.js, HTML5-QRCode, QRCode generator.
- **Backend**: Node.js, Express.js, Vercel Serverless Functions, JWT, bcryptjs, Multer, Crypto (SHA-256).
- **Database**: MongoDB Atlas & Mongoose.
- **Blockchain**: Solidity 0.8.24, Hardhat, Ethers.js, MetaMask Web3 provider.
- **AI Service**: Python FastAPI / Flask image forgery analysis microservice.

---

## 6. Smart Contract Details (`ProductAuthenticity.sol`)

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

---

## 7. Installation & Quick Start Guide

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
```bash
# Terminal 1: Backend Server (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client

# Terminal 3 (Optional): Local Hardhat Blockchain Node (Port 8545)
npm run hardhat:node
```

Access the app locally at: `http://localhost:5173`

---

## 8. Deployment to Vercel

The application is fully configured for Vercel Monorepo deployment with Serverless API routing (`vercel.json` + `api/index.js`).

### Deploy via Vercel CLI
```bash
npm run vercel-build
npx vercel --prod
```

### Production URL
👉 **[https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)**

---

## 9. Testing

### Run Smart Contract Hardhat Tests
```bash
cd blockchain
npx hardhat test
```

### Run Server Unit Tests
```bash
cd server
npm test
```

---

## 10. License

Distributed under the MIT License. See `LICENSE` for more information.
