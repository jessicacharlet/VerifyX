import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  QrCode,
  Search,
  Camera,
  CheckCircle,
  AlertTriangle,
  PackageCheck,
  ShieldCheck,
  Truck,
  MapPin,
  CheckSquare,
  AlertOctagon,
  ArrowRight,
  RefreshCw,
  FileText,
} from "lucide-react";
import API from "../services/api";
import QRScannerModal from "../components/QRScannerModal";

const STAGE_NEXT_MAP = {
  ORDER_RECEIVED: { next: "PRODUCT_ASSIGNED", label: "Assign Product", actionText: "Assign Product to Order" },
  PRODUCT_ASSIGNED: { next: "QR_GENERATED", label: "Generate QR", actionText: "Generate & Print QR Code" },
  QR_GENERATED: { next: "PACKED", label: "Pack Product", actionText: "Confirm Packaging & Seal" },
  PACKED: { next: "QUALITY_CHECK", label: "Quality Check", actionText: "Perform Quality Check" },
  QUALITY_CHECK: { next: "DISPATCHED", label: "Dispatch Product", actionText: "Dispatch to Logistics Courier" },
  DISPATCHED: { next: "IN_TRANSIT", label: "In Transit Scan", actionText: "Record Transit Checkpoint" },
  IN_TRANSIT: { next: "DELIVERED", label: "Confirm Delivery", actionText: "Confirm Final Delivery to Customer" },
  DELIVERED: { next: "DELIVERED", label: "Delivered", actionText: "Product Already Delivered" },
};

