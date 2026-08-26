import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWeb3 } from "../context/Web3Context";
import { ShieldCheck, Wallet, User, LogOut, Menu, X, PlusCircle, LayoutDashboard, QrCode, Lock } from "lucide-react";

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
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400">
                VeriMark
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Blockchain Secured
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/verify"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                isActive("/verify")
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Verify Product</span>
            </Link>

            {user && (user.role === "manufacturer" || user.role === "admin") && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive("/dashboard")
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/register-product"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive("/register-product")
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Product</span>
                </Link>

                <Link
                  to="/products"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/products")
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  Catalog
                </Link>
              </>
            )}

            {user && user.role === "admin" && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                  isActive("/admin")
                    ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                    : "text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          {/* Right Action Controls: Web3 Wallet & Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* MetaMask Wallet Connection Button */}
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 border transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-blue-500/50"
              title={account ? `Connected Wallet: ${account}` : "Connect Ethereum Wallet"}
            >
              <Wallet className={`w-4 h-4 ${account ? "text-emerald-400" : "text-amber-400"}`} />
              <span>
                {account
                  ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                  : isConnecting
                  ? "Connecting..."
                  : "Connect Wallet"}
              </span>
            </button>

            {/* Auth State Dropdown / Login Button */}
            {user ? (
              <div className="flex items-center space-x-2 border-l border-slate-800 pl-3">
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-200 capitalize">{user.name}</div>
                  <div className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
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
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Verify Product
          </Link>
          {user && (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/register-product"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Register Product
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Product Catalog
              </Link>
            </>
          )}

          {user && user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 bg-purple-950/30"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={connectWallet}
              className="w-full py-2 px-3 rounded-md bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>{account ? `${account.substring(0, 8)}...` : "Connect Wallet"}</span>
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 text-center text-sm text-red-400 bg-red-500/10 rounded-md"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-slate-800 text-slate-200 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-md bg-blue-600 text-white font-medium text-sm"
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
