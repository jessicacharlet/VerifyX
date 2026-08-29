import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { ShieldCheck, Wallet, LogOut, Menu, X, LayoutDashboard, QrCode, Lock, Package } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { account, connectWallet, isConnecting } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToHowItWorks = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("how-it-works");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById("how-it-works");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#070A0F]/95 backdrop-blur border-b border-[#1E293B] h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-[#070A0F] shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-white tracking-tight">VERIFYX</span>
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#111821] text-[#94A3B8] border border-[#1E293B]">
                PROD-AUTH
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-md transition-all ${
                isActive("/")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/products")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>

            <Link
              to="/verify"
              className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/verify")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>

            <button
              onClick={scrollToHowItWorks}
              className="px-3 py-1.5 rounded-md text-[#94A3B8] hover:text-white hover:bg-[#0D121A] transition-all"
            >
              How It Works
            </button>

            {user && (user.role === "manufacturer" || user.role === "admin") && (
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-md transition-all flex items-center space-x-1.5 ${
                  isActive("/dashboard")
                    ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-1.5 rounded-md text-blue-400 bg-blue-950/40 border border-blue-500/30 transition-all flex items-center space-x-1.5 font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Governance</span>
              </Link>
            )}
          </div>

          {/* Right Controls: Web3 Wallet & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wallet Status Badge */}
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center space-x-2 bg-[#0D121A] hover:bg-[#111821] text-[#F5F7FA] border border-[#1E293B] transition-colors"
              title={account ? `Connected: ${account}` : "Connect MetaMask Wallet"}
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
              <Wallet className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className={account ? "text-emerald-400 font-bold" : "text-amber-400"}>
                {account
                  ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : isConnecting
                  ? "Connecting..."
                  : "Wallet Disconnected"}
              </span>
            </button>

            {/* Auth User Profile */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-[#1E293B] pl-3">
                <div className="text-right leading-tight">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#0D121A] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#0D121A] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Primary Action Button */}
            <Link
              to="/verify"
              className="px-4 py-1.5 rounded-md text-xs font-bold text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 transition-colors border border-cyan-300/40 shadow-sm shadow-cyan-500/20"
            >
              Verify an Asset
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#94A3B8] hover:text-white rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D121A] border-b border-[#1E293B] px-4 pt-3 pb-5 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]"
          >
            Products
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-cyan-400 bg-[#111821] border border-[#1E293B]"
          >
            Verify Asset
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              scrollToHowItWorks();
            }}
            className="w-full text-left px-3 py-2 rounded-md font-medium text-[#94A3B8] hover:bg-[#111821]"
          >
            How It Works
          </button>

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]"
            >
              Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-[#1E293B] flex flex-col space-y-2">
            <button
              onClick={connectWallet}
              className="w-full py-2 px-3 rounded-md bg-[#111821] border border-[#1E293B] text-white font-mono text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              <span className={account ? "text-emerald-400" : "text-amber-400"}>
                {account ? `${account.substring(0, 8)}...` : "Wallet Disconnected"}
              </span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 text-center font-medium text-red-400 bg-red-500/10 rounded-md"
              >
                Sign out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-[#111821] text-white font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-cyan-400 text-[#070A0F] font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
