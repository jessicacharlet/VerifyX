import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import {
  ShieldCheck,
  Wallet,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  QrCode,
  Lock,
  Package,
  ShoppingBag,
  Truck,
  AlertOctagon,
  Clock,
  ShieldAlert,
} from "lucide-react";

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
                SUPPLY-CHAIN
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 font-mono text-xs">
            <Link
              to="/dashboard"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/dashboard")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/orders"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/orders")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>

            <Link
              to="/scan"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/scan")
                  ? "text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 font-bold"
                  : "text-emerald-400 hover:bg-emerald-950/40"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </Link>

            <Link
              to="/quality-check"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/quality-check")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality Check</span>
            </Link>

            <Link
              to="/shipments"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/shipments")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipments</span>
            </Link>

            <Link
              to="/issues"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/issues")
                  ? "text-red-400 bg-red-950/60 border border-red-500/30 font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Issues</span>
            </Link>

            <Link
              to="/history"
              className={`px-2.5 py-1.5 rounded transition-all flex items-center space-x-1.5 ${
                isActive("/history")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-bold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </Link>
          </div>

          {/* Right Controls: Web3 Wallet & User */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center space-x-2 bg-[#0D121A] hover:bg-[#111821] text-[#F5F7FA] border border-[#1E293B]"
            >
              <span className={`w-2 h-2 rounded-full ${account ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`}></span>
              <Wallet className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className={account ? "text-emerald-400 font-bold" : "text-amber-400"}>
                {account
                  ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : "Wallet Off"}
              </span>
            </button>

            {user ? (
              <div className="flex items-center space-x-2 border-l border-[#1E293B] pl-3">
                <div className="text-right leading-tight font-mono">
                  <div className="text-xs font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded text-xs font-mono text-cyan-400 bg-[#111821] border border-[#1E293B]"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#94A3B8] hover:text-white rounded focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D121A] border-b border-[#1E293B] px-4 pt-3 pb-5 space-y-2 text-xs font-mono">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-white bg-[#111821]">
            Dashboard
          </Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-white hover:bg-[#111821]">
            Orders
          </Link>
          <Link to="/scan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-emerald-400 font-bold bg-emerald-950/80">
            Scan Product QR
          </Link>
          <Link to="/quality-check" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-white hover:bg-[#111821]">
            Quality Check
          </Link>
          <Link to="/shipments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-white hover:bg-[#111821]">
            Shipments
          </Link>
          <Link to="/issues" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-red-400 hover:bg-[#111821]">
            Issues Queue
          </Link>
          <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded text-white hover:bg-[#111821]">
            Audit Trail
          </Link>
        </div>
      )}
    </nav>
  );
}
