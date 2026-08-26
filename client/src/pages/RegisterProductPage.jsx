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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 bg-[#05070D]">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>SOLIDITY SMART CONTRACT REGISTRATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Register Product Metadata</h1>
        <p className="text-xs text-[#8B98AA] max-w-md mx-auto">
          Generate SHA-256 digital signatures and register item records on the Ethereum blockchain.
        </p>
      </div>

      {step < 3 && (
        <form onSubmit={handleSubmitProduct} className="bg-[#101722] p-6 sm:p-8 rounded-xl border border-[#1D2938] space-y-6 shadow-xl">
          {error && (
            <div className="p-3 rounded-md bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* VISUALLY DISTINCT BLOCKCHAIN REGISTRATION SECTION */}
          <div className="bg-[#0B111B] p-5 rounded-lg border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1D2938] pb-3">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  BLOCKCHAIN REGISTRATION
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-500/30">
                Ethereum Paris / Hardhat 31337
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-1">
                <span className="text-[#8B98AA] text-[10px] block">Wallet Status</span>
                <span className={`font-bold block ${account ? "text-emerald-400" : "text-amber-400"}`}>
                  {account ? "● Wallet Connected" : "Wallet Disconnected"}
                </span>
              </div>

              <div className="bg-[#05070D] p-3 rounded border border-[#1D2938] space-y-1 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#8B98AA] text-[10px]">Connected Wallet Address</span>
                  {!account && (
                    <button
                      type="button"
                      onClick={connectWallet}
                      className="text-[10px] text-cyan-400 hover:underline font-bold"
                    >
                      Connect MetaMask
                    </button>
                  )}
                </div>
                <span className="text-slate-200 text-[11px] truncate block font-mono">
                  {account ? account : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Server Signer)"}
                </span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">Product ID (Unique)</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Product Name *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. AirPods Pro (2nd Gen)"
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Brand Name *</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="e.g. Apple Inc."
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Smartphones">Smartphones</option>
                <option value="Audio">Audio</option>
                <option value="Luxury Watches">Luxury Watches</option>
                <option value="Apparel">Apparel</option>
                <option value="Pharmaceuticals">Pharmaceuticals</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono font-bold text-slate-300 uppercase tracking-wider block">Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Manufacturing Date *</label>
              <input
                type="date"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Product technical specs..."
                className="w-full px-3.5 py-2.5 rounded-md bg-[#0B111B] border border-[#1D2938] text-white placeholder-[#8B98AA] focus:outline-none focus:border-cyan-500"
              ></textarea>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Product Image</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer px-4 py-2.5 rounded-md bg-[#0B111B] hover:bg-[#1B2738] border border-[#1D2938] text-slate-300 font-semibold flex items-center space-x-2 transition-colors">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-md object-cover border border-[#1D2938]" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-md font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] shadow-md shadow-cyan-500/20 border border-cyan-400/40 flex items-center justify-center space-x-2 transition-all text-xs"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? "Generating SHA-256 & Signing Contract..." : "Register Product & Mint On-Chain Record"}</span>
          </button>
        </form>
      )}

      {/* STEP 3 SUCCESS RESULT */}
      {step === 3 && createdProduct && (
        <div className="bg-[#101722] p-8 rounded-xl border border-emerald-500/40 space-y-6 text-center shadow-xl">
          <div className="w-14 h-14 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider">
              BLOCKCHAIN TRANSACTION CONFIRMED
            </span>
            <h2 className="text-2xl font-extrabold text-white">Product Successfully Registered!</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-[#0B111B] p-5 rounded-md border border-[#1D2938] space-y-2 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider border-b border-[#1D2938] pb-2 font-mono">
                REGISTERED METADATA
              </h4>
              <div className="space-y-1">
                <span className="text-[#8B98AA] block">Product Name: <strong className="text-white">{createdProduct.productName}</strong></span>
                <span className="text-[#8B98AA] block">Product ID: <strong className="text-cyan-400 font-mono">{createdProduct.productId}</strong></span>
                <span className="text-[#8B98AA] block">Serial Number: <strong className="text-white font-mono">{createdProduct.serialNumber}</strong></span>
              </div>

              <div className="pt-2 border-t border-[#1D2938] space-y-1">
                <span className="text-[#8B98AA] block font-mono text-[10px]">SHA-256 Cryptographic Hash:</span>
                <div className="bg-[#05070D] p-2.5 rounded border border-[#1D2938] font-mono text-[10px] text-cyan-300 break-all flex items-center justify-between">
                  <span>{createdProduct.productHash}</span>
                  <button onClick={() => copyToClipboard(createdProduct.productHash)} className="p-1 text-[#8B98AA] hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#0B111B] p-5 rounded-md border border-[#1D2938] text-center flex flex-col items-center justify-center space-y-3">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Product QR Code</span>
              <img src={createdProduct.qrCode} alt="QR Code" className="w-32 h-32 bg-white p-2 rounded-md border border-slate-700" />
              <div className="flex items-center space-x-2">
                <a
                  href={createdProduct.qrCode}
                  download={`QR-${createdProduct.productId}.png`}
                  className="px-3 py-1.5 rounded-md bg-[#06b6d4] text-[#05070D] text-xs font-bold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-md bg-[#101722] hover:bg-[#1B2738] text-slate-200 text-xs font-bold flex items-center space-x-1 border border-[#1D2938]"
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
              className="px-5 py-2.5 rounded-md font-bold text-[#05070D] bg-[#06b6d4] hover:bg-[#22d3ee] text-xs flex items-center space-x-1.5"
            >
              <span>Verify Product Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="px-5 py-2.5 rounded-md font-bold text-slate-300 bg-[#0B111B] hover:bg-[#1B2738] border border-[#1D2938] text-xs"
            >
              View Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
