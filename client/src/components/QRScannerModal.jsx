import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, Upload, AlertCircle } from "lucide-react";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState("camera"); // 'camera' | 'file'
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
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            html5QrcodeScanner
              .stop()
              .then(() => {
                onScanSuccess(decodedText);
                onClose();
              })
              .catch((err) => console.error("Scanner stop error:", err));
          },
          (errorMessage) => {
            // Silence routine frame scan errors
          }
        )
        .catch((err) => {
          console.error("Camera access error:", err);
          setScannerError("Camera permissions denied or web camera unavailable. Please try uploading a QR image file.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 p-6 relative shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-400" />
            <span>Scan Product QR Code</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("camera")}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "camera"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => setActiveTab("file")}
            className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === "file"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Camera View */}
        {activeTab === "camera" && (
          <div className="space-y-3">
            <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 min-h-[260px] flex items-center justify-center">
              <div id="reader" className="w-full h-full"></div>
            </div>
            <p className="text-center text-xs text-slate-400">
              Align the product QR code inside the viewfinder window.
            </p>
          </div>
        )}

        {/* File Upload View */}
        {activeTab === "file" && (
          <div className="space-y-4 py-6 text-center">
            <div id="file-reader" className="hidden"></div>
            <label className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-blue-500/50 bg-slate-900/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200 block">Click to select QR image</span>
                <span className="text-xs text-slate-500 block">Supports PNG, JPG, WEBP formats</span>
              </div>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Error Alert */}
        {scannerError && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/50 flex items-start space-x-2 text-xs text-red-300">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{scannerError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
