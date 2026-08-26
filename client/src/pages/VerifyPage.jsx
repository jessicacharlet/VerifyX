import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QrCode, Search, Hash, Camera, ShieldCheck, ArrowRight } from "lucide-react";
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
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Verify product</h1>
        <p className="text-xs text-[#8B97A7]">
          Check a product against its registered authenticity record.
        </p>
      </div>

      {/* Verification Method Segmented Control */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0D121A] rounded-md border border-[#202A36]">
        <button
          onClick={() => setActiveMethod("qr")}
          className={`py-2 px-3 rounded text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeMethod === "qr"
              ? "bg-[#06b6d4] text-[#070A0F] font-bold"
              : "text-[#8B97A7] hover:text-slate-200"
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>QR code</span>
        </button>

        <button
          onClick={() => setActiveMethod("id")}
          className={`py-2 px-3 rounded text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeMethod === "id"
              ? "bg-[#06b6d4] text-[#070A0F] font-bold"
              : "text-[#8B97A7] hover:text-slate-200"
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          <span>Product ID</span>
        </button>

        <button
          onClick={() => setActiveMethod("serial")}
          className={`py-2 px-3 rounded text-xs font-mono font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeMethod === "serial"
              ? "bg-[#06b6d4] text-[#070A0F] font-bold"
              : "text-[#8B97A7] hover:text-slate-200"
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Serial number</span>
        </button>
      </div>

      {/* Verification Action Box */}
      <div className="bg-[#0D121A] p-6 rounded-lg border border-[#202A36] space-y-6">
        {activeMethod === "qr" && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-lg bg-[#111821] text-cyan-400 flex items-center justify-center mx-auto border border-[#202A36]">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white">Scan product QR code</h3>
              <p className="text-xs text-[#8B97A7] max-w-sm mx-auto">
                Scan the QR code on the product packaging using your camera or upload a QR image.
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-6 py-2.5 rounded-md font-bold text-xs text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] inline-flex items-center space-x-2 transition-colors border border-cyan-400/30"
            >
              <Camera className="w-4 h-4" />
              <span>Launch camera / Upload QR</span>
            </button>
          </div>
        )}

        {activeMethod === "id" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-medium text-slate-300 text-[11px] block">
                Product ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. PROD-AP-9901"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-md bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                />
                <Hash className="w-4 h-4 text-[#8B97A7] absolute left-3 top-3" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-md font-bold text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] flex items-center justify-center space-x-2 transition-colors text-xs border border-cyan-400/30"
            >
              <Search className="w-4 h-4" />
              <span>Verify product</span>
            </button>
          </form>
        )}

        {activeMethod === "serial" && (
          <form onSubmit={handleSearchSubmit} className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-medium text-slate-300 text-[11px] block">
                Serial number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="e.g. SN-AP-98213890"
                  className="w-full px-3.5 py-2.5 pl-9 rounded-md bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500 font-mono text-xs uppercase"
                />
                <Search className="w-4 h-4 text-[#8B97A7] absolute left-3 top-3" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-md font-bold text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] flex items-center justify-center space-x-2 transition-colors text-xs border border-cyan-400/30"
            >
              <Search className="w-4 h-4" />
              <span>Verify product</span>
            </button>
          </form>
        )}
      </div>

      {/* Demo Shortcuts */}
      <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-2 text-xs font-mono">
        <div className="text-slate-300 font-semibold text-[11px]">Demo shortcuts:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => handleDemoClick("PROD-AP-9901")}
            className="p-2.5 rounded bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors"
          >
            <div className="font-bold text-emerald-400 text-[11px]">AirPods Pro (2nd Gen)</div>
            <div className="text-[10px] text-[#8B97A7]">PROD-AP-9901 (Authentic)</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-SG-8820")}
            className="p-2.5 rounded bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors"
          >
            <div className="font-bold text-emerald-400 text-[11px]">Galaxy S25 Ultra</div>
            <div className="text-[10px] text-[#8B97A7]">PROD-SG-8820 (Authentic)</div>
          </button>

          <button
            onClick={() => handleDemoClick("PROD-FAKE-0000")}
            className="p-2.5 rounded bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-left transition-colors"
          >
            <div className="font-bold text-red-400 text-[11px]">Unregistered sample</div>
            <div className="text-[10px] text-[#8B97A7]">PROD-FAKE-0000 (Counterfeit)</div>
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
