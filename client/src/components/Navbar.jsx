import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { Shield, Wallet, LogOut, Menu, X, PlusCircle, LayoutDashboard, QrCode, Lock, History, Package } from "lucide-react";

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
    <nav className="sticky top-0 z-50 bg-[#050816]/90 backdrop-blur-md border-b border-[#1E2A47]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-md shadow-purple-600/30 border border-purple-400/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold text-white tracking-tight">VeriMark</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-purple-950/60 text-purple-400 border border-purple-500/30">
                v1.0
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "text-purple-400 bg-purple-500/10 border border-purple-500/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-[#0A1020]"
              }`}
            >
              Home
            </Link>

            {user && (user.role === "manufacturer" || user.role === "admin") && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  isActive("/dashboard")
                    ? "text-purple-400 bg-purple-500/10 border border-purple-500/30 font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-[#0A1020]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}

            <Link
              to="/products"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                isActive("/products")
                  ? "text-purple-400 bg-purple-500/10 border border-purple-500/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-[#0A1020]"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products</span>
            </Link>

            <Link
              to="/verify"
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                isActive("/verify")
                  ? "text-purple-400 bg-purple-500/10 border border-purple-500/30 font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-[#0A1020]"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>

            <Link
              to="/verify"
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0A1020] transition-colors flex items-center space-x-1.5"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </Link>

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1.5 ${
                  isActive("/admin")
                    ? "text-cyan-400 bg-cyan-950/40 border border-cyan-500/40 font-semibold"
                    : "text-cyan-400/80 hover:text-cyan-300 hover:bg-[#0A1020]"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Action Controls: Web3 Wallet & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wallet Status Badge (Connected = Green dot only; Disconnected = Amber/Muted) */}
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center space-x-2 bg-[#0A1020] hover:bg-[#0D1528] text-slate-200 border border-[#1E2A47] transition-all"
              title={account ? `Connected Wallet: ${account}` : "Connect Wallet"}
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {account
                  ? `● ${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : isConnecting
                  ? "Connecting..."
                  : "Wallet Disconnected"}
              </span>
            </button>

            {/* Auth User Profile */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-[#1E2A47] pl-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-100">{user.name}</div>
                  <div className="text-[9px] text-purple-400 font-mono uppercase font-bold">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0A1020] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#0A1020] transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Primary Action Button */}
            <Link
              to="/verify"
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 border border-purple-400/30 transition-all"
            >
              Verify Product
            </Link>
          </div>

          {/* Mobile Menu Toggler */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1020] border-b border-[#1E2A47] px-4 pt-2 pb-4 space-y-2 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#0D1528]"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#0D1528]"
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-slate-200 hover:bg-[#0D1528]"
          >
            Products
          </Link>

          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-medium text-purple-400 bg-purple-950/30 border border-purple-500/30"
          >
            Verify Product
          </Link>

          <div className="pt-3 border-t border-[#1E2A47] flex flex-col space-y-2">
            <button
              onClick={connectWallet}
              className="w-full py-2 px-3 rounded-md bg-[#0D1528] border border-[#1E2A47] text-slate-200 font-mono text-xs font-semibold flex items-center justify-center space-x-2"
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-400" : "bg-amber-400"}`}></span>
              <span>{account ? `● ${account.substring(0, 8)}...` : "Connect Wallet"}</span>
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
                  className="text-center py-2 rounded-md bg-[#0D1528] text-slate-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-purple-600 text-white font-semibold"
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
