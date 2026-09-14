import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

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
              {/* Public Pages */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-product" element={<VerifyPage />} />
              <Route path="/verify/:productId" element={<VerificationResultPage />} />

              {/* Protected Digital Asset Authentication Core Modules */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/assets" element={<ProtectedRoute><AssetsPage /></ProtectedRoute>} />
              <Route path="/assets/register" element={<ProtectedRoute><RegisterAssetPage /></ProtectedRoute>} />
              <Route path="/register-asset" element={<ProtectedRoute><RegisterAssetPage /></ProtectedRoute>} />
              <Route path="/assets/:id" element={<ProtectedRoute><AssetDetailPage /></ProtectedRoute>} />
              <Route path="/blockchain/:id" element={<ProtectedRoute><BlockchainDetailPage /></ProtectedRoute>} />
              <Route path="/verify" element={<ProtectedRoute><VerifyAssetPage /></ProtectedRoute>} />
              <Route path="/verify-asset" element={<ProtectedRoute><VerifyAssetPage /></ProtectedRoute>} />
              <Route path="/verification-history" element={<ProtectedRoute><VerificationHistoryPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

              {/* Protected Supply Chain Modules & Administration */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/manufacturer-dashboard" element={<ProtectedRoute><ManufacturerDashboard /></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
              <Route path="/register-product" element={<ProtectedRoute><RegisterProductPage /></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProtectedRoute><ProductDetailsPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              <Route path="/orders/create" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              <Route path="/scan" element={<ProtectedRoute><ScanPage /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
              <Route path="/issues" element={<ProtectedRoute><IssuesPage /></ProtectedRoute>} />
              <Route path="/shipments" element={<ProtectedRoute><ShipmentsPage /></ProtectedRoute>} />
              <Route path="/quality-check" element={<ProtectedRoute><QualityCheckPage /></ProtectedRoute>} />
              <Route path="/qr/:id" element={<ProtectedRoute><QRCodeViewPage /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
