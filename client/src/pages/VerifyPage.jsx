import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Search, Hash, Camera, Shield, ArrowRight, Sparkles } from "lucide-react";
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8 bg-[#050816]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono font-semibold border border-purple-500/30">
          <Shield className="w-3.5 h-3.5" />
          <span>ON-CHAIN VERIFICATION PORTAL</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">VERIFY PRODUCT</h1>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Verify the authenticity of a product using its Product ID or QR code.
        </p>
      </div>

      {/* Verification Method Selection Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#0A1020] rounded-xl border border-[#1E2A47]">
        <button
          onClick={() => setActiveMethod("qr")}
          className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "qr"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Method 1:</span>
          <span>QR Scanner</span>
        </button>

        <button
          onClick={() => setActiveMethod("id")}
          className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "id"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span className="hidden sm:inline">Method 2:</span>
          <span>Product ID</span>
        </button>

        <button
          onClick={() => setActiveMethod("serial")}
          className={`py-2.5 px-3 rounded-lg text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "serial"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Method 3:</span>
          <span>Serial No.</span>
        </button>
      </div>

      {/* Verification Action Box */}
      <div className="bg-[#0D1528] p-8 rounded-2xl border border-[#1E2A47] space-y-6 shadow-xl">
        {activeMethod === "qr" && (
          <div className="text-center space-y-5 py-3">
            <div className="w-16 h-16 rounded-2xl bg-purple-950/60 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/30">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Scan Product QR Code</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan the QR code on the item packaging using your camera or upload a QR image.
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 inline-flex items-center space-x-2 transition-all"
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
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-xs uppercase"
                />
                <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all text-xs"
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
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-xs uppercase"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-600/20 flex items-center justify-center space-x-2 transition-all text-xs"
            >
              <Search className="w-4 h-4" />
              <span>Verify Serial Number</span>
            </button>
          </form>
        )}
      </div>

      {/* Demo Shortcuts */}
      <div className="bg-[#0D1528] p-5 rounded-2xl border border-[#1E2A47] space-y-3">
        <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Quick Verification Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <button
            onClick={() => handleDemoClick("PROD-AP-9901")}
            className="p-3 rounded-xl bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-left transition-colors group"
          >
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Authentic Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
            <div className="text-[10px] font-mono text-slate-500">PROD-AP-9901</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-SG-8820")}
            className="p-3 rounded-xl bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-left transition-colors group"
          >
            <div className="font-bold text-emerald-400 flex items-center justify-between">
              <span>Authentic Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">Galaxy S25 Ultra</div>
            <div className="text-[10px] font-mono text-slate-500">PROD-SG-8820</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-FAKE-0000")}
            className="p-3 rounded-xl bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] text-left transition-colors group"
          >
            <div className="font-bold text-red-400 flex items-center justify-between">
              <span>Counterfeit Sample</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="font-semibold text-white mt-1">Non-Existent / Tampered</div>
            <div className="text-[10px] font-mono text-slate-500">PROD-FAKE-0000</div>
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
