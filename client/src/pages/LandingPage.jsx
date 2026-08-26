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
    <div className="space-y-10 pb-12 bg-[#070A0F]">
      {/* HERO SECTION */}
      <section className="pt-8 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#0D121A] border border-[#202A36] text-cyan-400 text-xs font-mono font-medium">
              <Code className="w-3.5 h-3.5" />
              <span>Blockchain-based product authentication</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Verify what’s real. <br />
              <span className="text-cyan-400">
                Trust what’s verified.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#8B97A7] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              VerifyX is an enterprise product authentication system combining Ethereum smart contract records, SHA-256 cryptographic hashing, and automated image forgery analysis.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
              <Link
                to="/verify"
                className="w-full sm:w-auto px-5 py-2.5 rounded-md font-bold text-xs text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] transition-colors border border-cyan-400/30 flex items-center justify-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Verify product</span>
              </Link>

              <Link
                to="/register-product"
                className="w-full sm:w-auto px-5 py-2.5 rounded-md font-medium text-xs text-[#F5F7FA] bg-[#0D121A] hover:bg-[#111821] border border-[#202A36] flex items-center justify-center space-x-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-cyan-400" />
                <span>Register product</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Technical Flow Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#0D121A] rounded-xl p-5 border border-[#202A36] space-y-4">
              <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-mono font-bold text-emerald-400">On-chain verified</span>
                </div>
                <span className="text-[10px] font-mono text-[#8B97A7] bg-[#111821] px-2 py-0.5 rounded border border-[#202A36]">
                  PROD-AP-9901
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#111821] border border-[#202A36] flex items-center justify-between">
                  <span className="text-[#8B97A7] text-[11px]">1. Product identity</span>
                  <span className="text-slate-200 font-bold text-[11px]">AirPods Pro (2nd Gen)</span>
                </div>

                <div className="p-2.5 rounded bg-[#111821] border border-[#202A36] flex items-center justify-between">
                  <span className="text-[#8B97A7] text-[11px]">2. SHA-256 hash</span>
                  <span className="text-cyan-300 font-mono text-[10px] truncate max-w-[160px]">
                    e3b0c44298fc...b855
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#111821] border border-[#202A36] flex items-center justify-between">
                  <span className="text-[#8B97A7] text-[11px]">3. Smart contract</span>
                  <span className="text-blue-400 text-[10px]">ProductAuthenticity.sol</span>
                </div>

                <div className="p-2.5 rounded bg-[#111821] border border-[#202A36] flex items-center justify-between">
                  <span className="text-[#8B97A7] text-[11px]">4. Image analysis</span>
                  <span className="text-emerald-400 text-[10px]">Low risk (12%)</span>
                </div>
              </div>

              <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">✓ Authentic product</span>
                </div>
                <span className="text-[10px] text-[#8B97A7] font-mono">Signature verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKING MODEL: VERIFICATION PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-6 rounded-xl border border-[#202A36] space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>Verification portal</span>
            </h2>
            <p className="text-xs text-[#8B97A7]">
              Check a product against its registered authenticity record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input & Action Controls */}
            <form onSubmit={handleQuickVerify} className="md:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-medium text-slate-300 uppercase block">
                  Product ID or Serial Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="e.g. PROD-AP-9901"
                      className="w-full px-3.5 py-2.5 pl-9 rounded-md bg-[#111821] border border-[#202A36] text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
                    />
                    <Search className="w-4 h-4 text-[#8B97A7] absolute left-3 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-md bg-[#06b6d4] hover:bg-[#0891b2] text-[#070A0F] font-bold text-xs shrink-0 transition-colors border border-cyan-400/30"
                  >
                    Verify product
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-[#8B97A7] font-mono">OR</span>
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="px-3.5 py-2 rounded-md bg-[#111821] hover:bg-[#202A36] text-slate-200 border border-[#202A36] font-medium inline-flex items-center space-x-2 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Scan QR code</span>
                </button>
              </div>
            </form>

            {/* Verification Result Previews */}
            <div className="md:col-span-5 space-y-2 text-xs">
              <div className="p-3 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-2 text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>✓ Authentic product — Blockchain match 100%</span>
              </div>

              <div className="p-3 rounded bg-red-950/30 border border-red-500/30 flex items-center space-x-2 text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>⚠ Product not authentic — Hash mismatch / Unregistered</span>
              </div>
            </div>
          </div>

          {/* Verification Shortcuts */}
          <div className="pt-4 border-t border-[#202A36] space-y-3">
            <div className="text-xs font-mono font-semibold text-slate-300">
              Interactive sample shortcuts:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoClick("PROD-AP-9901")}
                className="p-3 rounded-md bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors group"
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Authentic sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
                <div className="text-[10px] font-mono text-[#8B97A7]">PROD-AP-9901</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-SG-8820")}
                className="p-3 rounded-md bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors group"
              >
                <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>Authentic sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Galaxy S25 Ultra</div>
                <div className="text-[10px] font-mono text-[#8B97A7]">PROD-SG-8820</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoClick("PROD-FAKE-0000")}
                className="p-3 rounded-md bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors group"
              >
                <div className="text-xs font-bold text-red-400 flex items-center justify-between">
                  <span>Counterfeit sample</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold text-white mt-1">Unregistered / Tampered</div>
                <div className="text-[10px] font-mono text-[#8B98AA]">PROD-FAKE-0000</div>
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
