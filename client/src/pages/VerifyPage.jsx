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
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Public Authenticity Verification Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Verify Product Authenticity</h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Choose a method below to instantly verify product hash integrity against Ethereum blockchain records.
        </p>
      </div>

      {/* Verification Method Selection Tabs */}
      <div className="grid grid-cols-3 gap-3 p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveMethod("qr")}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "qr"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span className="hidden sm:inline">Method 1:</span>
          <span>QR Scanner</span>
        </button>

        <button
          onClick={() => setActiveMethod("id")}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "id"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Hash className="w-4 h-4" />
          <span className="hidden sm:inline">Method 2:</span>
          <span>Product ID</span>
        </button>

        <button
          onClick={() => setActiveMethod("serial")}
          className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "serial"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Method 3:</span>
          <span>Serial No.</span>
        </button>
      </div>

      {/* Verification Card Box */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        {activeMethod === "qr" && (
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 rounded-3xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30 shadow-inner">
              <QrCode className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Scan Product QR Code Label</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Scan the QR code printed on the physical product box using your device camera or upload a QR image.
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 inline-flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Camera className="w-5 h-5" />
              <span>Launch Camera / Upload QR</span>
            </button>
          </div>
        )}

        {activeMethod === "id" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Enter Product ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. PROD-AP-9901"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm uppercase"
                />
                <Hash className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Verify Product ID</span>
            </button>
          </form>
        )}

        {activeMethod === "serial" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Enter Serial Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. SN-AP-98213890"
                  className="w-full px-4 py-3.5 pl-11 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-sm uppercase"
                />
                <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Verify Serial Number</span>
            </button>
          </form>
        )}
      </div>

      {/* Demo Test Shortcut Buttons */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Quick Demo Test Shortcuts</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleDemoClick("PROD-AP-9901")}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
              <span>Authentic Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-semibold text-white mt-1">AirPods Pro (2nd Gen)</div>
            <div className="text-[10px] font-mono text-slate-500">PROD-AP-9901</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-SG-8820")}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
          >
            <div className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 flex items-center justify-between">
              <span>Authentic Product</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-semibold text-white mt-1">Galaxy S25 Ultra</div>
            <div className="text-[10px] font-mono text-slate-500">PROD-SG-8820</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-FAKE-0000")}
            className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-colors group"
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

      {/* Camera QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
