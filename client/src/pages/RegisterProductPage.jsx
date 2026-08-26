import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useWeb3 } from "../context/Web3Context";
import {
  ShieldCheck,
  Package,
  QrCode,
  Lock,
  Wallet,
  Upload,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Printer,
  Download,
  Copy,
  Cpu,
} from "lucide-react";

export default function RegisterProductPage() {
  const [formData, setFormData] = useState({
    productId: `PROD-${Date.now().toString(36).toUpperCase()}`,
    productName: "",
    brandName: "",
    category: "Electronics",
    description: "",
    batchNumber: `BATCH-${new Date().getFullYear()}-01`,
    serialNumber: `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    manufacturingDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    ownerWallet: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);

  const { account, chainId, connectWallet, registerProductOnChain, hasMetaMask } = useWeb3();

  useEffect(() => {
    if (account) {
      setFormData((prev) => ({ ...prev, ownerWallet: account }));
    }
  }, [account]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.productName || !formData.brandName || !formData.category || !formData.batchNumber || !formData.serialNumber) {
      setError("Please fill in all required product identity fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });
      if (imageFile) {
        data.append("productImage", imageFile);
      }

      const res = await API.post("/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const prod = res.data.product;
        setCreatedProduct(prod);

        if (hasMetaMask) {
          try {
            console.log("Submitting smart contract transaction via MetaMask...");
            const txHash = await registerProductOnChain(prod.productId, prod.productHash);
            prod.transactionHash = txHash;

            await API.post("/blockchain/register", {
              productId: prod.productId,
              transactionHash: txHash,
              ownerWallet: account || prod.ownerWallet,
            });
          } catch (web3Err) {
            console.warn("On-chain Web3 transaction skipped:", web3Err.message);
          }
        }

        setStep(3);
      }
    } catch (err) {
      console.error("Product Registration Error:", err);
      setError(err.response?.data?.message || err.message || "Failed to register product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 bg-[#070A0F]">
      {/* Header */}
      <div className="border-b border-[#202A36] pb-4">
        <h1 className="text-2xl font-bold text-white tracking-tight">Register product</h1>
        <p className="text-xs text-[#8B97A7] mt-0.5">
          Generate SHA-256 digital signatures and register item records on the Ethereum blockchain.
        </p>
      </div>

      {step < 3 && (
        <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Product Information Form */}
          <div className="lg:col-span-7 bg-[#0D121A] p-6 rounded-lg border border-[#202A36] space-y-4">
            <h2 className="text-sm font-bold text-white border-b border-[#202A36] pb-3">Product information</h2>

            {error && (
              <div className="p-3 rounded bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono font-medium text-slate-300 text-[11px] block">Product ID (Generated)</label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Product name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g. AirPods Pro (2nd Gen)"
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Brand name *</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleChange}
                  placeholder="e.g. Apple Inc."
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Audio">Audio</option>
                  <option value="Luxury Watches">Luxury Watches</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Pharmaceuticals">Pharmaceuticals</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono font-medium text-slate-300 text-[11px] block">Batch number *</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono font-medium text-slate-300 text-[11px] block">Serial number *</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Manufacturing date *</label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Expiry date (Optional)</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 space-y-1">
                <label className="font-medium text-slate-300 text-[11px] block">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product technical specs..."
                  className="w-full px-3 py-2 rounded bg-[#111821] border border-[#202A36] text-white placeholder-[#8B97A7] focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Image & Blockchain Registration Panel */}
          <div className="lg:col-span-5 space-y-6">
            {/* Blockchain Panel */}
            <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-4">
              <h2 className="text-sm font-bold text-white border-b border-[#202A36] pb-3 flex items-center justify-between">
                <span>Blockchain registration</span>
                <span className="text-[10px] font-mono text-cyan-400">Ethereum Paris</span>
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="bg-[#111821] p-3 rounded border border-[#202A36] flex items-center justify-between">
                  <span className="text-[#8B97A7] text-[11px]">Wallet status</span>
                  <span className={`font-bold ${account ? "text-emerald-400" : "text-amber-400"}`}>
                    {account ? "● Connected" : "Wallet disconnected"}
                  </span>
                </div>

                <div className="bg-[#111821] p-3 rounded border border-[#202A36] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#8B97A7] text-[10px]">Connected wallet address</span>
                    {!account && (
                      <button
                        type="button"
                        onClick={connectWallet}
                        className="text-[10px] text-cyan-400 hover:underline font-bold"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                  <span className="text-slate-200 text-[11px] truncate block font-mono">
                    {account ? account : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Server signer)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Image Upload */}
            <div className="bg-[#0D121A] p-5 rounded-lg border border-[#202A36] space-y-3 text-xs">
              <h2 className="text-sm font-bold text-white border-b border-[#202A36] pb-3">Product image</h2>
              <div className="space-y-2">
                <label className="cursor-pointer px-4 py-2.5 rounded bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-slate-300 font-medium flex items-center justify-center space-x-2 transition-colors">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload image file</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded object-cover border border-[#202A36] mx-auto" />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-md font-bold text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] border border-cyan-400/30 flex items-center justify-center space-x-2 transition-colors text-xs"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? "Generating SHA-256 & signing..." : "Register on blockchain"}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* STEP 3 SUCCESS RESULT */}
      {step === 3 && createdProduct && (
        <div className="bg-[#0D121A] p-8 rounded-lg border border-emerald-500/40 space-y-6 text-center shadow-xl">
          <div className="w-12 h-12 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              Transaction confirmed
            </span>
            <h2 className="text-xl font-bold text-white">Product successfully registered</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#111821] p-5 rounded border border-[#202A36] space-y-2 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider border-b border-[#202A36] pb-2 font-mono">
                Registered metadata
              </h4>
              <div className="space-y-1">
                <span className="text-[#8B97A7] block">Product name: <strong className="text-white">{createdProduct.productName}</strong></span>
                <span className="text-[#8B97A7] block">Product ID: <strong className="text-cyan-400 font-mono">{createdProduct.productId}</strong></span>
                <span className="text-[#8B97A7] block">Serial number: <strong className="text-white font-mono">{createdProduct.serialNumber}</strong></span>
              </div>

              <div className="pt-2 border-t border-[#202A36] space-y-1">
                <span className="text-[#8B97A7] block font-mono text-[10px]">SHA-256 digital fingerprint:</span>
                <div className="bg-[#070A0F] p-2.5 rounded border border-[#202A36] font-mono text-[10px] text-cyan-300 break-all flex items-center justify-between">
                  <span>{createdProduct.productHash}</span>
                  <button onClick={() => copyToClipboard(createdProduct.productHash)} className="p-1 text-[#8B97A7] hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#111821] p-5 rounded border border-[#202A36] text-center flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Product QR code</span>
              <img src={createdProduct.qrCode} alt="QR Code" className="w-32 h-32 bg-white p-2 rounded border border-slate-700" />
              <div className="flex items-center space-x-2">
                <a
                  href={createdProduct.qrCode}
                  download={`QR-${createdProduct.productId}.png`}
                  className="px-3 py-1.5 rounded bg-[#06b6d4] text-[#070A0F] text-xs font-bold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded bg-[#0D121A] hover:bg-[#111821] text-slate-200 text-xs font-bold flex items-center space-x-1 border border-[#202A36]"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <Link
              to={`/verify/${createdProduct.productId}`}
              className="px-5 py-2.5 rounded font-bold text-[#070A0F] bg-[#06b6d4] hover:bg-[#0891b2] text-xs flex items-center space-x-1.5"
            >
              <span>Verify product page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="px-5 py-2.5 rounded font-bold text-slate-300 bg-[#111821] hover:bg-[#202A36] border border-[#202A36] text-xs"
            >
              View catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
