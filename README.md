# VerifyX — Digital Asset Authentication, Verification & Lifecycle Platform

> A high-performance digital asset authentication, AI forgery detection, and verification platform for registering, protecting, and verifying digital files using deterministic SHA-256 cryptographic signatures, MongoDB storage, Python AI computer vision models, and Ethereum blockchain recording.

🌐 **Live Production Deployment**: [https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)

---

## 1. Core Workflow & Digital Asset Authenticity

VerifyX protects and authenticates digital assets (documents, images, PDFs, certificates, data files) using cryptographic signatures and AI computer vision:

```
[1] REGISTER FILE ➔ [2] STREAM SHA-256 ➔ [3] STORE RECORD ➔ [4] ASYNC BLOCKCHAIN QUEUE
                                                                      │
[8] RETURN RESULT ⬅ [7] AI FORGERY CHECK ⬅ [6] COMPARE HASH ⬅ [5] UPLOAD FILE FOR VERIFY ◄┘
```

### Digital Asset Verification Workflow:
1. **Asset Registration**: User uploads an original digital file.
2. **Deterministic SHA-256 Fingerprinting**: A 64-character SHA-256 cryptographic hash is generated directly from raw file bytes.
3. **MongoDB Storage**: Asset metadata, owner ID, file properties, and SHA-256 fingerprint are stored in indexed MongoDB collections.
4. **Asynchronous Non-Blocking Blockchain Recording**: On-chain Ethereum smart contract registration is queued asynchronously in the background (`PENDING` $\rightarrow$ `CONFIRMED`).
5. **Verification Upload**: User uploads any file for verification. VerifyX computes its SHA-256 hash and compares it against the registered database fingerprint.
6. **AI Forgery & Manipulation Inspection**: Submits image files through the Python AI microservice to analyze JPEG Error Level Analysis (ELA), pixel noise variance, edge density anomalies, and SSIM similarity.
7. **Result Outcome**:
   - **`ORIGINAL` (`AUTHENTIC`)**: Submitted file matches the registered cryptographic fingerprint.
   - **`MODIFIED`**: Submitted file hash differs from the registered original fingerprint (tampering/content modification detected).
   - **`NOT REGISTERED`**: No authenticity record exists for the submitted file or asset ID.

---

## 2. High-Performance Architecture Highlights

The VerifyX platform is engineered for speed, low memory usage, and instant API responsiveness:

- ⚡ **Asynchronous Non-Blocking Blockchain**: Registration endpoints respond instantly (< 50ms) after SHA-256 generation and database storage. Smart contract execution runs in non-blocking background workers without stalling HTTP connections.
- 🌊 **Stream-Based SHA-256 Hashing**: Uses Node.js `fs.createReadStream` to compute cryptographic hashes incrementally without loading large files synchronously into RAM buffers.
- 🏊 **MongoDB Connection Pooling & Indexing**: Connection pooling (`maxPoolSize: 10`, `minPoolSize: 2`) reuses active connections. Database indexes on `sha256Hash`, `assetId`, `ownerId`, `result`, and `createdAt` enable high-speed searches.
- 🛡️ **Defensive Auth & Exception Handling**: Enforces sanitized user state normalization (`normalizeUser`), preserved protected route navigation, and top-level React `<ErrorBoundary>` exception catching.
- 🤖 **AI Microservice Integration**: Dedicated Flask microservice evaluating Error Level Analysis (ELA), edge density anomalies, color variance, and Structural Similarity (SSIM).
- 🚀 **Unified Single-Roundtrip Dashboard API**: `/api/dashboard` consolidates statistics and recent records into a single parallel backend query (`Promise.all`), reducing frontend roundtrips from 3 to 1.
- 📄 **Paginated Audit History Logs**: `/api/verify/history` supports `page` and `limit` parameters for efficient history log browsing.

---

## 3. Key Platform Features

### 🏢 Digital Asset Dashboard (`/dashboard`)
- Real-time total registered assets, authentic verifications, modified file alerts, unrecognized file counts, and recent asset audit streams with error recovery retry states.

### 📄 Register Digital Asset (`/assets/register`)
- Drag-and-drop file upload (PDF, DOCX, PNG, JPG, TXT) with automatic SHA-256 fingerprinting, unique Asset ID generation (`AST-XXXXXX`), optional display name tagging, and post-registration action links (View Asset, Verify Asset, Go to Dashboard).

### 🔍 Digital Asset Verification (`/verify`)
- Fast file comparison producing clear **ORIGINAL**, **MODIFIED**, or **NOT REGISTERED** outcomes, with collapsible technical SHA-256 hash comparison, AI forgery indicators, and blockchain proof cards.

