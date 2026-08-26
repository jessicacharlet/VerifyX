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
  const [step, setStep] = useState(1); // 1: Form -> 2: Review & On-Chain -> 3: Success Result
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);

  const { account, connectWallet, registerProductOnChain, hasMetaMask } = useWeb3();
  const navigate = useNavigate();

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

  // Form Submit Handler
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.productName || !formData.brandName || !formData.category || !formData.batchNumber || !formData.serialNumber) {
      setError("Please complete all required product information fields.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Step 1: Submit to Backend REST API (MongoDB creation + SHA-256 + QR generation)
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

        // Step 2: Call Smart Contract via MetaMask if connected
        if (hasMetaMask) {
          try {
            console.log("Triggering MetaMask smart contract transaction...");
            const txHash = await registerProductOnChain(prod.productId, prod.productHash);
            prod.transactionHash = txHash;

            // Sync transaction hash back to server DB
            await API.post("/blockchain/register", {
              productId: prod.productId,
              transactionHash: txHash,
              ownerWallet: account || prod.ownerWallet,
            });
          } catch (web3Err) {
            console.warn("Web3 On-chain transaction skipped or rejected by user:", web3Err.message);
          }
        }

        setStep(3); // Show Success Screen
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
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Ethereum Smart Contract Integration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Register New Authenticated Product</h1>
        <p className="text-xs text-slate-400">
          Generate SHA-256 cryptographic hashes and register tamper-proof records on the blockchain.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
        <div className={`py-2 rounded-xl border ${step === 1 ? "bg-blue-600/20 text-blue-400 border-blue-500/40" : "bg-slate-900 text-slate-500 border-slate-800"}`}>
          1. Product Details
        </div>
        <div className={`py-2 rounded-xl border ${step === 2 ? "bg-purple-600/20 text-purple-400 border-purple-500/40" : "bg-slate-900 text-slate-500 border-slate-800"}`}>
          2. Cryptographic Hash
        </div>
        <div className={`py-2 rounded-xl border ${step === 3 ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40" : "bg-slate-900 text-slate-500 border-slate-800"}`}>
          3. QR & Blockchain Result
        </div>
      </div>

      {/* STEP 1 & 2 FORM */}
      {step < 3 && (
        <form onSubmit={handleSubmitProduct} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-300 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Web3 Wallet Banner */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs">
              <Wallet className={`w-5 h-5 ${account ? "text-emerald-400" : "text-amber-400"}`} />
              <div>
                <span className="font-bold text-slate-200 block">Connected Ethereum Wallet</span>
                <span className="font-mono text-slate-400 block text-[11px]">
                  {account ? account : "Wallet disconnected. (Will use server-signed ledger mode)"}
                </span>
              </div>
            </div>
            {!account && (
              <button
                type="button"
                onClick={connectWallet}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Connect MetaMask
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Product ID (Unique)</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs uppercase"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
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
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Batch Number *</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Serial Number *</label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs uppercase"
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
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Expiry Date (Optional)</label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Description</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed technical specifications or batch metadata..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
              ></textarea>
            </div>

            <div className="col-span-1 sm:col-span-2 space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">Product Image</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Choose Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-slate-700" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all text-sm mt-4"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? "Generating Hash & Signing Smart Contract..." : "Register Product & Mint On-Chain Record"}</span>
          </button>
        </form>
      )}

      {/* STEP 3 SUCCESS SCREEN */}
      {step === 3 && createdProduct && (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 space-y-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest">
              Blockchain Transaction Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-white">Product Successfully Registered!</h2>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              Authenticity record with SHA-256 cryptographic signature is permanently bound to the product ID.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Metadata Overview */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Registered Metadata
              </h4>
              <div className="space-y-1.5">
                <span className="text-slate-400 block">Product Name: <strong className="text-white">{createdProduct.productName}</strong></span>
                <span className="text-slate-400 block">Product ID: <strong className="text-blue-400 font-mono">{createdProduct.productId}</strong></span>
                <span className="text-slate-400 block">Serial Number: <strong className="text-white font-mono">{createdProduct.serialNumber}</strong></span>
                <span className="text-slate-400 block">Batch Number: <strong className="text-white">{createdProduct.batchNumber}</strong></span>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1">
                <span className="text-slate-400 block font-semibold">SHA-256 Cryptographic Hash:</span>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[10px] text-slate-300 break-all flex items-center justify-between">
                  <span>{createdProduct.productHash}</span>
                  <button onClick={() => copyToClipboard(createdProduct.productHash)} className="p-1 text-slate-400 hover:text-white">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* QR Code Presentation */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 text-center flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Unique QR Code</span>
              <img src={createdProduct.qrCode} alt="Product QR Code" className="w-36 h-36 bg-white p-2 rounded-xl shadow-md" />
              <div className="flex items-center space-x-2">
                <a
                  href={createdProduct.qrCode}
                  download={`QR-${createdProduct.productId}.png`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Label</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-4">
            <Link
              to={`/verify/${createdProduct.productId}`}
              className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 text-xs flex items-center space-x-2"
            >
              <span>Test Verification Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="px-6 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 text-xs"
            >
              Go to Product Catalog
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
