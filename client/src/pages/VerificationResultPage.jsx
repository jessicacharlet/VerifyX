import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Package,
  MapPin,
  Clock,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";
import API from "../services/api";

const PUBLIC_JOURNEY_STAGES = [
  { key: "ORDER_RECEIVED", label: "Order Received" },
  { key: "PACKED", label: "Packed" },
  { key: "QUALITY_CHECK", label: "Quality Checked" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function VerificationResultPage() {
  const { productId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublicVerification();
  }, [productId]);

  const fetchPublicVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/verify/${encodeURIComponent(productId)}`);
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Public verification fetch error:", err);
      setError(err.response?.data?.message || "Failed to verify product.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-mono">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
        <div className="text-sm font-bold text-white">Verifying Product Authenticity...</div>
        <p className="text-xs text-[#94A3B8]">Validating cryptographic SHA-256 digital signature and supply chain timeline.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-4 font-mono">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto" />
        <div className="text-lg font-bold text-white">Verification Service Error</div>
        <p className="text-xs text-red-300">{error || "Could not retrieve verification data."}</p>
        <Link to="/" className="inline-block px-4 py-2 bg-slate-800 text-white rounded text-xs">
          Return Home
        </Link>
      </div>
    );
  }

  const { isAuthentic, product, scans = [], status, message, hashMatch } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-mono">
      {/* Top Banner: Verification Result */}
      {isAuthentic ? (
        <div className="bg-[#0D121A] p-8 rounded-2xl border-2 border-emerald-500/50 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
              <span>AUTHENTIC PRODUCT VERIFIED</span>
            </div>
            <h1 className="text-2xl font-bold text-white pt-2">{product?.productName}</h1>
            <p className="text-xs text-[#94A3B8]">{message}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D121A] p-8 rounded-2xl border-2 border-red-500/50 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950 text-red-400 text-xs font-bold border border-red-500/40">
              <span>UNVERIFIED / SUSPICIOUS</span>
            </div>
            <h1 className="text-2xl font-bold text-white pt-2">Warning: Product Unverified</h1>
            <p className="text-xs text-red-300">{message}</p>
          </div>
        </div>
      )}

      {/* Product Information Card */}
      {product && (
        <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Product Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Product Model</span>
              <span className="text-white font-bold">{product.productName}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Product ID</span>
              <span className="text-cyan-400 font-bold">{product.productId}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Brand / Manufacturer</span>
              <span className="text-white font-bold">{product.brandName}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Current Status</span>
              <span className="text-emerald-400 font-bold">{product.currentStage || "DELIVERED"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Public Product Journey Timeline */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Product Supply Chain Journey</span>
        </h3>

        <div className="space-y-4">
          {PUBLIC_JOURNEY_STAGES.map((stg) => {
            const scanMatch = scans.find((s) => s.stage === stg.key);
            const isCompleted = Boolean(scanMatch || product?.currentStage === "DELIVERED");

            return (
              <div key={stg.key} className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${isCompleted ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-[#111821] border-[#1E293B] text-slate-600'}`}>
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-lg bg-[#111821] border border-[#1E293B] flex-grow flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{stg.label}</div>
                    {scanMatch?.location && (
                      <div className="text-[11px] text-cyan-300">Location: {scanMatch.location}</div>
                    )}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {scanMatch?.timestamp ? new Date(scanMatch.timestamp).toLocaleDateString() : isCompleted ? "Verified ✓" : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cryptographic Audit Proof */}
      <div className="bg-[#0D121A] p-5 rounded-xl border border-cyan-500/30 text-center space-y-2 text-xs">
        <div className="text-slate-300 font-bold">Verified on Ethereum Blockchain Audit Layer</div>
        <div className="text-[10px] text-cyan-400 font-mono">SHA-256 Fingerprint: {data.storedHash || product?.productHash}</div>
      </div>
    </div>
  );
}
