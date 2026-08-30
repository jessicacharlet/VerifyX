import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  QrCode,
  Package,
  ShoppingBag,
  Truck,
  AlertOctagon,
  Clock,
  UserCheck,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#070A0F]/95 backdrop-blur border-b border-[#1E293B] h-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-[#070A0F] shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-semibold text-white tracking-tight">VerifyX</span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#111821] text-[#94A3B8] border border-[#1E293B]">
                Product Lifecycle
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1 text-xs font-medium">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/dashboard")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/orders"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/orders")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders</span>
            </Link>

            <Link
              to="/scan"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/scan")
                  ? "text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 font-semibold"
                  : "text-emerald-400 hover:bg-emerald-950/40"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </Link>

            <Link
              to="/quality-check"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/quality-check")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quality Check</span>
            </Link>

            <Link
              to="/shipments"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/shipments")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Shipments</span>
            </Link>

            <Link
              to="/issues"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/issues")
                  ? "text-red-400 bg-red-950/60 border border-red-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Issues</span>
            </Link>

            <Link
              to="/history"
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1.5 ${
                isActive("/history")
                  ? "text-cyan-400 bg-[#111821] border border-[#1E293B] font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#0D121A]"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </Link>
          </div>

          {/* Right Controls: User Info & Sign Out */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-[#0D121A] px-3.5 py-1.5 rounded-lg border border-[#1E293B]">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <div className="text-right leading-tight">
                  <div className="text-xs font-semibold text-white">{user.name}</div>
                  <div className="text-[11px] text-cyan-400 capitalize">{user.role}</div>
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
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-xs font-medium text-cyan-400 bg-[#111821] border border-[#1E293B] hover:bg-[#1A2333]"
              >
                Employee Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-2">
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
        <div className="lg:hidden bg-[#0D121A] border-b border-[#1E293B] px-4 pt-3 pb-5 space-y-2 text-xs font-sans">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-white bg-[#111821]">
            Dashboard
          </Link>
          <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]">
            Orders
          </Link>
          <Link to="/scan" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-semibold text-emerald-400 bg-emerald-950/80">
            Scan Product QR
          </Link>
          <Link to="/quality-check" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]">
            Quality Check
          </Link>
          <Link to="/shipments" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]">
            Shipments
          </Link>
          <Link to="/issues" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-red-400 hover:bg-[#111821]">
            Issues Queue
          </Link>
          <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-md font-medium text-white hover:bg-[#111821]">
            Audit Trail
          </Link>
        </div>
      )}
    </nav>
  );
}
