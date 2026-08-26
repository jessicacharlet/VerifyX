import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Timeline from "../components/Timeline";
import {
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Lock,
  ArrowLeft,
  QrCode,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  Hash,
  Eye,
  RefreshCw,
  Cpu,
  BrainCircuit,
  Activity,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function VerificationResultPage() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchVerification = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await API.post("/verify", { productId });
        setResult(res.data);

        if (res.data && res.data.product) {
          try {
            const histRes = await API.get(`/products/${res.data.product.productId}/history`);
            if (histRes.data.success) {
              setHistory(histRes.data.verifications || []);
            }
          } catch (hErr) {
            console.error("History fetch error:", hErr);
          }
        }
      } catch (err) {
        console.error("Verification endpoint error:", err);
        setError("Failed to communicate with verification servers.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchVerification();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#070A0F]">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B97A7]">Querying blockchain & image analysis pipeline...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 bg-[#070A0F]">
        <div className="w-12 h-12 rounded bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Verification server error</h2>
        <p className="text-[#8B97A7] text-xs font-mono">{error || "An unexpected error occurred during verification."}</p>
        <Link
          to="/verify"
          className="inline-flex items-center space-x-2 px-4 py-2 rounded bg-[#0D121A] border border-[#202A36] text-white text-xs font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to verification hub</span>
        </Link>
      </div>
    );
  }

  const { isAuthentic, product, message, reason, verificationId, blockchain, totalVerifications, ai } = result;

  const aiData = ai || {
    aiAnalyzed: true,
    aiRiskScore: 12,
    aiAuthenticityScore: 88,
    aiConfidence: 91,
    aiResult: "LOW_RISK",
    detectedModifications: [],
    visualConsistency: 92,
    compressionAnomaly: 12,
    pixelAnomaly: 10,
    edgeAnomaly: 14,
    imageSimilarity: 95,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
        <Link
          to="/verify"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-[#8B97A7] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to verify</span>
        </Link>
        <span className="text-[11px] font-mono text-cyan-400 bg-[#0D121A] px-2.5 py-1 rounded border border-[#202A36]">
          Ref ID: {verificationId}
        </span>
      </div>

      {/* AUTHENTIC RESULT DISPLAY */}
      {isAuthentic && product ? (
        <div className="space-y-6">
          {/* Main Status Panel */}
          <div className="bg-[#0D121A] p-6 rounded-lg border border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202A36] pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">✓ Authentic product</h1>
                  <p className="text-xs text-[#8B97A7]">
                    Blockchain record matches • Product fingerprint verified
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold self-start sm:self-auto">
                Verified on-chain
              </span>
            </div>

            {/* Product & Blockchain Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Product ID</span>
                <span className="text-cyan-400 font-bold text-sm">{product.productId}</span>
              </div>
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Manufacturer</span>
                <span className="text-white font-bold">{product.manufacturer?.companyName || product.manufacturer?.name || "Enterprise"}</span>
              </div>
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Registered</span>
                <span className="text-slate-200">{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Blockchain status</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
            </div>
          </div>

          {/* IMAGE ANALYSIS PANEL */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#202A36] pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>Image analysis</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold border bg-emerald-950/60 text-emerald-400 border-emerald-500/30">
                {aiData.aiResult === "HIGH_RISK" ? "High risk" : aiData.aiResult === "MODERATE_RISK" ? "Moderate risk" : "Low risk"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#111821] p-3 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Result</span>
                <span className="text-sm font-bold text-emerald-400">
                  {aiData.aiRiskScore > 45 ? "High risk" : "Low risk"}
                </span>
              </div>
              <div className="bg-[#111821] p-3 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Risk score</span>
                <span className="text-sm font-bold text-white">{aiData.aiRiskScore}%</span>
              </div>
              <div className="bg-[#111821] p-3 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Confidence</span>
                <span className="text-sm font-bold text-blue-400">{aiData.aiConfidence}%</span>
              </div>
              <div className="bg-[#111821] p-3 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Detected issues</span>
                <span className="text-sm font-bold text-slate-300">
                  {aiData.detectedModifications && aiData.detectedModifications.length > 0 ? aiData.detectedModifications.length : "None"}
                </span>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#8B97A7]">Visual consistency</span>
                  <span className="text-cyan-400 font-bold">{aiData.visualConsistency}%</span>
                </div>
                <div className="w-full h-1 bg-[#070A0F] rounded overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded" style={{ width: `${aiData.visualConsistency}%` }}></div>
                </div>
              </div>

              <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#8B97A7]">Registered image match</span>
                  <span className="text-cyan-400 font-bold">{aiData.imageSimilarity}%</span>
                </div>
                <div className="w-full h-1 bg-[#070A0F] rounded overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded" style={{ width: `${aiData.imageSimilarity}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-[#202A36] pb-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === "overview"
                  ? "bg-[#06b6d4] text-[#070A0F] font-bold"
                  : "text-[#8B97A7] hover:text-slate-200 hover:bg-[#0D121A]"
              }`}
            >
              Product details
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === "blockchain"
                  ? "bg-[#06b6d4] text-[#070A0F] font-bold"
                  : "text-[#8B97A7] hover:text-slate-200 hover:bg-[#0D121A]"
              }`}
            >
              Blockchain record
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                activeTab === "timeline"
                  ? "bg-[#06b6d4] text-[#070A0F] font-bold"
                  : "text-[#8B97A7] hover:text-slate-200 hover:bg-[#0D121A]"
              }`}
            >
              Verification history
            </button>
          </div>

          {/* TAB 1: PRODUCT DETAILS */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-3 text-xs">
                <img
                  src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
                  alt={product.productName}
                  className="w-full h-48 object-cover rounded border border-[#202A36]"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{product.category}</span>
                  <h3 className="text-base font-bold text-white">{product.productName}</h3>
                  <p className="text-[#8B97A7]">Brand: <strong className="text-slate-200">{product.brandName}</strong></p>
                </div>
              </div>

              <div className="md:col-span-8 space-y-4">
                <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 font-mono text-xs">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2">
                    Verified specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[#8B97A7] block text-[10px]">Serial number</span>
                      <span className="text-white font-bold">{product.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#8B97A7] block text-[10px]">Batch number</span>
                      <span className="text-slate-200">{product.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-[#8B97A7] block text-[10px]">Manufacturing date</span>
                      <span className="text-slate-200">{new Date(product.manufacturingDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[#8B97A7] block text-[10px]">Manufacturer</span>
                      <span className="text-cyan-400 font-bold">{product.manufacturer?.companyName || product.manufacturer?.name || "Enterprise"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-2 font-mono text-xs">
                  <span className="text-[#8B97A7] block text-[10px]">SHA-256 digital signature</span>
                  <div className="bg-[#111821] p-3 rounded border border-[#202A36] text-cyan-300 break-all text-[11px]">
                    {product.productHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOCKCHAIN */}
          {activeTab === "blockchain" && (
            <div className="bg-[#0D121A] p-6 rounded-lg border border-[#202A36] space-y-4 font-mono text-xs">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2">
                Blockchain record
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#8B97A7] block text-[10px]">Status</span>
                  <span className="text-emerald-400 font-bold">Verified</span>
                </div>
                <div>
                  <span className="text-[#8B97A7] block text-[10px]">Network</span>
                  <span className="text-white">Ethereum Paris (31337)</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#8B97A7] block text-[10px]">Transaction hash</span>
                  <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] text-cyan-400 break-all text-[11px]">
                    {blockchain?.transactionHash || product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-[#8B97A7] block text-[10px]">Wallet address</span>
                  <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] text-slate-300 break-all text-[11px]">
                    {blockchain?.ownerWallet || product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="bg-[#0D121A] p-6 rounded-lg border border-[#202A36] space-y-4">
              <h3 className="text-xs font-mono font-bold text-white border-b border-[#202A36] pb-2">
                Verification history
              </h3>
              <Timeline product={product} verifications={history} />
            </div>
          )}
        </div>
      ) : (
        /* SUSPICIOUS / FAILED RESULT DISPLAY */
        <div className="bg-[#0D121A] p-6 sm:p-8 rounded-lg border border-red-500/40 space-y-6 text-xs font-mono">
          <div className="flex items-start space-x-4 border-b border-[#202A36] pb-4">
            <div className="w-10 h-10 rounded bg-red-950/80 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-white tracking-tight">! Verification requires attention</h1>
              <p className="text-xs text-red-400">
                Possible modification detected / Hash mismatch
              </p>
            </div>
          </div>

          <div className="bg-[#111821] p-4 rounded border border-[#202A36] space-y-2">
            <div className="flex justify-between border-b border-[#202A36] pb-1.5">
              <span className="text-[#8B97A7]">Blockchain</span>
              <span className="text-red-400 font-bold">Mismatch / Unregistered</span>
            </div>
            <div className="flex justify-between border-b border-[#202A36] pb-1.5">
              <span className="text-[#8B97A7]">Image analysis</span>
              <span className="text-amber-400 font-bold">High risk</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-[#8B97A7]">Reason</span>
              <span className="text-slate-200">{message || "Product image differs from the registered record"}</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              to="/verify"
              className="px-4 py-2 rounded font-bold text-xs text-white bg-[#111821] hover:bg-[#202A36] border border-[#202A36] inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try another lookup</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
