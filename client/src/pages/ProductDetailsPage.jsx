import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  QrCode,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Printer,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import API from "../services/api";

const STAGES = [
  "ORDER_RECEIVED",
  "PRODUCT_ASSIGNED",
  "QR_GENERATED",
  "PACKED",
  "QUALITY_CHECK",
  "DISPATCHED",
  "IN_TRANSIT",
  "DELIVERED",
];

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(`/products/${encodeURIComponent(id)}`);
      if (res.data && res.data.product) {
        setProduct(res.data.product);

        // Fetch scan history
        try {
          const scanRes = await API.get(`/scans/products/${res.data.product.productId}/scans`);
          if (scanRes.data && scanRes.data.scans) {
            setScans(scanRes.data.scans);
          }
        } catch (sErr) {
          console.warn("Scan history fetch error:", sErr);
        }
      }
    } catch (err) {
      console.error("Fetch product error:", err);
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-mono text-[#94A3B8]">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-4 font-mono">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <div className="text-base font-bold text-white">Product Not Found</div>
        <p className="text-xs text-[#94A3B8]">{error || `Product '${id}' does not exist.`}</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-[#111821] text-cyan-400 rounded border border-[#1E293B] text-xs">
          Back to Products List
        </Link>
      </div>
    );
  }

  const currentStageIndex = STAGES.indexOf(product.currentStage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono">
      {/* Header Banner */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{product.productName}</span>
            <span className="px-3 py-1 rounded text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {product.currentStage}
            </span>
          </div>
          <div className="text-xs text-[#94A3B8]">
            Product ID: <strong className="text-cyan-400">{product.productId}</strong> • Serial: {product.serialNumber} • Order: {product.orderId || "N/A"}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/products/${product.productId}/qr`}
            className="px-4 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Box QR</span>
          </Link>

          <Link
            to={`/scan?id=${product.productId}`}
            className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-bold text-xs flex items-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Checkpoint</span>
          </Link>
        </div>
      </div>

      {/* Main Grid Specs & Condition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Specs Card */}
        <div className="lg:col-span-8 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>Physical Product Specifications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Brand & Category</span>
              <span className="text-white font-bold">{product.brandName} • {product.category}</span>
            </div>

            <div className="p-3 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Batch Number</span>
              <span className="text-white font-bold">{product.batchNumber}</span>
            </div>

            <div className="p-3 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Warehouse Location</span>
              <span className="text-cyan-300 font-bold">{product.warehouse}</span>
            </div>

            <div className="p-3 rounded bg-[#111821] border border-[#1E293B]">
              <span className="text-[#94A3B8] block text-[10px]">Current Location</span>
              <span className="text-cyan-300 font-bold">{product.currentLocation}</span>
            </div>
          </div>
        </div>

        {/* Condition Card */}
        <div className="lg:col-span-4 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Product Condition & Status</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
              <span className="text-[#94A3B8]">Box Condition:</span>
              <span className={product.condition === "DAMAGED" ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                {product.condition}
              </span>
            </div>

            <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
              <span className="text-[#94A3B8]">Damage Reported:</span>
              <span className={product.damageDetected ? "text-red-400 font-bold" : "text-slate-300"}>
                {product.damageDetected ? "YES" : "NO"}
              </span>
            </div>

            <div className="p-3 rounded bg-[#111821] border border-[#1E293B] flex justify-between">
              <span className="text-[#94A3B8]">Replacement Status:</span>
              <span className={product.replacementRequired ? "text-amber-400 font-bold" : "text-slate-300"}>
                {product.replacementRequired ? "REQUIRED" : "NONE"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chronological 8-Stage Lifecycle Timeline */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-6 shadow-xl">
        <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Product Lifecycle Progression Timeline</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          {STAGES.map((st, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = st === product.currentStage;

            return (
              <div
                key={st}
                className={`p-3 rounded-lg border text-center space-y-1.5 transition-all ${
                  isCurrent
                    ? "bg-cyan-950/80 border-cyan-400 text-white font-bold shadow-lg shadow-cyan-500/20"
                    : isCompleted
                    ? "bg-[#111821] border-emerald-500/40 text-emerald-300"
                    : "bg-[#0A0E17] border-[#1E293B] text-slate-500"
                }`}
              >
                <div className="text-[10px] font-mono text-[#64748B]">0{idx + 1}</div>
                <div className="text-[11px] leading-tight font-semibold uppercase">{st.replace(/_/g, " ")}</div>
                {isCompleted && (
                  <CheckCircle className={`w-3.5 h-3.5 mx-auto ${isCurrent ? 'text-cyan-400' : 'text-emerald-400'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Scan History Log Table */}
      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white border-b border-[#1E293B] pb-3 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <span>Scan Audit Trail History ({scans.length} events)</span>
        </h3>

        {scans.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#94A3B8]">No scan events recorded yet for this product.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111821] text-[#94A3B8] uppercase border-b border-[#1E293B]">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-slate-200">
                {scans.map((s) => (
                  <tr key={s._id} className="hover:bg-[#111821]/60">
                    <td className="px-4 py-3 text-[#94A3B8]">{new Date(s.timestamp || s.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-cyan-400">{s.stage}</td>
                    <td className="px-4 py-3 text-cyan-300 font-semibold">{s.location}</td>
                    <td className="px-4 py-3">{s.employeeName}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{s.condition}</td>
                    <td className="px-4 py-3 text-[#94A3B8]">{s.remarks || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Blockchain Proof Footer */}
      <div className="bg-[#0D121A] p-5 rounded-xl border border-cyan-500/30 space-y-2 text-xs">
        <div className="text-white font-bold flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Cryptographic SHA-256 Audit Signature</span>
        </div>
        <div className="p-3 rounded bg-[#111821] text-cyan-300 font-mono text-[11px] break-all border border-[#1E293B]">
          {product.productHash}
        </div>
      </div>
    </div>
  );
}
