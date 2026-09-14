import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AssetsPage from "./pages/AssetsPage";
import RegisterAssetPage from "./pages/RegisterAssetPage";
import AssetDetailPage from "./pages/AssetDetailPage";
import VerifyAssetPage from "./pages/VerifyAssetPage";
import VerifyPage from "./pages/VerifyPage";
import VerificationResultPage from "./pages/VerificationResultPage";
import VerificationHistoryPage from "./pages/VerificationHistoryPage";
import BlockchainDetailPage from "./pages/BlockchainDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import RegisterProductPage from "./pages/RegisterProductPage";
import ScanPage from "./pages/ScanPage";
import HistoryPage from "./pages/HistoryPage";
import IssuesPage from "./pages/IssuesPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import QualityCheckPage from "./pages/QualityCheckPage";
import QRCodeViewPage from "./pages/QRCodeViewPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between bg-[#05070D] text-slate-100 font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Landing & Authentication */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Digital Asset Authentication Core Modules */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/assets/register" element={<RegisterAssetPage />} />
              <Route path="/assets/:id" element={<AssetDetailPage />} />
              <Route path="/blockchain/:id" element={<BlockchainDetailPage />} />
              <Route path="/verify" element={<VerifyAssetPage />} />
              <Route path="/verify-asset" element={<VerifyAssetPage />} />
              <Route path="/verify-product" element={<VerifyPage />} />
              <Route path="/verify/:productId" element={<VerificationResultPage />} />
              <Route path="/verification-history" element={<VerificationHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Product Authentication & Supply Chain Lifecycle */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/register-product" element={<RegisterProductPage />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/create" element={<CreateOrderPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/shipments" element={<ShipmentsPage />} />
              <Route path="/quality-check" element={<QualityCheckPage />} />
              <Route path="/qr/:id" element={<QRCodeViewPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