### 🤖 AI Digital Forgery & Manipulation Inspector (`/api/ai/analyze`)
- Computer vision anomaly scoring evaluating JPEG re-compression artifacts, edge discontinuities, pixel noise consistency, and structural similarity (SSIM).

### 📜 Audit History (`/verification-history`)
- Searchable and filterable verification audit trail with pagination and collapsible technical inspection details.

### 🔐 Preserved Protected Route Redirection
- Attempting to visit `/register-asset`, `/assets`, or `/verification-history` while unauthenticated automatically redirects to `/login` with target path retention, restoring the original route after successful authentication.

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

### AI Microservice APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/ai/analyze` | AI image forgery, ELA, noise anomaly & SSIM analysis |

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

- **Frontend**: React 18, Vite, Vanilla CSS + Tailwind CSS, Lucide Icons, HTML5-QRCode, Recharts.
- **Backend**: Node.js, Express.js REST API, Vercel Serverless Functions, JWT, bcryptjs, Crypto (SHA-256 streams).
- **AI Microservice**: Python 3.9+, Flask, Flask-CORS, OpenCV, Pillow (PIL), NumPy, scikit-learn, scikit-image.
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

## 7. Complete Running Commands & CLI Reference

### 🚀 Command Quick Reference Table

| Category | Command | Description |
| :--- | :--- | :--- |
| **Installation** | `npm run install:all` | Install root, client, and blockchain dependencies |
| **Backend API** | `npm run server` | Start Express Node.js API server (`http://localhost:5000`) |
| **Frontend Client** | `npm run client` | Start Vite React dev server (`http://localhost:5173`) |
| **AI Microservice** | `cd ai-service && python app.py` | Start Flask AI Forgery Detection API (`http://localhost:5001`) |
| **Database Seed** | `npm run seed` | Seed MongoDB with demo assets, users, and verification history |
| **Local Hardhat Node** | `npm run hardhat:node` | Spin up local Ethereum dev blockchain (`http://127.0.0.1:8545`) |
| **Deploy Contract** | `npm run hardhat:deploy` | Deploy Solidity smart contract to local network |
| **Test Smart Contract** | `npm run hardhat:test` | Run Hardhat smart contract test suite |
| **E2E Verification Test** | `node scripts/test_asset_authentication.js` | Run full automated asset registration & verification test |
| **Core SHA-256 Test** | `node scripts/test_verification_core.js` | Run fast standalone SHA-256 hashing verification test |
| **AI Model Training** | `python ai-service/training/train_model.py` | Train AI forgery classifier model |
| **Vercel Build** | `npm run vercel-build` | Execute complete production build script for Vercel |

---

### Step-by-Step Running Guide

#### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.9+ for AI Microservice)
- **MongoDB** (Local MongoDB server running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

#### Step 1: Environment Variables Setup
Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/verimark
JWT_SECRET=verimark_jwt_secret_key_2026_secure_hash_authentication
```

---

#### Step 2: Install All Dependencies
Execute the workspace installer script to install Node dependencies across the root, client, and blockchain directories:

```bash
npm run install:all
```

For the AI Microservice, install Python requirements:

```bash
cd ai-service
pip install -r requirements.txt
cd ..
```

---

#### Step 3: Seed Database (Optional)
Populate MongoDB with default role-based demo accounts (`admin`, `warehouse`, `qc`, `customer`) and initial test digital assets:

```bash
npm run seed
```

---

#### Step 4: Run Services (Multi-Terminal Local Setup)

##### Terminal 1: Backend Express API Server (Port 5000)
```bash
npm run server
```

##### Terminal 2: Frontend React Application (Port 5173)
```bash
npm run client
```

##### Terminal 3: Python AI Digital Forgery Microservice (Port 5001)
```bash
cd ai-service
python app.py
```

##### Terminal 4 (Optional): Local Hardhat Blockchain Node
```bash
npm run hardhat:node
```

Deploy smart contract to local node:
```bash
npm run hardhat:deploy
```

Access application UI in your web browser at: **`http://localhost:5173`**

---

#### Step 5: Running Automated Test Suites

Verify backend integrity, cryptographic hashing, and database verification workflows with the included test suites:

```bash
# Ensure backend server is running (npm run server), then execute:
node scripts/test_asset_authentication.js

# Run fast core verification test:
node scripts/test_verification_core.js

# Run Hardhat smart contract unit tests:
npm run hardhat:test
```

---

#### Step 6: AI Model Training & Evaluation Pipeline

To re-train or evaluate the computer vision forgery detection model:

```bash
# 1. Prepare dataset structure
python ai-service/training/prepare_dataset.py

# 2. Train Random Forest / SVM classifier and export model
python ai-service/training/train_model.py

# 3. Evaluate model accuracy, precision, and recall
python ai-service/training/evaluate_model.py
```

---

## 8. License

Distributed under the MIT License. See `LICENSE` for more information.
