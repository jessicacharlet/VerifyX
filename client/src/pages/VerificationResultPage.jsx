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
} from "lucide-react";

export default function VerificationResultPage() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'blockchain' | 'timeline'

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white">Verifying Cryptographic Digital Signature...</h3>
          <p className="text-xs text-slate-400">Querying Ethereum Smart Contract & SHA-256 Ledger...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Verification Error</h2>
        <p className="text-slate-400 text-sm">{error || "An unexpected error occurred during verification."}</p>
        <Link
          to="/verify"
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Hub</span>
        </Link>
      </div>
    );
  }

  const { isAuthentic, product, message, reason, verificationId, computedHash, storedHash, blockchain, totalVerifications } = result;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/verify"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Verification Portal</span>
        </Link>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Ref ID: {verificationId}
        </span>
      </div>

      {/* AUTHENTIC PRODUCT SCREEN */}
      {isAuthentic && product ? (
        <div className="space-y-8">
          {/* Main Authentic Banner */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 bg-emerald-950/20 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>VERIFIED AUTHENTIC</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">✓ Authentic Product Confirmed</h1>
                  <p className="text-xs text-slate-300">
                    Product SHA-256 signature matches 100% with Ethereum Smart Contract on-chain record.
                  </p>
                </div>
              </div>

              {/* Verification Counter Badge */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center shrink-0 min-w-[140px]">
                <div className="text-xl font-bold text-emerald-400">{totalVerifications || 1}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total Scans</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Product Overview
            </button>
            <button
              onClick={() => setActiveTab("blockchain")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "blockchain"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Blockchain Security
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "timeline"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              Verification History
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Image & Quick Info */}
              <div className="md:col-span-5 space-y-6">
                <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-4">
                  <img
                    src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
                    alt={product.productName}
                    className="w-full h-64 object-cover rounded-xl border border-slate-800"
                  />
                  <div className="space-y-1 text-left">
                    <span className="text-xs text-blue-400 font-semibold uppercase">{product.category}</span>
                    <h3 className="text-xl font-bold text-white">{product.productName}</h3>
                    <p className="text-xs text-slate-400">Brand: {product.brandName}</p>
                  </div>
                </div>

                {/* QR Preview Card */}
                {product.qrCode && (
                  <div className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
                    <img src={product.qrCode} alt="QR Code" className="w-20 h-20 bg-white p-1 rounded-lg" />
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-200 block">Verified QR Code</span>
                      <span className="text-slate-400 block text-[11px]">Unique Product Identifier</span>
                      <span className="font-mono text-[10px] text-blue-400 block break-all">{product.productId}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="md:col-span-7 space-y-6">
                <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                    Verified Product Metadata
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Product ID</span>
                      <span className="text-slate-200 font-mono font-bold block">{product.productId}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Serial Number</span>
                      <span className="text-slate-200 font-mono font-bold block">{product.serialNumber}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Batch Number</span>
                      <span className="text-slate-200 font-mono block">{product.batchNumber}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-500 font-medium block">Manufacturing Date</span>
                      <span className="text-slate-200 block">
                        {new Date(product.manufacturingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <span className="text-slate-500 font-medium block">Authorized Manufacturer</span>
                      <span className="text-blue-400 font-semibold block">
                        {product.manufacturer?.companyName || product.manufacturer?.name || "Verified Enterprise"}
                      </span>
                    </div>
                    {product.description && (
                      <div className="col-span-2 space-y-1">
                        <span className="text-slate-500 font-medium block">Description</span>
                        <p className="text-slate-300 text-xs leading-relaxed">{product.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Crypto Hash Verification Box */}
                <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Cryptographic SHA-256 Verification</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      Match 100%
                    </span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px] text-slate-300 break-all">
                    {product.productHash}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BLOCKCHAIN */}
          {activeTab === "blockchain" && (
            <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-purple-400" />
                    <span>On-Chain Ethereum Ledger Record</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Smart contract proof of registration on Ethereum compatible network.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
                  Network: Hardhat Local / Ethereum
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Blockchain Transaction Hash</span>
                  <span className="font-mono text-purple-400 break-all block">
                    {blockchain?.transactionHash || product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                  </span>
                  <a
                    href={`https://etherscan.io/tx/${product.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-purple-400 hover:text-purple-300 font-bold pt-1"
                  >
                    <span>View Blockchain Transaction</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Registered Owner Wallet Address</span>
                  <span className="font-mono text-slate-200 break-all block">
                    {blockchain?.ownerWallet || product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                  </span>
                  <span className="text-emerald-400 font-bold block pt-1">Active Status: Verified Active</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">Product Lifecycle & Scans Timeline</h3>
              <Timeline product={product} verifications={history} />
            </div>
          )}
        </div>
      ) : (
        /* FAKE / COUNTERFEIT PRODUCT SCREEN */
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-red-500/50 bg-red-950/20 text-center space-y-8 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-red-600/30 animate-bounce">
            <ShieldAlert className="w-12 h-12" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold tracking-widest uppercase">
              Security Warning
            </span>
            <h1 className="text-3xl font-extrabold text-white">⚠ PRODUCT COULD NOT BE AUTHENTICATED</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {message || "The product information does not match the authenticity record stored on the blockchain."}
            </p>
          </div>

          {/* Reason Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-red-800/60 max-w-lg mx-auto text-left space-y-3">
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Authentication Failure Analysis</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Product ID / Serial queried: <code className="text-white font-mono">{productId}</code></span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Reason: {reason || "UNREGISTERED_OR_TAMPERED_RECORD"}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-red-400 font-bold">•</span>
                <span>Advice: Do not complete purchase or accept items failing blockchain SHA-256 verification. Report potential counterfeit goods to manufacturer safety.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Link
              to="/verify"
              className="px-8 py-3.5 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 shadow-lg inline-flex items-center space-x-2 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Another Product Search</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