export default function ScanPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(searchParams.get("id") || "");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [scannedProduct, setScannedProduct] = useState(null);

  // Form State for Scan Action Confirmation
  const [location, setLocation] = useState("Chennai Central Warehouse");
  const [condition, setCondition] = useState("GOOD");
  const [sealCondition, setSealCondition] = useState("INTACT");
  const [accessoriesCondition, setAccessoriesCondition] = useState("COMPLETE");
  const [damageDetected, setDamageDetected] = useState(false);
  const [damageType, setDamageType] = useState("DAMAGE");
  const [damageDescription, setDamageDescription] = useState("");
  const [replacementRequired, setReplacementRequired] = useState(false);
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    const queryId = searchParams.get("id");
    if (queryId) {
      handleLookup(queryId);
    }
  }, [searchParams]);

  const handleLookup = async (idToLookup) => {
    const target = idToLookup || inputCode;
    if (!target.trim()) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");
      setScannedProduct(null);

      let cleanId = target.trim();
      try { cleanId = decodeURIComponent(cleanId); } catch (e) {}
      if (cleanId.includes("/verify/")) cleanId = cleanId.split("/verify/")[1].split("?")[0];
      if (cleanId.includes("/track/")) cleanId = cleanId.split("/track/")[1].split("?")[0];
      cleanId = cleanId.replace(/\/+$/, "").trim();

      const res = await API.get(`/products/${encodeURIComponent(cleanId)}`);
      if (res.data && res.data.product) {
        setScannedProduct(res.data.product);
        setLocation(res.data.product.currentLocation || "Chennai Central Warehouse");
      }
    } catch (err) {
      console.error("Scan lookup error:", err);
      setError(err.response?.data?.message || `Product '${target}' not found.`);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScanned = (scannedText) => {
    let cleanCode = scannedText.trim();
    try { cleanCode = decodeURIComponent(cleanCode); } catch (e) {}
    if (cleanCode.includes("/verify/")) cleanCode = cleanCode.split("/verify/")[1].split("?")[0];
    if (cleanCode.includes("/track/")) cleanCode = cleanCode.split("/track/")[1].split("?")[0];
    cleanCode = cleanCode.replace(/\/+$/, "").trim();

    setInputCode(cleanCode);
    handleLookup(cleanCode);
  };

  const handleExecuteScan = async (targetStage) => {
    if (!scannedProduct) return;

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      const payload = {
        productId: scannedProduct.productId,
        targetStage,
        location,
        condition,
        sealCondition,
        accessoriesCondition,
        damageDetected,
        damageType: damageDetected ? damageType : undefined,
        damageDescription: damageDetected ? damageDescription : undefined,
        replacementRequired,
        remarks: remarks || `Scan completed at stage ${targetStage}`,
      };

      const res = await API.post("/scans", payload);
      if (res.data && res.data.success) {
        setSuccessMsg(`✓ Scan Event successfully recorded! Stage updated to '${targetStage}'.`);
        setScannedProduct(res.data.product);
        setRemarks("");
        setDamageDescription("");
      }
    } catch (err) {
      console.error("Execute scan error:", err);
      setError(err.response?.data?.message || "Failed to record scan event.");
    } finally {
      setLoading(false);
    }
  };

  const nextStageInfo = scannedProduct
    ? STAGE_NEXT_MAP[scannedProduct.currentStage] || { next: "IN_TRANSIT", actionText: "Update Transit Checkpoint" }
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-lg">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium">
            <QrCode className="w-3.5 h-3.5" />
            <span>EMPLOYEE MOBILE SCANNER</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Product Lifecycle Scanner</h1>
          <p className="text-xs text-[#94A3B8]">
            Scan product QR code or enter Product ID to log stage transitions and condition checks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="px-5 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-cyan-500/20"
        >
          <Camera className="w-4 h-4" />
          <span>Open Camera Scanner</span>
        </button>
      </div>

      {/* Manual Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLookup();
        }}
        className="bg-[#0D121A] p-5 rounded-xl border border-[#1E293B] space-y-3"
      >
        <label className="text-xs font-mono text-slate-300 font-medium block">
          Enter Product ID or Serial Number:
        </label>
        <div className="flex gap-2.5">
          <div className="relative flex-grow">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="e.g. VX-S21FE-000123 or PROD-AP-9901"
              className="w-full px-4 py-3 pl-10 rounded-lg bg-[#111821] border border-[#1E293B] text-white text-xs font-mono uppercase placeholder-[#64748B] focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shrink-0 transition-all border border-[#1E293B]"
          >
            {loading ? "Searching..." : "Lookup Product"}
          </button>
        </div>
      </form>

      {/* Alerts */}
      {error && (
        <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-3 font-mono">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-start space-x-3 font-mono">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Scanned Product Overview Card */}
      {scannedProduct && (
        <div className="bg-[#0D121A] rounded-xl border border-[#1E293B] p-6 space-y-6 shadow-xl">
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-semibold">{scannedProduct.productId}</div>
              <h2 className="text-lg font-bold text-white">{scannedProduct.productName}</h2>
              <div className="text-xs text-[#94A3B8] font-mono mt-0.5">
                Serial: {scannedProduct.serialNumber} • Order: {scannedProduct.orderId || "N/A"}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
                {scannedProduct.currentStage}
              </span>
              <button
                onClick={() => navigate(`/products/${scannedProduct.productId}`)}
                className="text-xs text-[#94A3B8] hover:text-white underline font-mono ml-2"
              >
                Full Details
              </button>
            </div>
          </div>

          {/* Location & Condition Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1">
              <span className="text-[#94A3B8] text-[10px] block">Current Location</span>
              <span className="text-white font-bold flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="truncate">{scannedProduct.currentLocation}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1">
              <span className="text-[#94A3B8] text-[10px] block">Product Condition</span>
              <span className={`font-bold flex items-center space-x-1.5 ${scannedProduct.condition === 'DAMAGED' ? 'text-red-400' : 'text-emerald-400'}`}>
                <CheckSquare className="w-3.5 h-3.5" />
                <span>{scannedProduct.condition}</span>
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#111821] border border-[#1E293B] space-y-1">
              <span className="text-[#94A3B8] text-[10px] block">Security SHA-256</span>
              <span className="text-cyan-300 font-mono text-[10px] truncate block">
                {scannedProduct.productHash?.substring(0, 16)}...
              </span>
            </div>
          </div>

          {/* Checkpoint Scan Action Form */}
          {scannedProduct.currentStage !== "DELIVERED" ? (
            <div className="bg-[#111821] p-5 rounded-lg border border-[#1E293B] space-y-5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <PackageCheck className="w-4 h-4 text-cyan-400" />
                  <span>Next Action Checkpoint: {nextStageInfo?.next}</span>
                </h3>
                <span className="text-xs font-mono text-cyan-400">Step {scannedProduct.currentStage} ➔ {nextStageInfo?.next}</span>
              </div>

              {/* Station Location */}
              <div className="space-y-1 text-xs">
                <label className="font-mono text-slate-300 font-medium block">Station / Facility Location:</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Chennai Packaging Station 4"
                  className="w-full px-3.5 py-2.5 rounded bg-[#0D121A] border border-[#1E293B] text-white text-xs font-mono"
                />
              </div>

              {/* Condition Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono text-slate-300 block">Package Condition:</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#0D121A] border border-[#1E293B] text-white text-xs font-mono"
                  >
                    <option value="GOOD">Good / Intact</option>
                    <option value="DAMAGED">Damaged / Crushed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300 block">Seal Condition:</label>
                  <select
                    value={sealCondition}
                    onChange={(e) => setSealCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#0D121A] border border-[#1E293B] text-white text-xs font-mono"
                  >
                    <option value="INTACT">Intact Seal</option>
                    <option value="BROKEN">Broken / Tampered Seal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-slate-300 block">Accessories Check:</label>
                  <select
                    value={accessoriesCondition}
                    onChange={(e) => setAccessoriesCondition(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#0D121A] border border-[#1E293B] text-white text-xs font-mono"
                  >
                    <option value="COMPLETE">Complete Accessories</option>
                    <option value="MISSING">Missing Items</option>
                  </select>
                </div>
              </div>

              {/* Damage & Replacement Flags */}
              <div className="pt-2 border-t border-[#1E293B] space-y-3">
                <div className="flex items-center space-x-6 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={damageDetected}
                      onChange={(e) => setDamageDetected(e.target.checked)}
                      className="rounded border-[#1E293B] text-red-500 focus:ring-0"
                    />
                    <span className="text-slate-200 font-mono">Report Damage Detected</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={replacementRequired}
                      onChange={(e) => setReplacementRequired(e.target.checked)}
                      className="rounded border-[#1E293B] text-amber-500 focus:ring-0"
                    />
                    <span className="text-slate-200 font-mono">Request Product Replacement</span>
                  </label>
                </div>

                {damageDetected && (
                  <div className="p-3 rounded bg-red-950/40 border border-red-500/30 space-y-2 text-xs">
                    <div className="flex gap-2">
                      <select
                        value={damageType}
                        onChange={(e) => setDamageType(e.target.value)}
                        className="px-3 py-1.5 rounded bg-[#0D121A] border border-[#1E293B] text-white font-mono"
                      >
                        <option value="DAMAGE">Physical Box Damage</option>
                        <option value="BROKEN_SEAL">Broken Security Seal</option>
                        <option value="MISSING_ACCESSORY">Missing Accessories</option>
                        <option value="WRONG_PRODUCT">Wrong Item</option>
                      </select>
                    </div>
                    <textarea
                      value={damageDescription}
                      onChange={(e) => setDamageDescription(e.target.value)}
                      placeholder="Describe the damage details..."
                      rows="2"
                      className="w-full px-3 py-2 rounded bg-[#0D121A] border border-[#1E293B] text-white font-mono text-xs"
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Remarks & Confirm Action */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-300 block">Scan Remarks (Optional):</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Scanned and confirmed by operator"
                  className="w-full px-3.5 py-2 rounded bg-[#0D121A] border border-[#1E293B] text-white text-xs font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => handleExecuteScan(nextStageInfo?.next)}
                disabled={loading}
                className="w-full py-3.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#070A0F] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-500/20"
              >
                <CheckCircle className="w-4 h-4" />
                <span>CONFIRM SCAN: {nextStageInfo?.actionText}</span>
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-emerald-400">PRODUCT LIFECYCLE COMPLETE</div>
              <p className="text-xs text-[#94A3B8] font-mono">This product has reached its final DELIVERED stage.</p>
            </div>
          )}
        </div>
      )}

      {/* QR Scanner Camera Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQRScanned}
      />
    </div>
  );
}
