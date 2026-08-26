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
  Calendar,
  Layers,
  User,
  ArrowRightLeft,
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

          // Fetch verifications history
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Loading Product Specifications & Ledger...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <p className="text-slate-400 text-xs">{error || "Unable to locate product details."}</p>
        <Link to="/products" className="inline-flex items-center space-x-2 text-blue-400 text-xs font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Product Catalog</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to={`/products/${product.productId}/qr`}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 hover:bg-purple-600/30"
          >
            <QrCode className="w-4 h-4" />
            <span>QR Label View</span>
          </Link>
          <Link
            to={`/verify/${product.productId}`}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center space-x-1.5 hover:bg-blue-500 shadow-md shadow-blue-600/20"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Verify Authenticity</span>
          </Link>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Product Media Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="glass-card p-4 rounded-3xl border border-slate-800 space-y-4">
            <img
              src={product.productImage || "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80"}
              alt={product.productName}
              className="w-full h-72 object-cover rounded-2xl border border-slate-800"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{product.category}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                  {product.status}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">{product.productName}</h2>
              <p className="text-xs text-slate-400">Brand: <strong className="text-slate-200">{product.brandName}</strong></p>
              {product.description && <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed">{product.description}</p>}
            </div>
          </div>

          {/* QR Code Presentation Box */}
          {product.qrCode && (
            <div className="glass-card p-6 rounded-3xl border border-slate-800 text-center space-y-4">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Cryptographic QR Code</span>
              <img src={product.qrCode} alt="QR Code" className="w-36 h-36 bg-white p-2 rounded-2xl mx-auto shadow-md" />
              <div className="flex items-center justify-center space-x-2">
                <a
                  href={product.qrCode}
                  download={`QR-${product.productId}.png`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Information Tabs / Panels */}
        <div className="md:col-span-7 space-y-6">
          {/* Identification Section */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Identification & Batch Specs
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Product ID</span>
                <span className="font-mono font-bold text-blue-400 text-sm block">{product.productId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Serial Number</span>
                <span className="font-mono font-bold text-white text-sm block">{product.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Batch Number</span>
                <span className="font-mono text-slate-200 block">{product.batchNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Manufacturing Date</span>
                <span className="text-slate-200 block">{new Date(product.manufacturingDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Expiry Date</span>
                <span className="text-slate-200 block">{product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Manufacturer</span>
                <span className="text-blue-400 font-semibold block">{product.manufacturer?.companyName || product.manufacturer?.name || "Enterprise"}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic SHA-256 & Smart Contract */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Blockchain Cryptographic Security</span>
              <span className="text-purple-400 font-mono text-[10px]">Solidity Smart Contract</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">SHA-256 Digital Signature</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 break-all">
                  {product.productHash}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">On-Chain Transaction Hash</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-purple-400 break-all flex items-center justify-between">
                  <span>{product.transactionHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"}</span>
                  <a
                    href={`https://etherscan.io/tx/${product.transactionHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:text-purple-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">Owner Wallet Address</span>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all">
                  {product.ownerWallet || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"}
                </div>
              </div>
            </div>
          </div>

          {/* Verification Timeline */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Verification & History Timeline ({history.length} scans)
            </h3>
            <Timeline product={product} verifications={history} />
          </div>
        </div>
      </div>
    </div>
  );
}
