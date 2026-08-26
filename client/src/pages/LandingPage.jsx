import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  QrCode,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code,
  Search,
  Camera,
  Sparkles,
  PlusCircle,
} from "lucide-react";
import QRScannerModal from "../components/QRScannerModal";

export default function LandingPage() {
  const [quickInput, setQuickInput] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate(`/verify/${encodeURIComponent(quickInput.trim())}`);
  };

  const handleQRScanned = (scannedCode) => {
    let cleanCode = scannedCode.trim();
    if (cleanCode.includes("/verify/")) {
      cleanCode = cleanCode.split("/verify/")[1].split("?")[0];
    }
    navigate(`/verify/${encodeURIComponent(cleanCode)}`);
  };

  const handleDemoClick = (sampleId) => {
    navigate(`/verify/${sampleId}`);
  };

  return (
    <div className="space-y-12 pb-12">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold">
              <Code className="w-3.5 h-3.5" />
              <span>BLOCKCHAIN-BASED PRODUCT AUTHENTICATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Verify What’s Real. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                Trust What’s Verified.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              VeriMark is a blockchain-based product authentication system that uses SHA-256 cryptographic hashing and QR verification to help detect counterfeit and tampered products.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2.5 sm:space-y-0 sm:space-x-3.5 pt-2">
              <Link
                to="/verify"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Verify a Product</span>
              </Link>

              <Link
                to="/register-product"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center space-x-2 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Register Product</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Technical Working Visual */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-5 border border-purple-500/20 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">STATUS: ON-CHAIN VERIFIED</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                  PROD-AP-9901
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">1. Product Identity</span>
                  <span className="text-slate-200 font-bold text-[11px]">AirPods Pro (2nd Gen)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/30 flex items-center justify-between">
                  <span className="text-purple-400 text-[11px]">2. SHA-256 Hash</span>
                  <span className="text-purple-300 font-mono text-[10px] truncate max-w-[170px]">
                    e3b0c44298fc...b855
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                  <span className="text-indigo-400 text-[11px]">3. Smart Contract</span>
                  <span className="text-indigo-300 text-[10px]">ProductAuthenticity.sol</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
                  <span className="text-cyan-400 text-[11px]">4. Verification Route</span>
                  <span className="text-cyan-300 text-[10px]">/verify/PROD-AP-9901</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">✓ AUTHENTIC PRODUCT</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* WORKING MODEL: VERIFICATION PORTAL */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white flex items-center space-x-2">
              <Shield className="w-6 h-6 text-purple-400" />
              <span>Working Verification Portal</span>
            </h2>
            <p className="text-xs text-slate-400">
              Query on-chain smart contract records and verify SHA-256 hash signatures in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input & Action Controls */}
            <form onSubmit={handleQuickVerify} className="md:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
                  Enter Product ID or Serial Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="e.g. PROD-AP-9901"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono uppercase focus:outline-none focus:border-purple-500"
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors shadow-md shadow-purple-600/20"
                  >
                    Verify Product
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-500 font-mono">OR</span>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold inline-flex items-center space-x-2 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-purple-400" />
                  <span>Scan QR Code</span>
                </button>
              </div>
            </form>

            {/* Verification Result State Cards */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>✓ AUTHENTIC PRODUCT — Hash Match 100%</span>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center space-x-2 text-xs text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>⚠ PRODUCT NOT AUTHENTIC — Hash Mismatch / Unregistered</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Verification Buttons */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Interactive Model Verification Shortcuts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick("PROD-AP-9901")}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                  <span>Authentic Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
                <div className="text-[10px] font-mono text-slate-500">PROD-AP-9901</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-SG-8820")}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
                  <span>Authentic Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Galaxy S25 Ultra</div>
                <div className="text-[10px] font-mono text-slate-500">PROD-SG-8820</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-FAKE-0000")}
                className="p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-left transition-colors group"
              >
                <div className="text-xs font-bold text-red-400 group-hover:text-red-300 flex items-center justify-between">
                  <span>Counterfeit Sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Non-Existent / Tampered</div>
                <div className="text-[10px] font-mono text-slate-500">PROD-FAKE-0000</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QR Scanner Camera Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
