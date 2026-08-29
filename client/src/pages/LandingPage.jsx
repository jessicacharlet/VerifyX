import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  QrCode,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Search,
  Camera,
  UploadCloud,
  Check,
  CheckCircle2,
  Lock,
  BrainCircuit,
  FileCheck,
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
    console.log("QR scanned text received in landing page:", scannedCode);
    let cleanCode = scannedCode.trim();
    try { cleanCode = decodeURIComponent(cleanCode); } catch (e) {}
    if (cleanCode.includes("/verify/")) {
      cleanCode = cleanCode.split("/verify/")[1].split("?")[0];
    }
    cleanCode = cleanCode.replace(/\/+$/, "").trim();
    console.log("Parsed product ID for verification route:", cleanCode);
    navigate(`/verify/${encodeURIComponent(cleanCode)}`);
  };

  const handleDemoClick = (sampleId) => {
    navigate(`/verify/${sampleId}`);
  };

  return (
    <div className="space-y-16 pb-16 bg-[#070A0F] bg-grid-pattern">
      {/* 1. HERO SECTION */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0D121A] border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>VERIFYX DIGITAL AUTHENTICITY</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Verify What’s Real.
        </h1>

        <p className="text-lg sm:text-xl font-medium text-slate-200 max-w-2xl mx-auto">
          Check whether a digital asset is authentic or has been modified.
        </p>

        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto">
          Upload an asset and get a clear verification result with the evidence behind it.
        </p>

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/verify"
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 transition-all border border-cyan-300/40 shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify an Asset</span>
          </Link>
        </div>

        {/* 2. VISUAL UNDERSTANDING (3 Steps Directly Below Hero CTA) */}
        <div className="pt-8 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400">01 — Upload</div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">Submit your digital asset.</p>
          </div>

          <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400">02 — Verify</div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">We check its authenticity and detect suspicious changes.</p>
          </div>

          <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-1">
            <div className="text-xs font-mono font-bold text-cyan-400">03 — Get Results</div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">See a clear verification result and supporting evidence.</p>
          </div>
        </div>
      </section>

      {/* 3. WHAT VERIFYX DOES ("How VerifyX Helps") */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] space-y-6 shadow-xl">
          <div className="text-center space-y-1 border-b border-[#1E293B] pb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">How VerifyX Helps</h2>
            <p className="text-xs text-[#94A3B8]">Simple, transparent authenticity verification for digital products.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Check authenticity</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Find out whether an asset matches its trusted record.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Detect suspicious changes</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Identify signs that an asset may have been modified.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Understand the result</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                See why the asset was marked as authentic or suspicious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VERIFICATION RESULT PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-emerald-500/40 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#1E293B] pb-3 font-mono">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">VERIFICATION RESULT PREVIEW</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              Sample Output
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-8 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xl">
                <CheckCircle2 className="w-6 h-6" />
                <span>✓ VERIFIED</span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-white font-semibold">Status: Authentic</div>
                <div className="text-[#94A3B8]">Evidence: No suspicious modification detected</div>
              </div>
            </div>

            <div className="sm:col-span-4 bg-[#111821] p-4 rounded-lg border border-[#1E293B] text-center space-y-1">
              <div className="text-3xl font-bold font-mono text-emerald-400">94%</div>
              <div className="text-[11px] font-mono text-slate-300 font-bold">Authenticity Score</div>
              <div className="text-[10px] text-[#94A3B8]">High Trust Confidence</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LOOKUP PORTAL */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Try Instant Verification</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Input a Product ID or Serial Number to test verification directly.</p>
            </div>
          </div>

          <form onSubmit={handleQuickVerify} className="space-y-4">
            <div className="flex gap-2.5">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="e.g. PROD-AP-9901"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs font-mono uppercase placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
                />
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs shrink-0 transition-all border border-cyan-300/40"
              >
                Verify Asset
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[#64748B] font-mono text-[11px]">Or scan label:</span>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="px-4 py-2 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] font-medium inline-flex items-center space-x-2 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Scan QR / Upload Image</span>
              </button>
            </div>
          </form>

          {/* Interactive Presets */}
          <div className="pt-3 border-t border-[#1E293B] space-y-2">
            <div className="text-xs font-mono text-slate-300">Test Preset Samples:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                onClick={() => handleDemoClick("PROD-AP-9901")}
                className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all"
              >
                <div className="font-bold text-emerald-400">AirPods Pro (2nd Gen)</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">PROD-AP-9901 (Authentic)</div>
              </button>

              <button
                onClick={() => handleDemoClick("PROD-SG-8820")}
                className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all"
              >
                <div className="font-bold text-emerald-400">Galaxy S25 Ultra</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">PROD-SG-8820 (Authentic)</div>
              </button>

              <button
                onClick={() => handleDemoClick("PROD-FAKE-0000")}
                className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all"
              >
                <div className="font-bold text-red-400">Counterfeit Sample</div>
                <div className="text-[10px] font-mono text-[#94A3B8]">PROD-FAKE-0000 (Suspicious)</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNOLOGY DETAILS (LOWER DOWN THE PAGE) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 pt-4">
        <h3 className="text-base sm:text-lg font-bold text-white">Powered by AI and blockchain</h3>
        <p className="text-xs text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          AI-based analysis helps identify suspicious modifications, while blockchain records provide a trusted basis for verification.
        </p>
      </section>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
