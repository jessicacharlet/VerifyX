import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FileCheck, ArrowLeft, Cpu, ShieldCheck, Search, Clock, FileCode, CheckCircle2 } from "lucide-react";
import API from "../services/api";

export default function AssetDetailPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/assets/${id}`);
      if (res.data && res.data.asset) {
        setAsset(res.data.asset);
        // Fetch verification history for this asset
        try {
          const vRes = await API.get(`/verify/history?search=${res.data.asset.assetId}`);
          if (vRes.data && vRes.data.history) {
            setVerifications(vRes.data.history);
          }
        } catch (vErr) {
          console.warn("Fetch asset verification history warning:", vErr);
        }
      } else {
        setError("Digital asset record not found.");
      }
    } catch (err) {
      console.error("Fetch asset detail error:", err);
      setError("Failed to load digital asset details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-sans text-[#94A3B8]">Loading asset record...</div>;
  }

  if (error || !asset) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4 font-sans">
        <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
        <div className="text-base font-semibold text-white">Asset Record Not Found</div>
        <p className="text-xs text-[#94A3B8]">{error || "The requested asset ID does not exist."}</p>
        <Link to="/assets" className="inline-block px-4 py-2 bg-[#111821] text-cyan-400 rounded border border-[#1E293B] text-xs">
          Back to Registered Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      <Link
        to="/assets"
        className="inline-flex items-center space-x-2 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Registered Assets</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-semibold font-mono text-cyan-400">{asset.assetId}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              {asset.blockchainStatus || "NOT_CONFIGURED"}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-white">{asset.assetName}</h1>
          <div className="text-xs text-[#94A3B8]">
            Registered File: <span className="text-slate-200 font-mono">{asset.fileName}</span> • Date: {new Date(asset.createdAt).toLocaleString()}
          </div>
        </div>

        <Link
          to="/verify"
          className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Search className="w-4 h-4" />
          <span>Verify Asset Authenticity</span>
        </Link>
      </div>

      {/* Grid: Metadata & Blockchain Proof */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Asset Metadata */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-3">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Asset Metadata & Cryptography</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Asset ID:</span>
                <span className="text-cyan-400 font-mono font-bold">{asset.assetId}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Asset Display Name:</span>
                <span className="text-white font-semibold">{asset.assetName}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Original File Name:</span>
                <span className="text-slate-200 font-mono">{asset.fileName}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">File Type / Size:</span>
                <span className="text-slate-200">{asset.fileType} ({(asset.fileSize / 1024).toFixed(1)} KB)</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] space-y-1">
                <span className="text-[#94A3B8] block">SHA-256 Cryptographic Hash:</span>
                <code className="text-emerald-300 font-mono text-[11px] break-all block">{asset.sha256Hash}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Blockchain Record Proof */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Ethereum Blockchain Audit Proof</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Blockchain Status:</span>
                <span className="text-cyan-400 font-semibold uppercase">{asset.blockchainStatus || "NOT_CONFIGURED"}</span>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
                <span className="text-[#94A3B8]">Network:</span>
                <span className="text-white">{asset.network || "Ethereum Testnet / Audit Layer"}</span>
              </div>

              {asset.contractAddress && (
                <div className="p-3 rounded bg-[#111821] border border-[#1E293B] space-y-1">
                  <span className="text-[#94A3B8] block">Smart Contract Address:</span>
                  <code className="text-cyan-300 font-mono text-[11px] break-all block">{asset.contractAddress}</code>
                </div>
              )}

              {asset.transactionHash ? (
                <div className="p-3 rounded bg-[#111821] border border-[#1E293B] space-y-1">
                  <span className="text-[#94A3B8] block">Transaction Reference Hash:</span>
                  <code className="text-emerald-400 font-mono text-[11px] break-all block">{asset.transactionHash}</code>
                </div>
              ) : (
                <div className="p-3 rounded bg-[#111821] border border-[#1E293B] text-[#94A3B8]">
                  Blockchain on-chain recording is optional and logged when Ethereum RPC environment variables are configured.
                </div>
              )}
            </div>
          </div>

          {/* Verification Attempts Log */}
          <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-[#1E293B] pb-3">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Audit Verification Log ({verifications.length})</span>
            </h3>

            <div className="space-y-2 text-xs">
              {verifications.length === 0 ? (
                <div className="p-4 text-center text-[#94A3B8]">No verification attempts logged for this asset yet.</div>
              ) : (
                verifications.map((v) => (
                  <div key={v._id} className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-white">{v.fileName}</div>
                      <div className="text-[11px] text-[#94A3B8]">{new Date(v.timestamp).toLocaleString()}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {v.result}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
