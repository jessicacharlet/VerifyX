import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { QrCode, Download, Printer, Copy, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3 bg-[#05070D]">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-[#8B98AA]">Loading High-Resolution QR Label...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-[#05070D]">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/products" className="text-xs text-cyan-400 font-mono hover:underline">Back to Catalog</Link>
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
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8 text-center bg-[#05070D]">
      <Link to={`/products/${product.productId}`} className="inline-flex items-center space-x-2 text-xs font-mono text-[#8B98AA] hover:text-white">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Details</span>
      </Link>

      {/* Printable Label Card */}
      <div id="printable-qr" className="bg-[#101722] p-8 rounded-xl border border-cyan-500/40 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1D2938] pb-4">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded bg-[#06b6d4] flex items-center justify-center text-[#05070D]">
              <ShieldCheck className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">VerifyX Authenticated</span>
              <span className="text-[10px] text-cyan-400 font-mono block">Product ID: {product.productId}</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
            AUTHENTIC
          </span>
        </div>

        {/* High Res QR Display */}
        <div className="bg-white p-4 rounded-md w-52 h-52 mx-auto flex items-center justify-center shadow-lg border border-slate-700">
          <img src={product.qrCode} alt="Product QR Code" className="w-full h-full object-contain" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-extrabold text-white">{product.productName}</h3>
          <p className="text-xs text-[#8B98AA] font-mono">SN: <strong className="text-slate-200">{product.serialNumber}</strong></p>
          <p className="text-[11px] text-slate-400 font-mono">Scan to verify cryptographic SHA-256 digital signature</p>
        </div>

        {/* Verification Link Bar */}
        <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] flex items-center justify-between text-xs">
          <span className="font-mono text-[11px] text-cyan-400 truncate max-w-[280px]">{verificationUrl}</span>
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center space-x-1"
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
          className="px-6 py-3 rounded-md bg-[#06b6d4] hover:bg-[#22d3ee] text-[#05070D] text-xs font-bold shadow-md shadow-cyan-500/20 inline-flex items-center space-x-2 transition-all border border-cyan-400/40"
        >
          <Download className="w-4 h-4" />
          <span>Download QR PNG</span>
        </a>

        <button
          onClick={() => window.print()}
          className="px-6 py-3 rounded-md bg-[#101722] hover:bg-[#1B2738] text-slate-200 text-xs font-bold inline-flex items-center space-x-2 transition-all border border-[#1D2938]"
        >
          <Printer className="w-4 h-4" />
          <span>Print Label</span>
        </button>
      </div>
    </div>
  );
}
