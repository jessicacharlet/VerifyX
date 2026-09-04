import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FileCheck,
  ArrowLeft,
  Search,
  Clock,
  FileCode,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import API from "../services/api";
import Tooltip from "../components/Tooltip";

export default function AssetDetailPage() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTechDetails, setShowTechDetails] = useState(false);

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
        try {
          const vRes = await API.get(`/verify/history?search=${res.data.asset.assetId}`);
          if (vRes.data && vRes.data.history) {
            setVerifications(vRes.data.history);
          }
        } catch (vErr) {
          console.warn("Fetch asset verification history warning:", vErr);
        }
      } else {
        setError("Digital file record not found.");
      }
    } catch (err) {
      console.error("Fetch asset detail error:", err);
      setError("Failed to load file details.");
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return <div className="p-12 text-center text-xs font-sans text-[#94A3B8]">Loading file record...</div>;
  }

  if (error || !asset) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4 font-sans">
        <FileCode className="w-10 h-10 text-[#64748B] mx-auto" />
        <div className="text-base font-semibold text-white">File Record Not Found</div>
        <p className="text-xs text-[#94A3B8]">{error || "The requested file ID does not exist."}</p>
        <Link to="/assets" className="inline-block px-4 py-2 bg-[#111A2A] text-sky-400 rounded-lg border border-[#22304A] text-xs font-medium">
          Back to Assets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans animate-fadeIn">
      <Link
        to="/assets"
        className="inline-flex items-center space-x-2 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Assets</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-[#0D1422] p-6 sm:p-8 rounded-xl border border-[#22304A] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">{asset.assetName || asset.fileName}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Protected
            </span>
          </div>
          <div className="text-xs text-[#94A3B8]">
            Asset ID: <span className="text-sky-400 font-mono font-bold">{asset.assetId}</span> • Registered On: {formatDate(asset.createdAt)}
          </div>
        </div>

        <Link
          to="/verify"
          className="px-5 py-3 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-[#070B14] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-sky-500/20"
        >
          <Search className="w-4 h-4" />
          <span>Verify This File</span>
        </Link>
      </div>

      {/* File Information Card */}
      <div className="bg-[#0D1422] p-6 rounded-xl border border-[#22304A] space-y-4 shadow-md">
        <h3 className="text-base font-semibold text-white border-b border-[#22304A] pb-3">
          File Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
            <span className="text-[#94A3B8]">File Name:</span>
            <span className="text-white font-semibold">{asset.fileName}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
            <span className="text-[#94A3B8]">Registration Date:</span>
            <span className="text-slate-200">{formatDate(asset.createdAt)}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
            <span className="text-[#94A3B8]">Status:</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Protected
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex justify-between items-center">
            <span className="text-[#94A3B8]">Verification Count:</span>
            <span className="text-sky-400 font-bold text-sm">{verifications.length}</span>
          </div>
        </div>

        {/* Collapsible Technical Details */}
        <div className="pt-3 border-t border-[#22304A]">
          <button
            type="button"
            onClick={() => setShowTechDetails(!showTechDetails)}
            className="flex items-center space-x-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors font-medium"
          >
            {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span>Technical Verification Details</span>
          </button>

          {showTechDetails && (
            <div className="mt-3 p-4 rounded-lg bg-[#111A2A] border border-[#22304A] space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-[#94A3B8] text-[11px]">SHA-256 Hash:</span>
                  <Tooltip text="A unique digital fingerprint generated from the file contents." />
                </div>
                <code className="text-emerald-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                  {asset.sha256Hash}
                </code>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-1">
                  <span className="text-[#94A3B8]">Blockchain Status:</span>
                  <Tooltip text="A tamper-resistant record used to preserve the authenticity information." />
                </div>
                <span className="text-sky-400 font-medium">{asset.blockchainStatus || "CONFIRMED"}</span>
              </div>

              {asset.network && (
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Network:</span>
                  <span className="text-slate-200">{asset.network}</span>
                </div>
              )}

              {asset.contractAddress && (
                <div className="space-y-1">
                  <span className="text-[#94A3B8] block text-[11px]">Contract Address:</span>
                  <code className="text-sky-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                    {asset.contractAddress}
                  </code>
                </div>
              )}

              {asset.transactionHash && (
                <div className="space-y-1">
                  <span className="text-[#94A3B8] block text-[11px]">Transaction Hash:</span>
                  <code className="text-sky-300 font-mono text-[11px] break-all block p-2 rounded bg-[#0D1422] border border-[#22304A]">
                    {asset.transactionHash}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verification History for this asset */}
      <div className="bg-[#0D1422] p-6 rounded-xl border border-[#22304A] space-y-4 shadow-md">
        <h3 className="text-base font-semibold text-white border-b border-[#22304A] pb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>Verification Activity Log ({verifications.length})</span>
        </h3>

        <div className="space-y-2 text-xs">
          {verifications.length === 0 ? (
            <div className="py-6 text-center text-[#94A3B8]">
              No verification attempts recorded for this file yet.
            </div>
          ) : (
            verifications.map((v) => (
              <div
                key={v._id}
                className="p-3.5 rounded-lg bg-[#111A2A] border border-[#22304A] flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-white">{v.fileName}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-0.5">{formatDate(v.timestamp)}</div>
                </div>
                <div>
                  {v.result === "AUTHENTIC" && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                      ✓ Original
                    </span>
                  )}
                  {v.result === "MODIFIED" && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-500/30">
                      ⚠ Modified
                    </span>
                  )}
                  {v.result === "NOT_REGISTERED" && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0D1422] text-slate-300 border border-[#22304A]">
                      ? Not Registered
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
