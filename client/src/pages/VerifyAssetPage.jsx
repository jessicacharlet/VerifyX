import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  Plus,
} from "lucide-react";
import API from "../services/api";

export default function VerifyAssetPage() {
  const [file, setFile] = useState(null);
  const [assetId, setAssetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setResultData(null);
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      if (assetId) formData.append("assetId", assetId.trim());

      const res = await API.post("/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.success) {
        setResultData(res.data);
      } else {
        setError(res.data?.message || "Failed to execute asset verification.");
      }
    } catch (err) {
      console.error("Verify submit error:", err);
      const serverErrMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Verification service error. Please check connection.";
      setError(serverErrMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetVerification = () => {
    setResultData(null);
    setFile(null);
    setAssetId("");
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Verify a Digital Asset
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8]">
            Upload a file to check whether it matches its original registered record.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-200">Verification Error</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Form state */}
        {!resultData ? (
          <form onSubmit={handleVerifySubmit} className="space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-200 block font-medium">Asset ID (Optional)</label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="e.g. AST-104921 (Optional)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 font-mono uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-200 block font-medium">Upload File to Verify *</label>
              <div className="border-2 border-dashed border-[#1E293B] hover:border-cyan-500/50 rounded-xl p-8 text-center space-y-3 bg-[#111821]/50 transition-colors">
                <FileCode className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {file ? `Selected File: ${file.name}` : "Upload File to Verify"}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Upload any digital file to check its authenticity
                  </p>
                </div>

                <input
                  type="file"
                  id="verify-file-input"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="verify-file-input"
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
                  <span>Verifying File...</span>
                </>
              ) : (
                <span>Verify File</span>
              )}
            </button>
          </form>
        ) : (
          /* Result States */
          <div className="space-y-6">
            {/* RESULT 1 — ORIGINAL */}
            {resultData.result === "AUTHENTIC" && (
              <div className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-5 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      ✓ Original File Confirmed
                    </h2>
                    <p className="text-xs text-emerald-300">
                      This file matches the original authenticity record.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">File Name:</span>
                    <span className="text-white font-semibold">
                      {resultData.asset?.assetName || resultData.asset?.fileName || file?.name}
                    </span>
                  </div>
                  {resultData.asset?.assetId && (
                    <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                      <span className="text-[#94A3B8]">Asset ID:</span>
                      <span className="text-cyan-400 font-mono font-bold">{resultData.asset.assetId}</span>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">Verified On:</span>
                    <span className="text-slate-200">{formatDate(resultData.timestamp)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">Status:</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      Original
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  {resultData.asset?.assetId && (
                    <Link
                      to={`/assets/${resultData.asset.assetId}`}
                      className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Asset Details</span>
                    </Link>
                  )}
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Another File</span>
                  </button>
                </div>

                {/* Collapsible Technical Details */}
                <div className="pt-2 border-t border-[#1E293B]/60">
                  <button
                    type="button"
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
                  >
                    {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>Technical Verification Details</span>
                  </button>

                  {showTechDetails && (
                    <div className="mt-3 p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[#94A3B8] block text-[11px]">Submitted File Hash:</span>
                        <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                          {resultData.submittedHash}
                        </code>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[#94A3B8] block text-[11px]">Registered Hash:</span>
                        <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                          {resultData.storedHash}
                        </code>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Hash Comparison:</span>
                        <span className="text-emerald-400 font-medium">Exact Match</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Blockchain Status:</span>
                        <span className="text-cyan-400 font-medium">{resultData.asset?.blockchainStatus || "CONFIRMED"}</span>
                      </div>

                      {resultData.asset?.network && (
                        <div className="flex justify-between">
                          <span className="text-[#94A3B8]">Network:</span>
                          <span className="text-slate-200">{resultData.asset.network}</span>
                        </div>
                      )}

                      {resultData.asset?.contractAddress && (
                        <div className="space-y-1">
                          <span className="text-[#94A3B8] block text-[11px]">Contract Address:</span>
                          <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                            {resultData.asset.contractAddress}
                          </code>
                        </div>
                      )}

                      {resultData.asset?.transactionHash && (
                        <div className="space-y-1">
                          <span className="text-[#94A3B8] block text-[11px]">Transaction Hash:</span>
                          <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                            {resultData.asset.transactionHash}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESULT 2 — MODIFIED */}
            {resultData.result === "MODIFIED" && (
              <div className="p-6 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-5 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      ⚠ File Has Been Modified
                    </h2>
                    <p className="text-xs text-amber-300">
                      This file does not match the original registered record.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">File Name:</span>
                    <span className="text-white font-semibold">{file?.name}</span>
                  </div>
                  {resultData.asset?.assetId && (
                    <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                      <span className="text-[#94A3B8]">Asset ID:</span>
                      <span className="text-cyan-400 font-mono font-bold">{resultData.asset.assetId}</span>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">Verified On:</span>
                    <span className="text-slate-200">{formatDate(resultData.timestamp)}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-[#1E293B] flex justify-between items-center">
                    <span className="text-[#94A3B8]">Status:</span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      Modified
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Another File</span>
                  </button>
                </div>

                {/* Collapsible Technical Details */}
                <div className="pt-2 border-t border-[#1E293B]/60">
                  <button
                    type="button"
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
                  >
                    {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>Technical Verification Details</span>
                  </button>

                  {showTechDetails && (
                    <div className="mt-3 p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[#94A3B8] block text-[11px]">Submitted File Hash:</span>
                        <code className="text-amber-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                          {resultData.submittedHash}
                        </code>
                      </div>

                      {resultData.storedHash && (
                        <div className="space-y-1">
                          <span className="text-[#94A3B8] block text-[11px]">Registered Original Hash:</span>
                          <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                            {resultData.storedHash}
                          </code>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Hash Comparison:</span>
                        <span className="text-amber-400 font-medium">Mismatch (Content altered)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* RESULT 3 — NOT REGISTERED */}
            {resultData.result === "NOT_REGISTERED" && (
              <div className="p-6 rounded-xl bg-[#0D121A] border border-[#1E293B] space-y-5 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      ? File Not Registered
                    </h2>
                    <p className="text-xs text-[#94A3B8]">
                      VerifyX could not find an authenticity record for this file.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/assets/register"
                    className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-[#070A0F] font-semibold text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Register This File</span>
                  </Link>
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors"
                  >
                    Try Another File
                  </button>
                </div>

                {/* Collapsible Technical Details */}
                <div className="pt-2 border-t border-[#1E293B]/60">
                  <button
                    type="button"
                    onClick={() => setShowTechDetails(!showTechDetails)}
                    className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
                  >
                    {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>Technical Verification Details</span>
                  </button>

                  {showTechDetails && (
                    <div className="mt-3 p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-[#94A3B8] block text-[11px]">Submitted File Hash:</span>
                        <code className="text-slate-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                          {resultData.submittedHash}
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#94A3B8]">Database Record:</span>
                        <span className="text-slate-400 font-medium">Not Found</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
