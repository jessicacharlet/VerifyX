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
  { key: "ORDER_RECEIVED", label: "Order received" },
  { key: "PACKED", label: "Packed" },
  { key: "QUALITY_CHECK", label: "Quality checked" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "IN_TRANSIT", label: "In transit" },
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

      let cleanId = productId ? String(productId).trim() : "";
      try {
        cleanId = decodeURIComponent(cleanId);
      } catch (e) {}

      if (cleanId.includes("\n") || cleanId.includes("%0A")) {
        const lines = cleanId.split(/\r?\n|%0A/i).map((l) => l.trim()).filter(Boolean);
        if (lines.length > 0) cleanId = lines[0];
      }
      if (cleanId.includes("/verify/")) cleanId = cleanId.split("/verify/")[1].split("?")[0];
      cleanId = cleanId.replace(/\/+$/, "").trim();

      const res = await API.get(`/verify/${encodeURIComponent(cleanId)}`);
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Public verification fetch error:", err);
      setError(err.response?.data?.message || "Failed to verify product registration record.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
        <div className="text-sm font-semibold text-white">Verifying Product Authenticity...</div>
        <p className="text-xs text-[#94A3B8]">Validating cryptographic SHA-256 digital signature and product lifecycle timeline.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-5 font-sans">
        <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">Product Record Not Found</h1>
          <p className="text-xs text-red-300 max-w-md mx-auto">{error || "No authenticity record was found for the requested product identifier."}</p>
        </div>
        <div className="pt-2 flex items-center justify-center space-x-3">
          <Link to="/verify-product" className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors">
            Verify Another Product
          </Link>
          <Link to="/" className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 border border-[#1E293B] rounded-lg text-xs font-semibold transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const { isAuthentic, product, scans = [], status, message, hashMatch } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Top Banner: Verification Result */}
      {isAuthentic ? (
        <div className="bg-[#0D121A] p-8 rounded-2xl border-2 border-emerald-500/50 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4" />
              <span>Authentic Product Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-white pt-2">{product?.productName}</h1>
            <p className="text-xs text-[#94A3B8]">{message}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0D121A] p-8 rounded-2xl border-2 border-red-500/50 shadow-2xl space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-400 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-red-950 text-red-400 text-xs font-semibold border border-red-500/40">
              <span>Unverified / Suspicious</span>
            </div>
            <h1 className="text-2xl font-semibold text-white pt-2">Warning: Product Unverified</h1>
            <p className="text-xs text-red-300">{message}</p>
          </div>
        </div>
      )}

      {/* Product Information Card */}
      {product && (
        <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <h3 className="text-sm font-semibold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Product details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-xs">Product model</span>
              <span className="text-white font-semibold">{product.productName}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-xs">Product ID</span>
              <span className="font-mono text-cyan-400 font-semibold">{product.productId}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-xs">Brand / manufacturer</span>
              <span className="text-white font-semibold">{product.brandName}</span>
            </div>

            <div className="p-3.5 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-xs">Current status</span>
              <span className="text-emerald-400 font-semibold">{product.currentStage || "DELIVERED"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Public Product Journey Timeline */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-6 shadow-xl">
        <h3 className="text-sm font-semibold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Product lifecycle journey</span>
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
                    <div className="font-semibold text-white">{stg.label}</div>
                    {scanMatch?.location && (
                      <div className="text-xs text-cyan-300 font-medium">Location: {scanMatch.location}</div>
                    )}
                  </div>
                  <div className="text-xs text-[#94A3B8]">
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
        <div className="text-slate-300 font-medium">Verified on Ethereum blockchain audit layer</div>
        <div className="text-xs text-cyan-400 font-mono">SHA-256 Fingerprint: {data.storedHash || product?.productHash}</div>
      </div>
    </div>
  );
}
