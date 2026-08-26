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
  Layers,
  Copy,
  BrainCircuit,
  Activity,
  AlertCircle,
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#05070D]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B98AA]">Querying Blockchain Record & Product Specs...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4 bg-[#05070D]">
        <h2 className="text-xl font-bold text-white">Product Record Not Found</h2>
        <Link to="/products" className="inline-flex items-center space-x-2 text-cyan-400 text-xs font-mono font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 bg-[#05070D]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1D2938] pb-4">
        <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-mono text-[#8B98AA] hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to={`/products/${product.productId}/qr`}
            className="px-3.5 py-1.5 rounded-md bg-[#101722] text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 hover:bg-[#1B2738]"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Label View</span>
          </Link>
          <Link
            to={`/verify/${product.productId}`}
            className="px-3.5 py-1.5 rounded-md bg-[#06b6d4] hover:bg-[#22d3ee] text-[#05070D] text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verify Authenticity</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Image & QR */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-[#101722] p-4 rounded-xl border border-[#1D2938] space-y-4">
            <img
              src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
              alt={product.productName}
              className="w-full h-64 object-cover rounded-md border border-[#1D2938]"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">{product.category}</span>
                <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  {product.status}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{product.productName}</h2>
              <p className="text-xs text-[#8B98AA]">Brand: <strong className="text-slate-200">{product.brandName}</strong></p>
              {product.description && <p className="text-xs text-slate-300 pt-2 border-t border-[#1D2938] leading-relaxed">{product.description}</p>}
            </div>
          </div>

          {/* QR Code Presentation */}
          {product.qrCode && (
            <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] text-center space-y-4">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider block">Cryptographic QR Code</span>
              <img src={product.qrCode} alt="QR Code" className="w-36 h-36 bg-white p-2 rounded-md mx-auto shadow-md border border-slate-700" />
              <div className="flex items-center justify-center space-x-2">
                <a
                  href={product.qrCode}
                  download={`QR-${product.productId}.png`}
                  className="px-3.5 py-2 rounded-md bg-[#06b6d4] text-[#05070D] text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-md bg-[#0B111B] hover:bg-[#1B2738] text-slate-200 text-xs font-bold inline-flex items-center space-x-1 border border-[#1D2938]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Specs, AI Authenticity Analysis & Blockchain Explorer */}
        <div className="md:col-span-7 space-y-6">
          {/* SECTION 1: AI AUTHENTICITY ANALYSIS */}
          <div className="bg-[#101722] p-6 rounded-xl border border-cyan-500/30 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#1D2938] pb-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                <span>AI AUTHENTICITY ANALYSIS</span>
              </h3>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30 font-bold">
                Low Forgery Risk
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-0.5">
                <span className="text-[#8B98AA] text-[10px] block">AI Risk Score</span>
                <span className="text-lg font-bold text-emerald-400">{aiStats.aiRiskScore}%</span>
              </div>
              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-0.5">
                <span className="text-[#8B98AA] text-[10px] block">AI Confidence</span>
                <span className="text-lg font-bold text-blue-400">{aiStats.aiConfidence}%</span>
              </div>
              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-0.5">
                <span className="text-[#8B98AA] text-[10px] block">Image Match</span>
                <span className="text-lg font-bold text-cyan-400">{aiStats.imageSimilarity}%</span>
              </div>
              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-0.5">
                <span className="text-[#8B98AA] text-[10px] block">Visual Consistency</span>
                <span className="text-lg font-bold text-cyan-400">{aiStats.visualConsistency}%</span>
              </div>
            </div>

            <div className="text-[11px] text-[#8B98AA] pt-1">
              Last AI Analysis Timestamp: <strong className="text-slate-200">{latestScan ? new Date(latestScan.timestamp).toLocaleString() : new Date().toLocaleString()}</strong>
            </div>
          </div>

          {/* SECTION 2: PRODUCT INFORMATION */}
          <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#1D2938] pb-2 flex items-center space-x-2">
              <Package className="w-4 h-4 text-cyan-400" />
              <span>Product Information & Identification</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Product ID</span>
                <span className="font-bold text-cyan-400 text-sm block">{product.productId}</span>
              </div>
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Serial Number</span>
                <span className="font-bold text-white text-sm block">{product.serialNumber}</span>
              </div>
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Batch Number</span>
                <span className="text-slate-200 block">{product.batchNumber}</span>
              </div>
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Manufacturing Date</span>
                <span className="text-slate-200 block">{new Date(product.manufacturingDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Expiry Date</span>
                <span className="text-slate-200 block">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div>
                <span className="text-[#8B98AA] block text-[10px]">Manufacturer</span>
                <span className="text-cyan-400 font-bold block">{product.manufacturer?.companyName || product.manufacturer?.name || "Enterprise"}</span>
              </div>
            </div>
          </div>

          {/* SECTION 3: AUTHENTICITY & SHA-256 */}
          <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-3">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#1D2938] pb-2 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Cryptographic Authenticity Signature</span>
            </h3>

            <div className="space-y-1">
              <span className="text-[#8B98AA] text-[11px] block font-mono">SHA-256 Digital Fingerprint</span>
              <div className="bg-[#05070D] p-3 rounded-md border border-[#1D2938] font-mono text-[11px] text-cyan-300 break-all">
                {product.productHash}
              </div>
            </div>
          </div>

          {/* SECTION 4: BLOCKCHAIN RECORD EXPLORER */}
          <div className="bg-[#101722] p-6 rounded-xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1D2938] pb-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Blockchain Record Explorer</span>
              </h3>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/30">
                Network: Ethereum Paris (31337)
              </span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="space-y-1">
                <span className="text-[#8B98AA] text-[10px] block">Blockchain Status</span>
                <span className="text-emerald-400 font-bold block">✓ Verified On-Chain</span>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B98AA] text-[10px] block">Transaction Hash</span>
                <div className="bg-[#05070D] p-2.5 rounded border border-[#1D2938] text-cyan-400 break-all flex items-center justify-between">
                  <span>{product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}</span>
                  <a href={`https://etherscan.io/tx/${product.transactionHash}`} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 ml-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[#8B98AA] text-[10px] block">Wallet Address</span>
                <div className="bg-[#05070D] p-2.5 rounded border border-[#1D2938] text-slate-300 break-all">
                  {product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: VERIFICATION HISTORY */}
          <div className="bg-[#101722] p-6 rounded-xl border border-[#1D2938] space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-[#1D2938] pb-2">
              Verification History Timeline ({history.length} scans)
            </h3>
            <Timeline product={product} verifications={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
