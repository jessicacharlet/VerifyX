import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { QrCode, Printer, Download, ArrowLeft, CheckCircle, Package } from "lucide-react";
import API from "../services/api";

export default function QRCodeViewPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get(`/products/${encodeURIComponent(id)}`);
      if (res.data && res.data.product) {
        setProduct(res.data.product);
      }
    } catch (err) {
      console.error("Fetch QR product error:", err);
      setError("Failed to load product QR label.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!product?.qrCode) return;
    const a = document.createElement("a");
    a.href = product.qrCode;
    a.download = `QR-${product.productId}.png`;
    a.click();
  };

  if (loading) {
    return <div className="p-12 text-center text-xs font-mono text-[#94A3B8]">Generating printable QR label...</div>;
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto py-12 text-center text-xs font-mono text-red-400">
        {error || "Product not found."}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6 font-mono">
      <Link
        to={`/products/${product.productId}`}
        className="inline-flex items-center space-x-2 text-xs text-[#94A3B8] hover:text-white transition-colors print:hidden"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Details</span>
      </Link>

      {/* Printable Box QR Card Label */}
      <div className="bg-white text-slate-900 p-8 rounded-2xl border-2 border-slate-900 space-y-6 shadow-2xl text-center print:border-none print:shadow-none print:p-0">
        <div className="border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="text-2xl font-black tracking-wider uppercase text-slate-900">VERIFYX AUTHENTICITY SEAL</div>
          <div className="text-xs font-bold text-slate-600">PHYSICAL BOX PACKAGING LABEL</div>
        </div>

        {/* QR Image */}
        <div className="bg-slate-50 p-4 rounded-xl inline-block border border-slate-300">
          <img
            src={product.qrCode}
            alt={`QR Code for ${product.productId}`}
            className="w-56 h-56 mx-auto object-contain"
          />
        </div>

        {/* Product Details */}
        <div className="space-y-1 text-slate-900 font-bold">
          <div className="text-xl">{product.productName}</div>
          <div className="text-sm font-mono text-cyan-700">Product ID: {product.productId}</div>
          <div className="text-xs text-slate-600 font-mono">Serial No: {product.serialNumber}</div>
          <div className="text-xs text-slate-600 font-mono">Order ID: {product.orderId || "N/A"}</div>
        </div>

        <div className="pt-3 border-t border-slate-300 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          Scan using mobile camera to verify authenticity & track lifecycle
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-xs flex items-center space-x-2 shadow-md shadow-cyan-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print QR Label</span>
        </button>

        <button
          onClick={handleDownload}
          className="px-6 py-3 rounded-lg bg-[#111821] hover:bg-[#1E293B] text-white font-bold text-xs flex items-center space-x-2 border border-[#1E293B]"
        >
          <Download className="w-4 h-4" />
          <span>Download PNG</span>
        </button>
      </div>
    </div>
  );
}
