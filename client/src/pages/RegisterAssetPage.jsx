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
} from "lucide-react";
import API from "../services/api";

export default function RegisterAssetPage() {
  const navigate = useNavigate();

  const [assetName, setAssetName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successResult, setSuccessResult] = useState(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setSuccessResult(null);

    if (!assetName) {
      setAssetName(selectedFile.name);
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
        setError(res.data?.message || "Asset registration failed.");
      }
    } catch (err) {
      console.error("Register Asset Submit Error:", err);
      const serverErrMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to register digital asset. Please check connection.";
      setError(serverErrMsg);
    } finally {
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
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans">
      <Link
        to="/assets"
        className="inline-flex items-center space-x-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Registered Assets</span>
      </Link>

      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
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
          <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-5 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Asset Registered Successfully
                </h2>
                <p className="text-xs text-emerald-300">
                  Your file has been registered and can now be verified at any time.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">File Name:</span>
                <span className="text-white font-semibold">{successResult.asset.assetName || successResult.asset.fileName}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">Asset ID:</span>
                <span className="text-cyan-400 font-mono font-bold">{successResult.asset.assetId}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">Registered On:</span>
                <span className="text-slate-200">{formatDate(successResult.asset.createdAt)}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                <span className="text-[#94A3B8]">Status:</span>
                <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Protected
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to={`/assets/${successResult.asset.assetId}`}
                className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Asset</span>
              </Link>
              <Link
                to="/verify"
                className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verify This File</span>
              </Link>
              <button
                onClick={handleResetForm}
                className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#1E293B] font-medium text-xs transition-colors"
              >
                Register Another File
              </button>
            </div>

            {/* Collapsible Technical Information */}
            <div className="pt-2 border-t border-[#1E293B]/60">
              <button
                type="button"
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
              >
                {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>View Technical Details</span>
              </button>

              {showTechDetails && (
                <div className="mt-3 p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#94A3B8] block text-[11px]">SHA-256 Hash:</span>
                    <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                      {successResult.asset.sha256Hash}
                    </code>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Blockchain Status:</span>
                    <span className="text-cyan-400 font-medium">{successResult.asset.blockchainStatus || "CONFIRMED"}</span>
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
                      <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                        {successResult.asset.contractAddress}
                      </code>
                    </div>
                  )}

                  {successResult.asset.transactionHash && (
                    <div className="space-y-1">
                      <span className="text-[#94A3B8] block text-[11px]">Transaction Hash:</span>
                      <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
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
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Upload Area */}
            <div className="space-y-1.5">
              <label className="text-slate-200 block font-medium">Upload your original file *</label>
              <div className="border-2 border-dashed border-[#1E293B] hover:border-cyan-500/50 rounded-xl p-8 text-center space-y-3 bg-[#111821]/50 transition-colors">
                <FileCode className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {file ? `Selected File: ${file.name}` : "Upload your original file"}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Supported files: PDF, DOC, DOCX, JPG, PNG, TXT
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

            {file && (
              <div className="p-3.5 rounded-lg bg-[#111821] border border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[#94A3B8] text-[11px] block">Selected File</span>
                  <span className="text-white font-medium">{file.name}</span>
                </div>
                <span className="text-[#94A3B8] text-[11px]">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-[#070A0F] font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Authenticity Record...</span>
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
