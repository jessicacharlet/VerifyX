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
      console.log("Reading uploaded image file for QR code:", file.name, file.type, file.size);
      const html5Qrcode = new Html5Qrcode("file-reader");
      const decodedText = await html5Qrcode.scanFile(file, true);
      console.log("QR decoded successfully:", decodedText);
      onScanSuccess(decodedText);
      onClose();
    } catch (err) {
      console.error("File QR scan error:", err);
      setScannerError("Could not detect a valid product QR code in the uploaded image. Please ensure the image contains a clear, unblurried QR code label.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#101722] w-full max-w-md rounded-xl border border-cyan-500/40 p-6 relative shadow-2xl space-y-4 cyan-glow">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1D2938]">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>Scan Product QR Code</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8B98AA] hover:text-white hover:bg-[#0B111B]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0B111B] rounded border border-[#1D2938]">
          <button
            onClick={() => setActiveTab("camera")}
            className={`py-2 text-xs font-mono font-bold rounded flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "camera"
                ? "bg-[#06b6d4] text-[#05070D] font-bold"
                : "text-[#8B98AA] hover:text-slate-200"
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`py-2 text-xs font-mono font-bold rounded flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "file"
                ? "bg-[#06b6d4] text-[#05070D] font-bold"
                : "text-[#8B98AA] hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Camera Scanner View */}
        {activeTab === "camera" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded bg-[#05070D] border border-[#1D2938] min-h-[240px] flex items-center justify-center">
              <div id="reader" className="w-full h-full"></div>
            </div>
            <p className="text-center text-[11px] font-mono text-[#8B98AA]">
              Scan the QR code on the product packaging using your camera or upload a QR image.
            </p>
          </div>
        )}

        {/* File Upload View */}
        {activeTab === "file" && (
          <div className="space-y-4 py-4 text-center">
            <div id="file-reader" className="hidden"></div>
            <label className="cursor-pointer border-2 border-dashed border-[#1D2938] hover:border-cyan-500/50 bg-[#05070D] rounded-lg p-6 flex flex-col items-center justify-center space-y-2 transition-colors">
              <div className="w-10 h-10 rounded bg-cyan-950/60 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200 block">Click to select QR image file</span>
                <span className="text-[10px] font-mono text-[#8B98AA] block">Supports PNG, JPG, WEBP formats</span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Error Message */}
        {scannerError && (
          <div className="p-3 rounded bg-red-950/60 border border-red-500/30 text-xs text-red-300 flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{scannerError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
