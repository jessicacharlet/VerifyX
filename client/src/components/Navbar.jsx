import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { ShieldCheck, Wallet, LogOut, Menu, X, LayoutDashboard, QrCode, Lock, History, Package } from "lucide-react";

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

  return (
    <nav className="sticky top-0 z-50 bg-[#05070D]/90 backdrop-blur-md border-b border-[#1D2938]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-md bg-[#06b6d4] flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform text-[#05070D]">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold text-white tracking-tight">VerifyX</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive("/")
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold"
                  : "text-[#8B98AA] hover:text-white hover:bg-[#0B111B]"
              }`}
            >
              Home
            </Link>

            <Link
              to="/products"
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                isActive("/products")
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold"
                  : "text-[#8B98AA] hover:text-white hover:bg-[#0B111B]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>

            <Link
              to="/verify"
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                isActive("/verify")
                  ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold"
                  : "text-[#8B98AA] hover:text-white hover:bg-[#0B111B]"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>

            <Link
              to="/verify"
              className="px-3 py-2 rounded-md text-[#8B98AA] hover:text-white hover:bg-[#0B111B] transition-colors flex items-center space-x-1.5"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>

            {user && (user.role === "manufacturer" || user.role === "admin") && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1.5 ${
                  isActive("/dashboard")
                    ? "text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 font-semibold"
                    : "text-[#8B98AA] hover:text-white hover:bg-[#0B111B]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-md text-blue-400 bg-blue-950/40 border border-blue-500/30 transition-colors flex items-center space-x-1.5 font-semibold"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Action Controls: Web3 Wallet & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wallet Status Badge (Yellow/Orange = Disconnected; Green = Connected) */}
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-3 py-1.5 rounded-md text-xs font-mono font-medium flex items-center space-x-2 bg-[#0B111B] hover:bg-[#101722] text-slate-200 border border-[#1D2938] transition-all"
              title={account ? `Connected Wallet: ${account}` : "Connect Wallet"}
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
              <Wallet className="w-3.5 h-3.5 text-[#8B98AA]" />
              <span className={account ? "text-emerald-400 font-bold" : "text-amber-400"}>
                {account
                  ? `● ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : isConnecting
                  ? "Connecting..."
                  : "Wallet Disconnected"}
              </span>
            </button>

            {/* Auth User */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-[#1D2938] pl-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-100">{user.name}</div>
                  <div className="text-[9px] text-cyan-400 font-mono uppercase font-bold">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#8B98AA] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#8B98AA] hover:text-white hover:bg-[#0B111B] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-[#8B98AA] hover:text-white hover:bg-[#0B111B] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Primary Action Button (CYAN / TEAL) */}
            <Link
              to="/verify"
              className="px-4 py-1.5 rounded-md text-xs font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-sm shadow-cyan-500/20 transition-all border border-cyan-400/40"
            >
              Verify Product
            </Link>
          </div>

          {/* Mobile Toggler */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#8B98AA] hover:text-white rounded-md focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B111B] border-b border-[#1D2938] px-4 pt-2 pb-4 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#101722]"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#101722]"
          >
            Products
          </Link>
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-500/30"
          >
            Verify Product
          </Link>

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#101722]"
            >
              Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-[#1D2938] flex flex-col space-y-2">
            <button
              onClick={connectWallet}
              className="w-full py-2 px-3 rounded-md bg-[#101722] border border-[#1D2938] text-slate-200 font-mono text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-500" : "bg-amber-400"}`}></span>
              <span className={account ? "text-emerald-400" : "text-amber-400"}>
                {account ? `● ${account.substring(0, 8)}...` : "Wallet Disconnected"}
              </span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 text-center font-medium text-red-400 bg-red-500/10 rounded-md"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-[#101722] text-slate-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-[#06b6d4] text-[#05070D] font-bold"
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
