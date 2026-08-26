import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, Upload, AlertCircle } from "lucide-react";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState("camera");
  const [scannerError, setScannerError] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    let html5QrcodeScanner = null;

    if (isOpen && activeTab === "camera") {
      setScannerError("");
      setIsScanning(true);

      const qrCodeId = "reader";
      html5QrcodeScanner = new Html5Qrcode(qrCodeId);

      html5QrcodeScanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            html5QrcodeScanner
              .stop()
              .then(() => {
                onScanSuccess(decodedText);
                onClose();
              })
              .catch((err) => console.error("Scanner stop error:", err));
          },
          () => {}
        )
        .catch((err) => {
          console.error("Camera access error:", err);
          setScannerError("Camera permissions denied or web camera unavailable. Try uploading a QR image file.");
          setIsScanning(false);
        });
    }

    return () => {
      if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
        html5QrcodeScanner.stop().catch((err) => console.error("Cleanup stop error:", err));
      }
    };
  }, [isOpen, activeTab]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setScannerError("");
      const html5Qrcode = new Html5Qrcode("file-reader");
      const decodedText = await html5Qrcode.scanFile(file, true);
      onScanSuccess(decodedText);
      onClose();
    } catch (err) {
      console.error("File QR scan error:", err);
      setScannerError("Could not detect a valid product QR code in the uploaded image.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0D1528] w-full max-w-md rounded-2xl border border-purple-500/40 p-6 relative shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2A47]">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Camera className="w-4 h-4 text-purple-400" />
            <span>Scan Product QR Code</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#0A1020]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0A1020] rounded-xl border border-[#1E2A47]">
          <button
            onClick={() => setActiveTab("camera")}
            className={`py-2 text-xs font-mono font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "camera"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`py-2 text-xs font-mono font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "file"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Camera Scanner View */}
        {activeTab === "camera" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl bg-[#050816] border border-[#1E2A47] min-h-[240px] flex items-center justify-center">
              <div id="reader" className="w-full h-full"></div>
            </div>
            <p className="text-center text-[11px] font-mono text-slate-400">
              Align the product QR code inside the viewfinder window.
            </p>
          </div>
        )}

        {/* File Upload View */}
        {activeTab === "file" && (
          <div className="space-y-4 py-4 text-center">
            <div id="file-reader" className="hidden"></div>
            <label className="cursor-pointer border-2 border-dashed border-[#1E2A47] hover:border-purple-500/50 bg-[#050816] rounded-xl p-6 flex flex-col items-center justify-center space-y-2 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Click to select QR image file</span>
                <span className="text-[10px] font-mono text-slate-500 block">Supports PNG, JPG, WEBP formats</span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Error Message */}
        {scannerError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{scannerError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
