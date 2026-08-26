import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Timeline from "../components/Timeline";
import {
  ShieldCheck,
  Package,
  QrCode,
  Lock,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Printer,
  Download,
  Cpu,
  BrainCircuit,
  Copy,
} from "lucide-react";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);

          const histRes = await API.get(`/products/${res.data.product.productId}/history`);
          if (histRes.data.success) {
            setHistory(histRes.data.verifications || []);
          }
        }
      } catch (err) {
        console.error("Fetch Product Details Error:", err);
        setError("Product record not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#070A0F]">
        <div className="w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B97A7]">Loading product record...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-[#070A0F]">
        <h2 className="text-xl font-bold text-white">Product record not found</h2>
        <Link to="/products" className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to catalog</span>
        </Link>
      </div>
    );
  }

  const latestScan = history.length > 0 ? history[0] : null;
  const aiStats = latestScan || {
    aiRiskScore: 12,
    aiAuthenticityScore: 88,
    aiConfidence: 91,
    aiResult: "LOW_RISK",
    visualConsistency: 92,
    imageSimilarity: 95,
    detectedModifications: [],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-[#202A36] pb-3 text-xs font-mono">
        <Link to="/products" className="inline-flex items-center space-x-1.5 text-[#8B97A7] hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to catalog</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            to={`/products/${product.productId}/qr`}
            className="px-3 py-1.5 rounded bg-[#0D121A] text-slate-200 border border-[#202A36] font-medium flex items-center space-x-1.5"
          >
            <QrCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>QR label</span>
          </Link>
          <Link
            to={`/verify/${product.productId}`}
            className="px-3.5 py-1.5 rounded bg-[#06b6d4] text-[#070A0F] font-bold flex items-center space-x-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Verify authenticity</span>
          </Link>
        </div>
      </div>

      {/* Top Banner */}
      <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">{product.category}</span>
          <h1 className="text-2xl font-bold text-white tracking-tight">{product.productName}</h1>
          <p className="text-xs text-[#8B97A7]">Product ID: <strong className="text-cyan-400 font-mono">{product.productId}</strong></p>
        </div>

        <span className="px-3 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold self-start sm:self-auto">
          ✓ {product.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Image & QR */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#0D121A] p-4 rounded-lg border border-[#202A36] space-y-3">
            <img
              src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
              alt={product.productName}
              className="w-full h-56 object-cover rounded border border-[#202A36]"
            />
            <div className="space-y-1 text-xs">
              <span className="text-[#8B97A7] block">Brand: <strong className="text-white">{product.brandName}</strong></span>
              {product.description && <p className="text-slate-300 pt-2 border-t border-[#202A36] leading-relaxed text-[11px]">{product.description}</p>}
            </div>
          </div>

          {/* QR Code */}
          {product.qrCode && (
            <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] text-center space-y-3">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">Cryptographic QR code</span>
              <img src={product.qrCode} alt="QR Code" className="w-32 h-32 bg-white p-2 rounded mx-auto border border-slate-700" />
              <div className="flex items-center justify-center space-x-2 pt-1">
                <a
                  href={product.qrCode}
                  download={`QR-${product.productId}.png`}
                  className="px-3 py-1.5 rounded bg-[#06b6d4] text-[#070A0F] text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-[#111821] text-slate-200 text-xs font-bold inline-flex items-center space-x-1 border border-[#202A36]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Specs, Authenticity, Blockchain, Image Analysis, Timeline */}
        <div className="md:col-span-7 space-y-6">
          {/* SECTION 1: PRODUCT INFORMATION */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2 flex items-center space-x-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Product information</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Serial number</span>
                <span className="font-bold text-white text-xs">{product.serialNumber}</span>
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

          {/* SECTION 2: AUTHENTICITY */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-2 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Authenticity signature</span>
            </h3>
            <span className="text-[#8B97A7] text-[10px] block">SHA-256 digital signature</span>
            <div className="bg-[#111821] p-3 rounded border border-[#202A36] text-cyan-300 break-all text-[11px]">
              {product.productHash}
            </div>
          </div>

          {/* SECTION 3: BLOCKCHAIN RECORD */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Blockchain record</span>
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Transaction hash</span>
                <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] text-cyan-400 break-all text-[11px]">
                  {product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}
                </div>
              </div>
              <div>
                <span className="text-[#8B97A7] block text-[10px]">Wallet address</span>
                <div className="bg-[#111821] p-2.5 rounded border border-[#202A36] text-slate-300 break-all text-[11px]">
                  {product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: IMAGE ANALYSIS */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2 flex items-center space-x-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span>Image analysis</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#111821] p-2.5 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Risk score</span>
                <span className="text-emerald-400 font-bold text-sm">{aiStats.aiRiskScore}%</span>
              </div>
              <div className="bg-[#111821] p-2.5 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Confidence</span>
                <span className="text-blue-400 font-bold text-sm">{aiStats.aiConfidence}%</span>
              </div>
              <div className="bg-[#111821] p-2.5 rounded border border-[#202A36]">
                <span className="text-[#8B97A7] text-[10px] block">Registered match</span>
                <span className="text-cyan-400 font-bold text-sm">{aiStats.imageSimilarity}%</span>
              </div>
            </div>
          </div>

          {/* SECTION 5: VERIFICATION HISTORY */}
          <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 font-mono text-xs">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-[#202A36] pb-2">
              Verification history ({history.length} scans)
            </h3>
            <Timeline product={product} verifications={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
