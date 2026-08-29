import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Search, Hash, Camera, ShieldCheck, ArrowRight, UploadCloud, CheckCircle, AlertTriangle } from "lucide-react";
import QRScannerModal from "../components/QRScannerModal";

export default function VerifyPage() {
  const [activeMethod, setActiveMethod] = useState("qr"); // 'qr' | 'id' | 'serial'
  const [inputVal, setInputVal] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    navigate(`/verify/${encodeURIComponent(inputVal.trim())}`);
  };

  const handleQRScanned = (scannedCode) => {
    console.log("QR scanned text received in page:", scannedCode);
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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsScannerOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 bg-[#070A0F]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D121A] border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Product Authentication Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Verify Asset Authenticity</h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto">
          Scan product QR code, enter Product ID, or upload label image to query on-chain records and AI forgery checks.
        </p>
      </div>

      {/* Verification Method Segmented Control */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0D121A] rounded-lg border border-[#1E293B]">
        <button
          onClick={() => setActiveMethod("qr")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "qr"
              ? "bg-cyan-400 text-[#070A0F] font-bold shadow-sm shadow-cyan-500/20"
              : "text-[#94A3B8] hover:text-slate-200 hover:bg-[#111821]"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Scan QR Code</span>
        </button>

        <button
          onClick={() => setActiveMethod("id")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "id"
              ? "bg-cyan-400 text-[#070A0F] font-bold shadow-sm shadow-cyan-500/20"
              : "text-[#94A3B8] hover:text-slate-200 hover:bg-[#111821]"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Product ID</span>
        </button>

        <button
          onClick={() => setActiveMethod("serial")}
          className={`py-2.5 px-3 rounded-md text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-all ${
            activeMethod === "serial"
              ? "bg-cyan-400 text-[#070A0F] font-bold shadow-sm shadow-cyan-500/20"
              : "text-[#94A3B8] hover:text-slate-200 hover:bg-[#111821]"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Serial Number</span>
        </button>
      </div>

      {/* Polished Upload / Action Card */}
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        {activeMethod === "qr" && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center space-y-5 transition-all ${
              isDragging
                ? "border-cyan-400 bg-cyan-500/10"
                : "border-[#1E293B] hover:border-cyan-500/40 bg-[#111821]/50"
            }`}
          >
            <div className="w-14 h-14 rounded-xl bg-[#111821] text-cyan-400 border border-[#1E293B] flex items-center justify-center mx-auto shadow-inner">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Upload Asset Label or Scan QR</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                Drag and drop your product label image here, or launch live camera scanner.
              </p>
              <div className="text-[10px] font-mono text-[#64748B] pt-1">
                Supported: PNG, JPG, JPEG, WEBP, QR Code Images
              </div>
            </div>

            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-6 py-3 rounded-lg font-bold text-xs text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 inline-flex items-center space-x-2 transition-all border border-cyan-300/40 shadow-sm shadow-cyan-500/20"
            >
              <Camera className="w-4 h-4" />
              <span>Launch Camera / Upload Image</span>
            </button>
          </div>
        )}

        {activeMethod === "id" && (
          <form onSubmit={handleSearchSubmit} className="space-y-5 py-2">
            <div className="space-y-2">
              <label className="font-mono font-medium text-slate-300 text-xs block">
                Product ID Lookup
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. PROD-AP-9901"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-400 font-mono text-xs uppercase"
                />
                <Hash className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center space-x-2 transition-all text-xs border border-cyan-300/40 shadow-sm shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Verify Product ID</span>
            </button>
          </form>
        )}

        {activeMethod === "serial" && (
          <form onSubmit={handleSearchSubmit} className="space-y-5 py-2">
            <div className="space-y-2">
              <label className="font-mono font-medium text-slate-300 text-xs block">
                Serial Number Lookup
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. SN-AP-98213890"
                  className="w-full px-4 py-3 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white placeholder-[#64748B] focus:outline-none focus:border-cyan-400 font-mono text-xs uppercase"
                />
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-[#070A0F] bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center space-x-2 transition-all text-xs border border-cyan-300/40 shadow-sm shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>Verify Serial Number</span>
            </button>
          </form>
        )}
      </div>

      {/* Interactive Sample Shortcuts */}
      <div className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-3 font-mono text-xs">
        <div className="text-slate-300 font-semibold text-xs flex items-center justify-between">
          <span>Preset Verification Samples:</span>
          <span className="text-[10px] text-[#64748B]">Instant One-Click Test</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleDemoClick("PROD-AP-9901")}
            className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
          >
            <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
              <span>AirPods Pro (2nd Gen)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">PROD-AP-9901 (Authentic)</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-SG-8820")}
            className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
          >
            <div className="font-bold text-emerald-400 text-xs flex items-center justify-between">
              <span>Galaxy S25 Ultra</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">PROD-SG-8820 (Authentic)</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-FAKE-0000")}
            className="p-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] border border-[#1E293B] text-left transition-all group"
          >
            <div className="font-bold text-red-400 text-xs flex items-center justify-between">
              <span>Unregistered Sample</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">PROD-FAKE-0000 (Counterfeit)</div>
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
