import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { QrCode, Download, Printer, Copy, ArrowLeft, Shield, CheckCircle } from "lucide-react";

export default function QRCodeViewPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error("Fetch QR Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-[#050816]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400">Loading High-Resolution QR Label...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-[#050816]">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/products" className="text-xs text-purple-400 font-mono hover:underline">Back to Catalog</Link>
      </div>
    );
  }

  const clientUrl = window.location.origin;
  const verificationUrl = `${clientUrl}/verify/${product.productId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 text-center bg-[#050816]">
      <Link to={`/products/${product.productId}`} className="inline-flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Details</span>
      </Link>

      {/* Printable Label Card */}
      <div id="printable-qr" className="bg-[#0D1528] p-8 rounded-2xl border border-purple-500/40 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1E2A47] pb-4">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">VeriMark Authenticated</span>
              <span className="text-[10px] text-purple-400 font-mono block">Product ID: {product.productId}</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            AUTHENTIC
          </span>
        </div>

        {/* High Res QR Display */}
        <div className="bg-white p-4 rounded-xl w-52 h-52 mx-auto flex items-center justify-center shadow-lg border border-slate-700">
          <img src={product.qrCode} alt="Product QR Code" className="w-full h-full object-contain" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white">{product.productName}</h3>
          <p className="text-xs text-slate-400 font-mono">SN: <strong className="text-slate-200">{product.serialNumber}</strong></p>
          <p className="text-[11px] text-slate-500 font-mono">Scan to verify cryptographic SHA-256 digital signature</p>
        </div>

        {/* Verification Link Bar */}
        <div className="bg-[#050816] p-3 rounded-xl border border-[#1E2A47] flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-purple-400 truncate max-w-[280px]">{verificationUrl}</span>
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-[11px] font-mono font-bold flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center space-x-3">
        <a
          href={product.qrCode}
          download={`QR-${product.productId}.png`}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 inline-flex items-center space-x-2 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download QR PNG</span>
        </a>

        <button
          onClick={() => window.print()}
          className="px-6 py-3 rounded-xl bg-[#0D1528] hover:bg-[#111B32] text-slate-200 text-xs font-bold inline-flex items-center space-x-2 transition-all border border-[#1E2A47]"
        >
          <Printer className="w-4 h-4" />
          <span>Print Label</span>
        </button>
      </div>
    </div>
  );
}
