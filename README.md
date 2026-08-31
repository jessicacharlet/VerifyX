# VerifyX — QR-Based Product Lifecycle & Verification Platform

> An internal enterprise software platform for tracking physical products throughout their complete product lifecycle — from incoming order registration (received via existing sales channels such as e-commerce, ERP, marketplace, or retail), physical unit assignment, and unique QR printing through packaging, quality control, dispatch, transit hubs, and final customer delivery.

🌐 **Live Production Deployment**: [https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)

---

## 1. Business Concept & Architecture

In modern global commerce, companies receive orders across multiple sales channels (website, ERP, Amazon, retail POS). Once an order is received, companies face massive challenges in product lifecycle tracking, quality checkpoints, box tampering, damage detection, and customer verification.

**VerifyX** operates as an internal enterprise system starting right after an order is received:

$$\text{INCOMING ORDER} \rightarrow \text{ASSIGN PHYSICAL PRODUCT} \rightarrow \text{GENERATE UNIQUE QR} \rightarrow \text{8-STAGE LIFECYCLE AUDIT TRAIL}$$

### 8-Stage Strict Lifecycle Progression
```
[1] ORDER_RECEIVED ➔ [2] PRODUCT_ASSIGNED ➔ [3] QR_GENERATED ➔ [4] PACKED
        ▲
        └────── ➔ [5] QUALITY_CHECK ➔ [6] DISPATCHED ➔ [7] IN_TRANSIT ➔ [8] DELIVERED
```
*Note: Invalid stage jumps are rejected by the backend state machine.*

---

## 2. Key Enterprise Modules

### 🏢 Company Operational Dashboard (`/dashboard`)
- **Real-Time Operations**: Monitor incoming registered orders, items in processing, packed units, dispatches, in-transit checkpoints, completed deliveries, and open quality issues.
- **Operational Audit Stream**: Live feed of recent employee scan events and order status updates.

### 📦 Register Incoming Order & Product Assignment (`/orders`, `/orders/:id`, `/orders/create`)
- **Order Registration**: Register incoming orders received from external sales channels (e-commerce, Amazon, retail POS, ERP) with support for **External Order IDs** (e.g. `AMZ-4589231`) and **Sales Channel** tracking.
- **Physical Product Assignment**: Link an individual physical unit (e.g. `Samsung Galaxy S21 FE`, Product ID: `VX-S21FE-000123`, Serial No: `SN-S21FE-928374`) to an incoming order.
- **Unique QR Code Generation**: Automatically generates a unique QR code encoding the direct public verification URL (`/verify/VX-S21FE-000123`).

### 📱 Employee Mobile QR Scanner (`/scan`)
- **Camera & Manual Scanner**: Scan product QR codes using mobile camera or enter Product ID manually.
- **Stage Action Checkpoint**: Displays current stage and next valid action button ("Confirm Packaging & Seal", "Complete Quality Check", "Dispatch to Logistics", "Confirm Delivery").
- **Condition Checklist**: Select package condition (*Good/Damaged*), seal condition (*Intact/Broken*), accessories check (*Complete/Missing*), report damage details, or request item replacement.
- **No Wallet Required**: Employees use standard JWT authentication without needing MetaMask or Web3 browser wallets.

### 🛡️ Quality Control Workbench (`/quality-check`)
- Inspect packed products prior to dispatch, verify serial numbers and security seals, and record PASS or FAIL quality inspection logs.

### 🚚 Logistics & Shipment Tracking (`/shipments`)
- Active tracking hub for dispatches, courier tracking numbers (`TRK-VX-889021`), and regional transport hub scan checkpoints.

### 🚨 Damage & Replacement Management (`/issues`)
- Log reported box damages, broken seals, missing items, or replacement requests (`OPEN`, `UNDER_REVIEW`, `RESOLVED`).
- Bi-directional physical replacement: damaged items are retired (`REPLACED`) and fresh physical units are issued (`replacementFor` / `replacedBy`) with a new QR code.

### 📜 Global Audit Trail (`/history`)
- Complete searchable history log of every employee scan event across all physical products in the enterprise system, including SHA-256 event hashes and persistent blockchain audit proofs (`BlockchainRecord`).

### 🔍 Public Customer Product Verification (`/verify/:productId`)
- Public verification page accessible **without an account** showing:
  - **✓ AUTHENTIC PRODUCT VERIFIED**: Visual indicator with cryptographic SHA-256 hash validation match.
  - **Product Identity**: Model, Serial Number, Internal Product ID, and Current Lifecycle Stage.
  - **Clean Product Journey Timeline**: Displays public lifecycle milestones while sanitizing internal employee PII and customer addresses.

---

## 3. Comprehensive End-to-End Audit Results

A live end-to-end audit test executed against Vercel Production returned 100% clean passes:

```text
=== VERIFYX COMPLETE END-TO-END AUDIT & FUNCTIONAL TEST ===

✓ STEP 1 — Register Incoming Order: true (Internal ID: ORD-AMZ-8335635, External ID: AMZ-8335635)
✓ STEP 2 & 3 — Assign Product & Generate QR: true (Product ID: VX-SAMSU-878513, Stage: QR_GENERATED)
✓ STEP 4 — Packing Scan: true (Stage: PACKED)
✓ STEP 5 — Quality Check Scan: true (Stage: QUALITY_CHECK)
✓ STEP 6 — Invalid Stage Jump Rejection: true (Rejected with HTTP 400)
✓ STEP 7 — Dispatched Scan: true (Stage: DISPATCHED)
✓ STEP 8 — In Transit Checkpoint: true (Stage: IN_TRANSIT)
✓ STEP 9 — Delivery Scan: true (Stage: DELIVERED)
✓ STEP 10 — Public QR Verification: true (Authentic Status: AUTHENTIC, 8 Scans Events Recorded)

=== ALL 34 AUDIT & FUNCTIONAL CRITERIA VERIFIED 100% CLEAN ===
```

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS + Tailwind CSS, Lucide Icons, HTML5-QRCode, QRCode generator.
- **Backend**: Node.js, Express.js REST API, Vercel Serverless Functions, JWT, bcryptjs, Crypto (SHA-256).
- **Database**: MongoDB Atlas & Mongoose ODM.
- **Audit Layer**: SHA-256 Event Hashing & Solidity Smart Contract audit records.

---

## 5. Role-Based Demo Logins

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@verimark.io` | `password123` | Full enterprise control & user management |
| **Warehouse Operator** | `warehouse@verimark.io` | `password123` | Order registration, product assignment & packaging scans |
| **QC Inspector** | `qc@verimark.io` | `password123` | Quality checks, seal inspection & damage logging |
| **Logistics Manager** | `logistics@verimark.io` | `password123` | Dispatches, courier tracking & transit hub updates |
| **Delivery Agent** | `delivery@verimark.io` | `password123` | Final delivery confirmation scans |
| **Customer** | `customer@gmail.com` | `password123` | Product verification & journey lookup |

---

## 6. Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or MongoDB Atlas)

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
```

### 3. Seed Enterprise Product Lifecycle Demo Data
```bash
npm run seed
```

### 4. Run Application
```bash
# Terminal 1: Backend API (Port 5000)
npm run server

# Terminal 2: Frontend Client (Port 5173)
npm run client
```

Access locally at `http://localhost:5173`.

---

## 7. Live Deployment

The system is deployed and active on Vercel Production:
👉 **[https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)**

---

## 8. License

Distributed under the MIT License. See `LICENSE` for more information.
