import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileCode, CheckCircle2, XCircle, AlertTriangle, Loader2, Cpu, ArrowLeft, RefreshCw, Eye } from "lucide-react";
import API from "../services/api";

export default function VerifyAssetPage() {
  const [file, setFile] = useState(null);
  const [assetId, setAssetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Computing SHA-256 & Verifying...");
  const [error, setError] = useState("");
  const [resultData, setResultData] = useState(null);
  const [previewHash, setPreviewHash] = useState("");

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setResultData(null);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      setPreviewHash(hashHex);
    } catch (hErr) {
      console.warn("Client verification hash preview failed:", hErr);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!file || loading) return;

    try {
      setLoading(true);
      setError("");
      setLoadingText("Reading file bytes & computing SHA-256 hash...");

      const formData = new FormData();
      formData.append("file", file);
      if (assetId) formData.append("assetId", assetId.trim());

      setLoadingText("Comparing SHA-256 fingerprint against registry & blockchain...");

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
        "Verification service error. Please check server connection.";
      setError(serverErrMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetVerification = () => {
    setResultData(null);
    setFile(null);
    setAssetId("");
    setPreviewHash("");
    setError("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 font-sans">
      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <Search className="w-3.5 h-3.5" />
            <span>Digital Asset Authenticator</span>
          </div>
          <h1 className="text-xl font-semibold text-white">Verify Digital Asset</h1>
          <p className="text-xs text-[#94A3B8]">
            Upload a digital asset to verify whether its contents match the registered authenticity record and Ethereum blockchain audit proofs.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-red-200">Verification Error</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Upload Form */}
        {!resultData ? (
          <form onSubmit={handleVerifySubmit} className="space-y-5 text-xs">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Asset ID (Optional)</label>
              <input
                type="text"
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                placeholder="e.g. AST-104921 (Leave empty to lookup matching SHA-256 hash automatically)"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 font-mono uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Upload File for Verification *</label>
              <div className="border-2 border-dashed border-[#1E293B] hover:border-cyan-500/50 rounded-xl p-8 text-center space-y-3 bg-[#111821]/50 transition-colors">
                <FileCode className="w-10 h-10 text-cyan-400 mx-auto" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">
                    {file ? file.name : "Choose digital asset file to verify"}
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Upload the exact document or file to inspect content SHA-256 fingerprint
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
                  Select File
                </label>
              </div>
            </div>

            {/* Selected File Details Card */}
            {file && (
              <div className="p-4 rounded-lg bg-[#111821] border border-[#1E293B] space-y-3">
                <div className="font-semibold text-white border-b border-[#1E293B] pb-2">
                  Selected File Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">File Name:</span>
                    <span className="text-slate-200 font-medium break-all">{file.name}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">File Type:</span>
                    <span className="text-slate-200 font-medium">{file.type || "Document"}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[11px]">File Size:</span>
                    <span className="text-slate-200 font-medium">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                </div>

                {previewHash && (
                  <div className="space-y-1 pt-2 border-t border-[#1E293B]">
                    <span className="text-[#94A3B8] block text-[11px]">Computed SHA-256 Fingerprint:</span>
                    <code className="text-cyan-400 font-mono text-[11px] break-all block p-2 rounded bg-[#0D121A] border border-[#1E293B]">
                      {previewHash}
                    </code>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#070A0F] font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <span>Verify Digital Asset</span>
              )}
            </button>
          </form>
        ) : (
          /* Verification Result Section */
          <div className="space-y-6">
            {/* Case A: AUTHENTIC RESULT */}
            {resultData.result === "AUTHENTIC" && (
              <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-5 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">✓ AUTHENTIC DIGITAL ASSET</h2>
                    <p className="text-xs text-emerald-300">The submitted file matches the registered authenticity record.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-emerald-500/30 text-emerald-400 font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Asset Registered</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-emerald-500/30 text-emerald-400 font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ SHA-256 Hash Match: YES</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#0D121A] border border-emerald-500/30 text-emerald-400 font-medium flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>✓ Blockchain Record Found</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-3 text-xs font-sans">
                  <div className="flex justify-between border-b border-[#1E293B] pb-2">
                    <span className="text-[#94A3B8]">Asset ID:</span>
                    <span className="text-cyan-400 font-mono font-bold">{resultData.asset?.assetId}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#1E293B] pb-2">
                    <span className="text-[#94A3B8]">Asset Name:</span>
                    <span className="text-white font-semibold">{resultData.asset?.assetName}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#94A3B8] block">Submitted SHA-256 Fingerprint:</span>
                    <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                      {resultData.submittedHash}
                    </code>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[#94A3B8] block">Registered SHA-256 Fingerprint:</span>
                    <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                      {resultData.storedHash}
                    </code>
                  </div>
                  <div className="flex justify-between border-t border-[#1E293B] pt-2">
                    <span className="text-[#94A3B8]">Blockchain Status:</span>
                    <span className="text-cyan-400 font-semibold uppercase">{resultData.asset?.blockchainStatus || "CONFIRMED"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Verification Date:</span>
                    <span className="text-slate-200">{new Date(resultData.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to={`/assets/${resultData.asset?.assetId}`}
                    className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Asset Details</span>
                  </Link>
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Verify Another Asset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case B: MODIFIED / INVALID RESULT */}
            {resultData.result === "MODIFIED" && (
              <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 space-y-5 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">✕ MODIFIED / INVALID DIGITAL ASSET</h2>
                    <p className="text-xs text-red-300">The submitted file does not match the registered digital asset.</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-3 text-xs font-sans">
                  <div className="flex justify-between border-b border-[#1E293B] pb-2 font-semibold">
                    <span className="text-[#94A3B8]">Hash Match Status:</span>
                    <span className="text-red-400 uppercase font-mono">NO (HASH MISMATCH)</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-cyan-400 font-medium block">Original Registered Record Hash:</span>
                    <code className="text-cyan-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                      {resultData.storedHash}
                    </code>
                  </div>

                  <div className="space-y-1">
                    <span className="text-red-400 font-medium block">Submitted File SHA-256 Hash:</span>
                    <code className="text-red-300 font-mono text-[11px] break-all block p-2 rounded bg-red-950/30 border border-red-500/20">
                      {resultData.submittedHash}
                    </code>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Verify Another Asset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Case C: NOT REGISTERED RESULT */}
            {resultData.result === "NOT_REGISTERED" && (
              <div className="p-6 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">! ASSET NOT REGISTERED</h2>
                    <p className="text-xs text-amber-300">No registered authenticity record was found for this asset.</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#0D121A] border border-[#1E293B] space-y-1 text-xs font-sans">
                  <span className="text-[#94A3B8] block">Submitted File SHA-256 Hash:</span>
                  <code className="text-amber-300 font-mono text-[11px] break-all block p-2 rounded bg-[#111821] border border-[#1E293B]">
                    {resultData.submittedHash}
                  </code>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to="/assets/register"
                    className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#070A0F] font-semibold text-xs transition-colors"
                  >
                    Register This Digital Asset Now
                  </Link>
                  <button
                    onClick={handleResetVerification}
                    className="px-4 py-2.5 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white border border-[#1E293B] font-medium text-xs transition-colors"
                  >
                    Verify Another Asset
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
