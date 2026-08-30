import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Web3Provider } from "./context/Web3Context";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import VerifyPage from "./pages/VerifyPage";
import VerificationResultPage from "./pages/VerificationResultPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import RegisterProductPage from "./pages/RegisterProductPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import QRCodeViewPage from "./pages/QRCodeViewPage";
import AdminDashboard from "./pages/AdminDashboard";

import ScanPage from "./pages/ScanPage";
import OrdersPage from "./pages/OrdersPage";
import CreateOrderPage from "./pages/CreateOrderPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import QualityCheckPage from "./pages/QualityCheckPage";
import ShipmentsPage from "./pages/ShipmentsPage";
import IssuesPage from "./pages/IssuesPage";
import HistoryPage from "./pages/HistoryPage";

export default function App() {
  return (
    <AuthProvider>
      <Web3Provider>
        <Router>
          <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public & Customer Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/verify" element={<VerifyPage />} />
                <Route path="/verify/:productId" element={<VerificationResultPage />} />
                <Route path="/track/:productId" element={<VerificationResultPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Enterprise Operational Routes */}
                <Route path="/dashboard" element={<ManufacturerDashboard />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/create" element={<CreateOrderPage />} />
                <Route path="/orders/:id" element={<OrderDetailPage />} />
                <Route path="/scan" element={<ScanPage />} />
                <Route path="/quality-check" element={<QualityCheckPage />} />
                <Route path="/shipments" element={<ShipmentsPage />} />
                <Route path="/issues" element={<IssuesPage />} />
                <Route path="/history" element={<HistoryPage />} />
                
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailsPage />} />
                <Route path="/products/:id/qr" element={<QRCodeViewPage />} />
                <Route path="/register-product" element={<RegisterProductPage />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Web3Provider>
    </AuthProvider>
  );
}
