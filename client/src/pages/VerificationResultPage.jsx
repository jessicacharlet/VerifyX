import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Timeline from "../components/Timeline";
import {
  ShieldCheck,
  ShieldAlert,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-[#050816]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-1 font-mono">
          <h3 className="text-sm font-bold text-white">Verifying Cryptographic Digital Signature...</h3>
          <p className="text-xs text-slate-400">Querying Ethereum Smart Contract & SHA-256 Ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 bg-[#050816]">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Verification Error</h2>
        <p className="text-slate-400 text-xs">{error || "An unexpected error occurred during verification."}</p>
        <Link
          to="/verify"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#0D1528] border border-[#1E2A47] text-white text-xs font-mono font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Hub</span>
        </Link>
      </div>
    );
  }

  const { isAuthentic, product, message, reason, verificationId, computedHash, storedHash, blockchain, totalVerifications } = result;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 bg-[#050816]">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/verify"
          className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Portal</span>
        </Link>
        <span className="text-[11px] font-mono text-purple-400 bg-[#0D1528] px-3 py-1 rounded border border-[#1E2A47]">
          Ref ID: {verificationId}
        </span>
      </div>

      {/* AUTHENTIC RESULT DISPLAY */}
      {isAuthentic && product ? (
        <div className="space-y-8">
          {/* Main Green Banner */}
          <div className="bg-[#0D1528] p-8 rounded-2xl border border-emerald-500/40 relative overflow-hidden shadow-2xl green-glow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center space-x-5">
                {/* Large Green Check Icon */}
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 shrink-0">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>BLOCKCHAIN VERIFIED</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">AUTHENTIC PRODUCT</h1>
                  <p className="text-xs text-slate-300">
                    Product SHA-256 digital signature matches 100% with Ethereum Smart Contract on-chain record.
                  </p>
                </div>
              </div>

              {/* Total Scans Counter */}
              <div className="p-3 rounded-xl bg-[#0A1020] border border-[#1E2A47] text-center shrink-0 min-w-[130px]">
                <div className="text-xl font-bold text-emerald-400 font-mono">{totalVerifications || 1}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono font-semibold">Total Scans</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-[#1E2A47] pb-3 text-xs font-mono">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0D1528]"
              }`}
            >
              Product Information
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === "blockchain"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0D1528]"
              }`}
            >
              Blockchain Record
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                activeTab === "timeline"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#0D1528]"
              }`}
            >
              Verification History
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-5 space-y-6">
                <div className="bg-[#0D1528] p-4 rounded-2xl border border-[#1E2A47] space-y-3">
                  <img
                    src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
                    alt={product.productName}
                    className="w-full h-60 object-cover rounded-xl border border-[#1E2A47]"
                  />
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-mono text-purple-400 font-bold uppercase">{product.category}</span>
                    <h3 className="text-lg font-bold text-white">{product.productName}</h3>
                    <p className="text-xs text-slate-400">Brand: {product.brandName}</p>
                  </div>
                </div>

                {product.qrCode && (
                  <div className="bg-[#0D1528] p-4 rounded-2xl border border-[#1E2A47] flex items-center space-x-4">
                    <img src={product.qrCode} alt="QR Code" className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-700" />
                    <div className="space-y-1 text-xs font-mono">
                      <span className="font-bold text-slate-200 block">Verified QR Label</span>
                      <span className="text-slate-400 block text-[10px]">Product Identifier</span>
                      <span className="text-purple-400 block break-all text-[10px] font-bold">{product.productId}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-7 space-y-6">
                <div className="bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-4">
                  <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#1E2A47] pb-2">
                    Verified Product Metadata
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Product ID</span>
                      <span className="text-purple-400 font-bold block text-sm">{product.productId}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Serial Number</span>
                      <span className="text-white font-bold block text-sm">{product.serialNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Batch Number</span>
                      <span className="text-slate-200 block">{product.batchNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Manufacturing Date</span>
                      <span className="text-slate-200 block">{new Date(product.manufacturingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block text-[10px]">Manufacturer</span>
                      <span className="text-purple-400 font-bold block">{product.manufacturer?.companyName || product.manufacturer?.name || "Verified Enterprise"}</span>
                    </div>
                    {product.description && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px]">Description</span>
                        <p className="text-slate-300 text-xs font-sans leading-relaxed">{product.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[#0D1528] p-6 rounded-2xl border border-[#1E2A47] space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>SHA-256 Signature Verification</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      Match 100%
                    </span>
                  </div>
                  <div className="bg-[#050816] p-3 rounded-xl border border-[#1E2A47] text-[11px] text-purple-300 break-all">
                    {product.productHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOCKCHAIN */}
          {activeTab === "blockchain" && (
            <div className="bg-[#0D1528] p-8 rounded-2xl border border-purple-500/30 space-y-6 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#1E2A47] pb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <span>On-Chain Ethereum Ledger Record</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Smart contract proof of product registration on Ethereum blockchain.
                  </p>
                </div>
                <span className="px-3 py-1 rounded bg-[#0A1020] text-purple-400 border border-purple-500/30 text-xs font-bold">
                  Network: Ethereum Paris (31337)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-[#050816] border border-[#1E2A47] space-y-2">
                  <span className="text-slate-500 block text-[10px]">Blockchain Transaction Hash</span>
                  <span className="text-cyan-400 break-all block">
                    {blockchain?.transactionHash || product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                  </span>
                  <a
                    href={`https://etherscan.io/tx/${product.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-bold pt-1"
                  >
                    <span>View Transaction Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-[#050816] border border-[#1E2A47] space-y-2">
                  <span className="text-slate-500 block text-[10px]">Registered Owner Wallet</span>
                  <span className="text-slate-200 break-all block">
                    {blockchain?.ownerWallet || product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                  </span>
                  <span className="text-emerald-400 font-bold block pt-1">Status: Verified Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="bg-[#0D1528] p-8 rounded-2xl border border-[#1E2A47] space-y-4">
              <h3 className="text-sm font-mono font-bold text-white border-b border-[#1E2A47] pb-3">Product Lifecycle & Verification History</h3>
              <Timeline product={product} verifications={history} />
            </div>
          )}
        </div>
      ) : (
        /* COUNTERFEIT / INVALID RESULT DISPLAY */
        <div className="bg-[#0D1528] p-8 sm:p-12 rounded-2xl border border-red-500/50 bg-red-950/20 text-center space-y-8 shadow-2xl red-glow">
          {/* Large Red Warning Icon */}
          <div className="w-20 h-20 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-600/40">
            <ShieldAlert className="w-12 h-12" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded bg-red-950/80 text-red-400 border border-red-500/40 text-xs font-mono font-bold uppercase tracking-widest">
              SECURITY FAILURE ALERT
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">PRODUCT NOT AUTHENTIC</h1>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {message || "The product information does not match the authenticity record stored on the blockchain."}
            </p>
          </div>

          {/* Reason Box */}
          <div className="p-6 rounded-xl bg-[#0A1020] border border-red-500/30 max-w-lg mx-auto text-left space-y-3 font-mono text-xs">
            <h4 className="font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Authentication Failure Reason</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Queried Product ID / Serial: <code className="text-white font-bold">{productId}</code></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Failure Code: <strong className="text-red-400">{reason || "HASH_MISMATCH_OR_UNREGISTERED"}</strong></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span className="text-slate-400 font-sans">Advice: Do not accept or purchase items failing cryptographic hash verification. Contact manufacturer safety.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <Link
              to="/verify"
              className="px-8 py-3 rounded-xl font-bold text-xs text-white bg-[#0A1020] hover:bg-[#111B32] border border-[#1E2A47] inline-flex items-center space-x-2 transition-all font-mono"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Another Product Lookup</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
