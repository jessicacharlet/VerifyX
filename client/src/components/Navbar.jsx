import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileCheck,
  Plus,
  Search,
  History,
  UserCheck,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/assets") {
      return location.pathname === "/assets";
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#070B14]/95 backdrop-blur-md border-b border-[#22304A] h-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-[#070B14] shadow-sm shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-white tracking-tight">VerifyX</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#111A2A] text-[#94A3B8] border border-[#22304A]">
                Authenticator
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1.5 text-xs font-medium">
            <Link
              to="/dashboard"
              className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive("/dashboard")
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#111A2A]"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
              {isActive("/dashboard") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            <Link
              to="/assets"
              className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive("/assets")
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#111A2A]"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Assets</span>
              {isActive("/assets") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            <Link
              to="/assets/register"
              className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive("/assets/register")
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#111A2A]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Asset</span>
              {isActive("/assets/register") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            <Link
              to="/verify"
              className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive("/verify")
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#111A2A]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Verify Asset</span>
              {isActive("/verify") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>

            <Link
              to="/verification-history"
              className={`relative px-3.5 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isActive("/verification-history")
                  ? "text-sky-400 bg-sky-500/10 border border-sky-500/30 font-semibold"
                  : "text-[#94A3B8] hover:text-white hover:bg-[#111A2A]"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Verification History</span>
              {isActive("/verification-history") && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-sky-400 rounded-full" />
              )}
            </Link>
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-[#0D1422] px-3.5 py-1.5 rounded-lg border border-[#22304A]">
                <Link to="/profile" className="flex items-center space-x-2 group">
                  <UserCheck className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                  <div className="text-right leading-tight">
                    <div className="text-xs font-semibold text-white group-hover:text-sky-300">{user.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">{user.email}</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#111A2A] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#070B14] bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 transition-all shadow-sm shadow-sky-500/20"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D1422] border-b border-[#22304A] px-4 pt-3 pb-5 space-y-2 text-xs font-sans">
          <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-white hover:bg-[#111A2A]">
            Dashboard
          </Link>
          <Link to="/assets" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-white hover:bg-[#111A2A]">
            Assets
          </Link>
          <Link to="/assets/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-sky-400 hover:bg-[#111A2A]">
            Register Asset
          </Link>
          <Link to="/verify" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-white hover:bg-[#111A2A]">
            Verify Asset
          </Link>
          <Link to="/verification-history" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-[#94A3B8] hover:bg-[#111A2A]">
            Verification History
          </Link>
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg font-medium text-sky-400 hover:bg-[#111A2A]">
            User Profile
          </Link>
        </div>
      )}
    </nav>
  );
}
