import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Search, Hash, Camera, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import QRScannerModal from "../components/QRScannerModal";

export default function VerifyPage() {
  const [activeMethod, setActiveMethod] = useState("qr"); // 'qr' | 'id' | 'serial'
  const [inputVal, setInputVal] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    navigate(`/verify/${encodeURIComponent(inputVal.trim())}`);
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-[#05070D]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-400 text-xs font-mono font-semibold border border-cyan-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ON-CHAIN VERIFICATION PORTAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">VERIFY PRODUCT</h1>
        <p className="text-xs text-[#8B98AA] max-w-lg mx-auto">
          Verify the authenticity of a product using its Product ID or QR code.
        </p>
      </div>

      {/* Verification Method Selection Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0B111B] rounded-lg border border-[#1D2938]">
        <button
          onClick={() => setActiveMethod("qr")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "qr"
              ? "bg-[#06b6d4] text-[#05070D] border border-cyan-400 shadow-md shadow-cyan-500/20"
              : "text-[#8B98AA] hover:text-slate-200 border border-transparent"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>QR Scanner</span>
        </button>

        <button
          onClick={() => setActiveMethod("id")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "id"
              ? "bg-[#06b6d4] text-[#05070D] border border-cyan-400 shadow-md shadow-cyan-500/20"
              : "text-[#8B98AA] hover:text-slate-200 border border-transparent"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Product ID</span>
        </button>

        <button
          onClick={() => setActiveMethod("serial")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "serial"
              ? "bg-[#06b6d4] text-[#05070D] border border-cyan-400 shadow-md shadow-cyan-500/20"
              : "text-[#8B98AA] hover:text-slate-200 border border-transparent"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Serial Number</span>
        </button>
      </div>

      {/* QR Scanner / Input Area */}
      <div className="bg-[#101722] p-8 rounded-xl border border-cyan-500/30 space-y-6 shadow-xl cyan-glow">
        {activeMethod === "qr" && (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-xl bg-cyan-950/60 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Scan Product QR Code</h3>
              <p className="text-xs text-[#8B98AA] max-w-sm mx-auto">
                Scan the QR code on the product packaging using your camera or upload a QR image.
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-8 py-3 rounded-md font-bold text-xs text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 inline-flex items-center space-x-2 transition-all border border-cyan-400/40"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Camera / Upload QR</span>
            </button>
          </div>
        )}

        {activeMethod === "id" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Enter Product ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. PROD-AP-9901"
                  className="w-full px-4 py-3 pl-11 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                />
                <Hash className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-md font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all text-xs border border-cyan-400/40"
            >
              <Search className="w-4 h-4" />
              <span>Verify Product ID</span>
            </button>
          </form>
        )}

        {activeMethod === "serial" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Enter Serial Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. SN-AP-98213890"
                  className="w-full px-4 py-3 pl-11 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                />
                <Search className="w-4 h-4 text-[#8B98AA] absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-md font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all text-xs border border-cyan-400/40"
            >
              <Search className="w-4 h-4" />
              <span>Verify Serial Number</span>
            </button>
          </form>
        )}
      </div>

      {/* Demo Shortcuts */}
      <div className="bg-[#101722] p-5 rounded-xl border border-[#1D2938] space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Quick Verification Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => handleDemoClick("PROD-AP-9901")}
            className="p-3 rounded-md bg-[#0B111B] hover:bg-[#1B2738] border border-[#1D2938] text-left transition-colors group"
          >
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Authentic Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
            <div className="text-[10px] font-mono text-[#8B98AA]">PROD-AP-9901</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-SG-8820")}
            className="p-3 rounded-md bg-[#0B111B] hover:bg-[#1B2738] border border-[#1D2938] text-left transition-colors group"
          >
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Authentic Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">Galaxy S25 Ultra</div>
            <div className="text-[10px] font-mono text-[#8B98AA]">PROD-SG-8820</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-FAKE-0000")}
            className="p-3 rounded-md bg-[#0B111B] hover:bg-[#1B2738] border border-[#1D2938] text-left transition-colors group"
          >
            <div className="font-bold text-red-400 flex items-center justify-between">
              <span>Counterfeit Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">Non-Existent / Tampered</div>
            <div className="text-[10px] font-mono text-[#8B98AA]">PROD-FAKE-0000</div>
          </button>
        </div>
      </div>

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
