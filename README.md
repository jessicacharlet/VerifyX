# VerifyX — Enterprise Supply Chain Tracking & QR Authenticity Verification System

> A production-grade enterprise software platform for tracking physical products throughout their complete supply chain lifecycle — from customer order creation, physical unit assignment, and unique QR printing through packaging, quality control, dispatch, transit hubs, and final delivery.

🌐 **Live Production Deployment**: [https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)

---

## 1. Problem Statement & Core Concept

In modern global commerce, companies face massive challenges in supply chain visibility, counterfeit intrusion, box tampering, and damage tracking. Standard barcodes represent entire product lines, making it impossible to track individual physical boxes.

**VerifyX** enforces an individual item tracking model:
$$\text{ONE PHYSICAL ITEM} \rightarrow \text{ONE UNIQUE PRODUCT ID} \rightarrow \text{ONE UNIQUE QR} \rightarrow \text{STRICT LIFECYCLE AUDIT TRAIL}$$

### 8-Stage Strict Lifecycle Progression
```
[1] ORDER_RECEIVED ➔ [2] PRODUCT_ASSIGNED ➔ [3] QR_GENERATED ➔ [4] PACKED
        ▲
        └────── ➔ [5] QUALITY_CHECK ➔ [6] DISPATCHED ➔ [7] IN_TRANSIT ➔ [8] DELIVERED
```
*Note: Random stage jumps are strictly prevented by the system.*

---

## 2. Key Modules & Features

### 🏢 Company Operational Dashboard (`/dashboard`)
- **Real-Time Database Statistics**: Tracks total sales orders, processing items, packed boxes, dispatches, in-transit hub scans, deliveries, and reported damage issues.
- **Audit Streams**: Live stream of recent employee scan events and customer order activities.

### 📦 Customer Order & Product Assignment (`/orders`, `/orders/:id`, `/orders/create`)
- **Order Creation**: Create customer sales orders with contact, delivery address, product model, and expected delivery date.
- **Physical Product Assignment**: Assign an individual physical unit (e.g. `Samsung Galaxy S21 FE`, Product ID: `VX-S21FE-000123`, Serial No: `SN-S21FE-928374`) to an order.
- **Unique QR Code Generation**: Automatically generates a unique QR code encoding the direct public verification URL (`/verify/VX-S21FE-000123`).

### 📱 Employee Mobile QR Scanner (`/scan`)
- **Camera & Manual Scanner**: Scan product QR codes using mobile camera or enter Product ID manually.
- **Stage Action Checkpoint**: Displays current stage, next allowed stage button (e.g., "Confirm Packaging & Seal", "Complete Quality Check", "Dispatch to Logistics", "Confirm Delivery").
- **Condition Checklist**: Select package condition (*Good/Damaged*), seal condition (*Intact/Broken*), accessories check (*Complete/Missing*), report damage details, or request item replacement.

### 🛡️ Quality Control Workbench (`/quality-check`)
- Inspect packed products prior to dispatch, verify serial numbers and security seals, and record PASS or FAIL quality inspection logs.

### 🚚 Logistics & Shipment Tracking (`/shipments`)
- Active tracking hub for dispatches, courier tracking numbers (`TRK-VX-889021`), and regional transport hub scan checkpoints.

### 🚨 Damage & Issue Management (`/issues`)
- Log reported box damages, broken seals, missing items, or replacement requests (`OPEN`, `UNDER_REVIEW`, `RESOLVED`). Damages and authenticity remain separate concepts to prevent false counterfeit alerts.

### 📜 Global Audit Trail (`/history`)
- Complete searchable history log of every employee scan event across all physical products in the enterprise system.

### 🔍 Public Customer Verification & Journey (`/verify/:productId` & `/track/:productId`)
- Public page accessible **without an account** showing:
  - **✓ AUTHENTIC PRODUCT VERIFIED**: Visual indicator with cryptographic SHA-256 hash validation match.
  - **Product Specifications**: Manufacturer, Model, Serial Number, Order ID, and Current Stage.
  - **Clean Product Journey Timeline**: Displays public stages (`Order Received` ➔ `Packed` ➔ `Quality Checked` ➔ `Dispatched` ➔ `In Transit` ➔ `Delivered`) while sanitizing internal employee PII and customer addresses.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, Vanilla CSS + Tailwind CSS, Lucide Icons, Ethers.js, HTML5-QRCode, QRCode generator.
- **Backend**: Node.js, Express.js REST API, Vercel Serverless Functions, JWT, bcryptjs, Multer, Crypto (SHA-256).
- **Database**: MongoDB Atlas & Mongoose ODM.
- **Blockchain Layer**: Solidity 0.8.24, Hardhat, Ethers.js (Ethereum-compatible audit fingerprinting).

---

## 4. Role-Based Demo Logins

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@verimark.io` | `password123` | Full enterprise control & user management |
| **Warehouse Operator** | `warehouse@verimark.io` | `password123` | Product assignment, QR printing & packaging scans |
| **QC Inspector** | `qc@verimark.io` | `password123` | Quality checks, seal inspection & damage logging |
| **Logistics Manager** | `logistics@verimark.io` | `password123` | Dispatches, courier tracking & transit hub updates |
| **Delivery Agent** | `delivery@verimark.io` | `password123` | Final delivery confirmation scans |
| **Customer** | `customer@gmail.com` | `password123` | Order tracking & product verification |

---

## 5. Quick Start Guide

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

### 3. Seed Enterprise Supply Chain Demo Data
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

## 6. Live Deployment

The system is deployed and active on Vercel Production:
👉 **[https://verify-x-tawny.vercel.app](https://verify-x-tawny.vercel.app)**

---

## 7. License

Distributed under the MIT License. See `LICENSE` for more information.
