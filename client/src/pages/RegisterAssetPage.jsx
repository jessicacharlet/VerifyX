import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Upload, FileCode, CheckCircle, AlertTriangle, Loader2, ArrowLeft, Cpu } from "lucide-react";
import API from "../services/api";

export default function RegisterAssetPage() {
  const navigate = useNavigate();

  const [assetName, setAssetName] = useState("");
  const [file, setFile] = useState(null);
  const [previewHash, setPreviewHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setSuccessResult(null);

    if (!assetName) {
      setAssetName(selectedFile.name);
    }

    // Compute SHA-256 on client side for instant preview
    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setPreviewHash(hashHex);
    } catch (hErr) {
      console.warn("Client hash preview failed:", hErr);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetName", assetName || file.name);

      const res = await API.post("/assets/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setSuccessResult(res.data);
      } else {
        setError(res.data?.message || "Failed to register digital asset.");
      }
    } catch (err) {
      console.error("Register Asset Submit Error:", err);
      const serverErrMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to register digital asset. Please check network and connection.";
      setError(serverErrMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans">
      <Link
        to="/assets"
        className="inline-flex items-center space-x-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registered Assets</span>
      </Link>

      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <Upload className="w-5 h-5 text-emerald-400" />
            <span>Register Digital Asset</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Upload a digital asset to generate its cryptographic fingerprint and register its authenticity record on MongoDB and Ethereum smart contract.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successResult ? (
          <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>Digital Asset Registered Successfully!</span>
            </div>

            <div className="space-y-2 text-xs font-sans">
              <div className="p-3 rounded bg-[#0D121A] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Asset ID:</span>
                <span className="text-cyan-400 font-mono font-bold">{successResult.asset.assetId}</span>
              </div>

              <div className="p-3 rounded bg-[#0D121A] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Asset Name:</span>
                <span className="text-white font-semibold">{successResult.asset.assetName}</span>
              </div>

              <div className="p-3 rounded bg-[#0D121A] border border-[#1E293B] space-y-1">
                <span className="text-[#94A3B8] block">SHA-256 Cryptographic Hash:</span>
                <span className="text-emerald-300 font-mono text-[11px] break-all block">
                  {successResult.asset.sha256Hash}
                </span>
              </div>

              <div className="p-3 rounded bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8] flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Blockchain Status:</span>
                </span>
                <span className="text-cyan-400 font-semibold uppercase">{successResult.asset.blockchainStatus}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                to={`/assets/${successResult.asset.assetId}`}
                className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs transition-colors"
              >
                View Asset Details
              </Link>
              <button
                onClick={() => {
                  setSuccessResult(null);
                  setFile(null);
                  setAssetName("");
                  setPreviewHash("");
                }}
                className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors"
              >
                Register Another Asset
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Asset Display Name</label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. Q3 Financial Audit Certificate.pdf"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* File Upload Dropzone */}
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Select Digital File *</label>
              <div className="border-2 border-dashed border-[#1E293B] hover:border-cyan-500/50 rounded-xl p-8 text-center space-y-3 bg-[#111821]/50 transition-colors">
                <FileCode className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {file ? file.name : "Drag and drop digital asset file here"}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Supports PDF, DOCX, PNG, JPG, JPEG, TXT (Max 50MB)
                  </p>
                </div>

                <input
                  type="file"
                  id="asset-file-input"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="asset-file-input"
                  className="inline-block px-4 py-2 rounded-lg bg-[#1E293B] hover:bg-[#2A394E] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* File Details & Hash Preview */}
            {file && (
              <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-2">
                <div className="flex justify-between text-slate-200 font-medium">
                  <span>Selected File: {file.name}</span>
                  <span className="text-[#94A3B8]">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
                {previewHash && (
                  <div className="space-y-1 pt-1 border-t border-[#1E293B]">
                    <span className="text-[#94A3B8] block text-[11px]">Computed Client-Side SHA-256 Hash Preview:</span>
                    <code className="text-cyan-400 font-mono text-[11px] break-all block">{previewHash}</code>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#070A0F] font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing SHA-256 Hash & Registering...</span>
                </>
              ) : (
                <span>Generate Hash & Register Asset</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
