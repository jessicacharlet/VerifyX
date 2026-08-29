import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  QrCode,
  Lock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code,
  Search,
  Camera,
  PlusCircle,
  Cpu,
  FileText,
  BrainCircuit,
  Fingerprint,
  UploadCloud,
  Check,
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
    <div className="space-y-16 pb-16 bg-[#070A0F] bg-grid-pattern">
      {/* 1. HERO SECTION */}
      <section className="pt-10 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D121A] border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium shadow-sm shadow-cyan-500/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Digital Authenticity & Verification Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              VERIFYX <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
                Cryptographic Proof of Real Assets
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Verify digital assets and detect suspicious modifications using blockchain-backed verification and AI-powered analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/verify"
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-xs text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 transition-all border border-cyan-300/40 shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Verify an Asset</span>
              </Link>

              <Link
                to="/register-product"
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-medium text-xs text-white bg-[#0D121A] hover:bg-[#111821] border border-[#1E293B] flex items-center justify-center space-x-2 transition-all hover:border-slate-600"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Register Product</span>
              </Link>
            </div>

            {/* Quick Metrics Badge */}
            <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs font-mono text-[#64748B]">
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>SHA-256 Hash Matching</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ethereum Ledger</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Forgery Detection</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Security Status Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0D121A] rounded-xl p-6 border border-[#1E293B] shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">AUTHENTIC RECORD VERIFIED</span>
                </div>
                <span className="text-[10px] font-mono text-[#94A3B8] bg-[#111821] px-2 py-0.5 rounded border border-[#1E293B]">
                  PROD-AP-9901
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between">
                  <span className="text-[#94A3B8] text-[11px] flex items-center space-x-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Product Identity</span>
                  </span>
                  <span className="text-white font-bold text-[11px]">AirPods Pro (2nd Gen)</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between">
                  <span className="text-[#94A3B8] text-[11px] flex items-center space-x-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SHA-256 Hash</span>
                  </span>
                  <span className="text-cyan-300 font-mono text-[10px] truncate max-w-[150px]">
                    e3b0c44298fc1c14...
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between">
                  <span className="text-[#94A3B8] text-[11px] flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Smart Contract</span>
                  </span>
                  <span className="text-blue-400 text-[10px]">ProductAuthenticity.sol</span>
                </div>

                <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between">
                  <span className="text-[#94A3B8] text-[11px] flex items-center space-x-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
                    <span>AI Forensic Analysis</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">No modification (12%)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">✓ 100% Cryptographic Match</span>
                </div>
                <span className="text-[10px] text-[#94A3B8] font-mono">Immutable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VERIFICATION PORTAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white flex items-center space-x-2 tracking-tight">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Verification Portal</span>
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Instant multi-method public verification against on-chain smart contract ledger & AI forgery engine.
              </p>
            </div>

            <span className="text-[11px] font-mono text-cyan-400 bg-[#111821] px-3 py-1 rounded-md border border-[#1E293B] self-start sm:self-auto">
              Public Lookup • No Login Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input & Search Form */}
            <form onSubmit={handleQuickVerify} className="md:col-span-7 space-y-4">
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-medium text-slate-300 uppercase tracking-wider block">
                  Enter Product ID, Serial Number, or QR Route
                </label>
                <div className="flex gap-2.5">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="e.g. PROD-AP-9901 or SN-AP-98213890"
                      className="w-full px-4 py-3 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs font-mono uppercase placeholder-[#64748B] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                    <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs shrink-0 transition-all border border-cyan-300/40 shadow-sm shadow-cyan-500/20"
                  >
                    Verify Asset
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#64748B] font-mono text-[11px]">Alternate Input Method:</span>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] font-medium inline-flex items-center space-x-2 transition-all"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scan QR Label / Upload Image</span>
                </button>
              </div>
            </form>

            {/* Verification Status Previews */}
            <div className="md:col-span-5 space-y-2.5 text-xs">
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 font-medium">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <div>
                  <div className="font-bold text-xs">✓ AUTHENTIC PRODUCT</div>
                  <div className="text-[10px] text-[#94A3B8] font-mono">100% On-Chain Hash & SHA-256 Signature Match</div>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center space-x-3 text-red-400 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <div>
                  <div className="font-bold text-xs">⚠ UNVERIFIED / SUSPICIOUS</div>
                  <div className="text-[10px] text-[#94A3B8] font-mono">Unregistered Serial, Recalled Status, or Image Anomaly</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Shortcuts */}
          <div className="pt-4 border-t border-[#1E293B] space-y-3">
            <div className="text-xs font-mono font-semibold text-slate-300">
              Try Interactive Verification Samples:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick("PROD-AP-9901")}
                className="p-3.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Authentic Sample</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">ID: PROD-AP-9901</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-SG-8820")}
                className="p-3.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Authentic Sample</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Galaxy S25 Ultra</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">ID: PROD-SG-8820</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-FAKE-0000")}
                className="p-3.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
              >
                <div className="text-xs font-bold text-red-400 flex items-center justify-between">
                  <span>Counterfeit Sample</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Unregistered / Tampered</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">ID: PROD-FAKE-0000</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION (Item 19 requirement) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-mono font-bold text-cyan-400 bg-[#0D121A] px-3 py-1 rounded-full border border-cyan-500/30">
            SYSTEM WORKFLOW
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How VerifyX Ensures Authenticity
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mx-auto">
            A 4-stage cryptographic and artificial intelligence verification architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 01 */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-2xl font-mono font-bold text-cyan-400">01</div>
            <div className="w-10 h-10 rounded-lg bg-[#111821] text-cyan-400 border border-[#1E293B] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Upload / Scan</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Scan the product QR code label or input the serial number / Product ID into the verification portal.
            </p>
          </div>

          {/* Step 02 */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-2xl font-mono font-bold text-cyan-400">02</div>
            <div className="w-10 h-10 rounded-lg bg-[#111821] text-cyan-400 border border-[#1E293B] flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">SHA-256 Hashing</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              The platform recomputes the 64-character SHA-256 digital fingerprint from product metadata specs.
            </p>
          </div>

          {/* Step 03 */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-2xl font-mono font-bold text-cyan-400">03</div>
            <div className="w-10 h-10 rounded-lg bg-[#111821] text-cyan-400 border border-[#1E293B] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">On-Chain Verify</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Query the Ethereum smart contract (`ProductAuthenticity.sol`) to confirm ownership & timestamp match.
            </p>
          </div>

          {/* Step 04 */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-3 relative group hover:border-cyan-500/50 transition-all">
            <div className="text-2xl font-mono font-bold text-cyan-400">04</div>
            <div className="w-10 h-10 rounded-lg bg-[#111821] text-cyan-400 border border-[#1E293B] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Analysis & Result</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Run image forensic analysis for digital modifications and generate an overall Authenticity Score.
            </p>
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
