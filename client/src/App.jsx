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
import VerificationHistoryPage from "./pages/VerificationHistoryPage";
import BlockchainDetailPage from "./pages/BlockchainDetailPage";
import ProfilePage from "./pages/ProfilePage";

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
              <Route path="/verification-history" element={<VerificationHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
