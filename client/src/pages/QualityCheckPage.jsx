import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle, AlertTriangle, Search, QrCode, ArrowRight } from "lucide-react";
import API from "../services/api";

export default function QualityCheckPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchQCQueue();
  }, []);

  const fetchQCQueue = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/products");
      if (res.data && res.data.products) {
        // Filter products currently at QUALITY_CHECK or PACKED stage
        const qcList = res.data.products.filter(
          (p) => p.currentStage === "QUALITY_CHECK" || p.currentStage === "PACKED"
        );
        setProducts(qcList);
      }
    } catch (err) {
      console.error("Fetch QC products error:", err);
      setError("Failed to fetch Quality Control inspection queue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-mono">
      {/* Header */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>QUALITY CONTROL WORKBENCH</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Quality Check Inspection Queue</h1>
          <p className="text-xs text-[#94A3B8]">
            Inspect packed products, check security seals & serial integrity, and approve for dispatch.
          </p>
        </div>

        <Link
          to="/scan"
          className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <QrCode className="w-4 h-4" />
          <span>Open QC Scanner</span>
        </Link>
      </div>

      {/* QC Items Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#94A3B8]">Loading Quality Control inspection queue...</div>
      ) : error ? (
        <div className="p-6 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">{error}</div>
      ) : products.length === 0 ? (
        <div className="p-12 text-center bg-[#0D121A] rounded-xl border border-[#1E293B] space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <div className="text-sm font-bold text-white">QC Queue Empty</div>
          <p className="text-xs text-[#94A3B8]">All packed products have passed quality inspection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod) => (
            <div key={prod._id} className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-4 shadow-xl relative">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <span className="text-xs font-bold text-cyan-400">{prod.productId}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                  {prod.currentStage}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">{prod.productName}</div>
                <div className="text-xs text-[#94A3B8]">Serial: {prod.serialNumber}</div>
                <div className="text-xs text-[#94A3B8]">Order: {prod.orderId || "N/A"}</div>
              </div>

              <div className="p-3 rounded bg-[#111821] border border-[#1E293B] text-xs space-y-1">
                <div className="text-[#94A3B8]">Location: <span className="text-white">{prod.currentLocation}</span></div>
                <div className="text-[#94A3B8]">Condition: <span className="text-emerald-400">{prod.condition}</span></div>
              </div>

              <Link
                to={`/scan?id=${prod.productId}`}
                className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Inspect & Complete Quality Check</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
