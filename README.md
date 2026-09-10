# VerifyX — Digital Asset Authentication, Verification & Lifecycle Platform

> A high-performance digital asset authentication and verification platform for registering, protecting, and verifying digital files using deterministic SHA-256 cryptographic signatures, MongoDB storage, and Ethereum blockchain recording.

🌐 **Live Production Deployment**: [https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)

---

## 1. Core Workflow & Digital Asset Authenticity

VerifyX protects and authenticates digital assets (documents, images, PDFs, certificates, data files) using cryptographic signatures:

```
[1] REGISTER FILE ➔ [2] STREAM SHA-256 ➔ [3] STORE RECORD ➔ [4] ASYNC BLOCKCHAIN QUEUE
                                                                      │
[7] RETURN RESULT ⬅ [6] COMPARE HASH ⬅ [5] UPLOAD FILE FOR VERIFY ◄───┘
```

### Digital Asset Verification Workflow:
1. **Asset Registration**: User uploads an original digital file.
2. **Deterministic SHA-256 Fingerprinting**: A 64-character SHA-256 cryptographic hash is generated from raw file bytes.
3. **MongoDB Storage**: Asset metadata, owner ID, file properties, and SHA-256 fingerprint are stored in indexed MongoDB collections.
4. **Asynchronous Non-Blocking Blockchain Recording**: On-chain Ethereum smart contract registration is queued asynchronously in the background (`PENDING` $\rightarrow$ `CONFIRMED`).
5. **Verification**: User uploads any file later. VerifyX computes its SHA-256 hash and compares it against the registered database fingerprint.
6. **Result Outcome**:
   - **`ORIGINAL` (`AUTHENTIC`)**: Submitted file matches the registered cryptographic fingerprint.
   - **`MODIFIED`**: Submitted file hash differs from the registered original fingerprint (tampering/content modification detected).
   - **`NOT REGISTERED`**: No authenticity record exists for the submitted file or asset ID.

---

## 2. High-Performance Architecture Highlights

The VerifyX backend is optimized for maximum performance, minimal RAM usage, and instant API responsiveness:

- ⚡ **Asynchronous Non-Blocking Blockchain**: Registration endpoints respond instantly (< 50ms) after SHA-256 generation and database storage. Smart contract execution runs in non-blocking background workers without stalling HTTP connections.
- 🌊 **Stream-Based SHA-256 Hashing**: Uses Node.js `fs.createReadStream` to compute cryptographic hashes incrementally without loading large files synchronously into RAM buffers.
- 🏊 **MongoDB Connection Pooling & Indexing**: Connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`) reuses active connections. Database indexes on `sha256Hash`, `assetId`, `ownerId`, `result`, and `createdAt` enable high-speed searches.
- 🚀 **Unified Single-Roundtrip Dashboard API**: `/api/dashboard` consolidates statistics and recent records into a single parallel backend query (`Promise.all`), reducing frontend roundtrips from 3 to 1.
- 📄 **Paginated Audit History Logs**: `/api/verify/history` supports `page` and `limit` parameters for efficient history log browsing.

---

## 3. Key Platform Features

### 🏢 Digital Asset Dashboard (`/dashboard`)
- Real-time total registered assets, authentic verifications, modified file alerts, unrecognized file counts, and recent asset audit streams.

### 📄 Register Digital Asset (`/assets/register`)
- Drag-and-drop file upload (PDF, DOCX, PNG, JPG, TXT) with automatic SHA-256 fingerprinting, unique Asset ID generation (`AST-XXXXXX`), and optional display name tagging.

### 🔍 Digital Asset Verification (`/verify`)
- Fast file comparison producing clear **ORIGINAL**, **MODIFIED**, or **NOT REGISTERED** outcomes, with collapsible technical SHA-256 hash comparison and blockchain proof cards.

### 📜 Audit History (`/verification-history`)
- Searchable and filterable verification audit trail with pagination and collapsible technical inspection details.

### 📦 QR Product Lifecycle Module (`/orders`, `/scan`, `/shipments`)
- Enterprise product lifecycle tracking from order placement through QR assignment, packaging, quality checkpoints, transport hubs, and delivery.

---

## 4. Primary API Endpoints

### Digital Asset APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/assets/register` | Register a digital asset file & compute SHA-256 fingerprint |
| `GET` | `/api/assets` | Get registered assets list with filters & search |
| `GET` | `/api/assets/:id` | Get single asset details by Asset ID or Mongo ID |

### Verification APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/verify` | Upload file & verify SHA-256 against registered database record |
| `GET` | `/api/verify/history` | Get paginated verification audit history logs |
| `GET` | `/api/verify/history/:id` | Get single verification audit record details |

### Dashboard & Analytics APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard` | Get consolidated stats & recent assets/verifications in 1 roundtrip |
| `GET` | `/api/dashboard/stats` | Get aggregated dashboard statistics |
| `GET` | `/api/health` | Health check endpoint and DB connection status |

### User Authentication APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |

---

## 5. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS + Tailwind CSS, Lucide Icons, HTML5-QRCode.
- **Backend**: Node.js, Express.js REST API, Vercel Serverless Functions, JWT, bcryptjs, Crypto (SHA-256 streams).
- **Database**: MongoDB Atlas & Mongoose ODM with connection pooling and compound indexing.
- **Blockchain**: Solidity Smart Contract (`contractArtifact.json`), Ethers.js v6, Hardhat / Ethereum Sepolia.

---

## 6. Role-Based Demo Accounts

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@verimark.io` | `password123` | Full enterprise control & user management |
| **Warehouse Operator** | `warehouse@verimark.io` | `password123` | Asset registration & product assignment |
| **QC Inspector** | `qc@verimark.io` | `password123` | Quality checks & verification inspection |
| **Customer / User** | `customer@gmail.com` | `password123` | Asset verification & history audit |

---

## 7. Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/jessicacharlet/VerifyX.git
cd VerifyX

# Install subfolder dependencies
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
```

### 3. Run Automated Authentication Test Suite
```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Run test suite
node scripts/test_asset_authentication.js
```

### 4. Run Full Application Locally
```bash
# Terminal 1: Backend API (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Access application at `http://localhost:5173`.

---

## 8. License

Distributed under the MIT License. See `LICENSE` for more information.

