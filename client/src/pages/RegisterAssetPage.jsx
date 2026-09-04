import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Upload,
  FileCode,
  CheckCircle,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Eye,
  FileText,
} from "lucide-react";
import API from "../services/api";
import Tooltip from "../components/Tooltip";

export default function RegisterAssetPage() {
  const navigate = useNavigate();

  const [assetName, setAssetName] = useState("");
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("Uploading file...");
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setSuccessResult(null);

    if (!assetName) {
      setAssetName(selectedFile.name);
    }
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    try {
      setLoading(true);
      setError("");
      setLoadingStep("Uploading file...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetName", assetName || file.name);

      setLoadingStep("Creating authenticity record...");

      const res = await API.post("/assets/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setLoadingStep("Securing file...");
        setTimeout(() => {
          setSuccessResult(res.data);
          setLoading(false);
        }, 400);
      } else {
        setError(res.data?.message || "Asset registration failed.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Register Asset Submit Error:", err);
      const serverErrMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to register digital asset. Please check connection.";
      setError(serverErrMsg);
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccessResult(null);
    setFile(null);
    setAssetName("");
    setError("");
    setShowTechDetails(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans animate-fadeIn">
      <Link
        to="/assets"
        className="inline-flex items-center space-x-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registered Assets</span>
      </Link>

      <div className="bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-xl space-y-6">
        <div className="border-b border-[#22304A] pb-4 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Register a Digital Asset
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Upload the original file to create a secure authenticity record.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-200">Registration Failed</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Success Confirmation Card */}
        {successResult ? (
          <div className="p-6 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-5 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  ✓ Asset Registered Successfully
                </h2>
                <p className="text-xs text-emerald-300">
                  Your file is now registered and can be verified later.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
                <span className="text-[#94A3B8]">File Name:</span>
                <span className="text-white font-semibold">
                  {successResult.asset.assetName || successResult.asset.fileName}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
                <span className="text-[#94A3B8]">Asset ID:</span>
                <span className="text-sky-400 font-mono font-bold">{successResult.asset.assetId}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
                <span className="text-[#94A3B8]">Registered Date:</span>
                <span className="text-slate-200">{formatDate(successResult.asset.createdAt)}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
                <span className="text-[#94A3B8]">Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Protected
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/assets/${successResult.asset.assetId}`}
                className="px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-[#070B14] font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Asset</span>
              </Link>
              <Link
                to="/verify"
                className="px-4 py-2.5 rounded-lg bg-[#111A2A] hover:bg-[#162238] text-white border border-[#22304A] font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5 text-sky-400" />
                <span>Verify Asset</span>
              </Link>
              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-lg bg-[#111A2A] hover:bg-[#162238] text-[#94A3B8] hover:text-white border border-[#22304A] font-medium text-xs transition-colors"
              >
                Register Another
              </button>
            </div>

            {/* Collapsible Technical Information */}
            <div className="pt-3 border-t border-[#22304A]">
              <button
                type="button"
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
              >
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>View Technical Details</span>
              </button>

              {showTechDetails && (
                <div className="mt-3 p-4 rounded-lg bg-[#111A2A] border border-[#22304A] space-y-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1">
                      <span className="text-[#94A3B8] text-[11px]">SHA-256 Hash:</span>
                      <Tooltip text="A unique digital fingerprint generated from the file contents." />
                    </div>
                    <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                      {successResult.asset.sha256Hash}
                    </code>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <span className="text-[#94A3B8]">Blockchain Status:</span>
                      <Tooltip text="A tamper-resistant record used to preserve the authenticity information." />
                    </div>
                    <span className="text-sky-400 font-medium">{successResult.asset.blockchainStatus || "CONFIRMED"}</span>
                  </div>

                  {successResult.asset.network && (
                    <div className="flex justify-between">
                      <span className="text-[#94A3B8]">Network:</span>
                      <span className="text-slate-200">{successResult.asset.network}</span>
                    </div>
                  )}

                  {successResult.asset.contractAddress && (
                    <div className="space-y-1">
                      <span className="text-[#94A3B8] block text-[11px]">Contract Address:</span>
                      <code className="text-sky-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                        {successResult.asset.contractAddress}
                      </code>
                    </div>
                  )}

                  {successResult.asset.transactionHash && (
                    <div className="space-y-1">
                      <span className="text-[#94A3B8] block text-[11px]">Transaction Hash:</span>
                      <code className="text-sky-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                        {successResult.asset.transactionHash}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-200 block font-medium">Display Name (Optional)</label>
              <input
                type="text"
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                placeholder="e.g. Q3 Financial Report"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#111A2A] border border-[#22304A] text-white focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            {/* Interactive Drag & Drop Upload Zone */}
            <div className="space-y-1.5">
              <label className="text-slate-200 block font-medium">Upload your original file *</label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center space-y-3 bg-[#111A2A]/50 transition-all duration-200 ${
                  isDragging
                    ? "border-sky-400 bg-sky-500/10 scale-[1.01]"
                    : "border-[#22304A] hover:border-sky-500/40"
                }`}
              >
                <FileCode className="w-10 h-10 text-sky-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {file ? `Selected File: ${file.name}` : "Drop your file here or Browse Files"}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Supported files: PDF, DOC, DOCX, JPG, PNG, TXT
                  </p>
                </div>

                <input
                  type="file"
                  id="asset-file-input"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="asset-file-input"
                  className="inline-block px-4 py-2 rounded-lg bg-[#22304A] hover:bg-[#2C3E5E] text-white font-medium text-xs cursor-pointer transition-colors"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {/* File Preview Card */}
            {file && (
              <div className="p-4 rounded-xl bg-[#111A2A] border border-[#22304A] flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-sky-400" />
                  <div>
                    <div className="text-xs font-semibold text-white">{file.name}</div>
                    <div className="text-[11px] text-[#94A3B8]">
                      Type: {file.type || "Document"} • Size: {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3.5 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-50 text-[#070B14] font-bold text-xs transition-all shadow-md shadow-sky-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingStep}</span>
                </>
              ) : (
                <span>Create Authenticity Record</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
