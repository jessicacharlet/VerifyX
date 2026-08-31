import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import API from "../services/api";

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    externalOrderId: "",
    salesChannel: "E-Commerce Website",
    customerName: "",
    customerContact: "",
    customerAddress: "",
    productName: "Samsung Galaxy S21 FE",
    model: "Galaxy S21 FE",
    quantity: 1,
    expectedDeliveryDate: "",
    remarks: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate clicks

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        externalOrderId: formData.externalOrderId.trim(),
        salesChannel: formData.salesChannel,
        customerName: formData.customerName.trim(),
        customerContact: formData.customerContact.trim(),
        customerAddress: formData.customerAddress.trim(),
        productName: formData.productName.trim(),
        model: formData.model ? formData.model.trim() : formData.productName.trim(),
        quantity: Math.max(1, parseInt(formData.quantity, 10) || 1),
        expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
        remarks: formData.remarks ? formData.remarks.trim() : "",
      };

      const res = await API.post("/orders", payload);
      if (res.data && res.data.success && res.data.order) {
        const createdOrder = res.data.order;
        setSuccess(
          `✓ Incoming Order ${createdOrder.orderId} registered successfully! Redirecting to Order Details...`
        );
        
        setTimeout(() => {
          navigate(`/orders/${createdOrder.orderId}`);
        }, 1200);
      } else {
        setError(res.data?.message || "Failed to register order.");
      }
    } catch (err) {
      console.error("Register order submit error:", err);
      const serverErrMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to register order. Please check network and database connection.";
      setError(`Failed to register order: ${serverErrMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 font-sans">
      <Link
        to="/orders"
        className="inline-flex items-center space-x-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Incoming Orders List</span>
      </Link>

      <div className="bg-[#0D121A] p-6 sm:p-8 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <span>Register Incoming Order</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Register an order received through your existing sales channels (e-commerce, ERP, marketplace, or sales team) to begin physical product tracking.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Sales Channel *</label>
              <select
                name="salesChannel"
                value={formData.salesChannel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="E-Commerce Website">E-Commerce Website</option>
                <option value="Amazon Marketplace">Amazon Marketplace</option>
                <option value="Retail Store / POS">Retail Store / POS</option>
                <option value="Direct Sales Team">Direct Sales Team</option>
                <option value="ERP / Enterprise API">ERP / Enterprise API</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">External Order ID (Optional)</label>
              <input
                type="text"
                name="externalOrderId"
                value={formData.externalOrderId}
                onChange={handleChange}
                placeholder="e.g. AMZ-4589231 or ERP-99201"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400 font-mono uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Customer name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="e.g. Jessica Charlet"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Customer contact / phone *</label>
              <input
                type="text"
                name="customerContact"
                value={formData.customerContact}
                onChange={handleChange}
                required
                placeholder="e.g. +9197397573055"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 block font-medium">Customer delivery address *</label>
            <textarea
              name="customerAddress"
              value={formData.customerAddress}
              onChange={handleChange}
              required
              rows="2"
              placeholder="e.g. 1996, Vasantham Colony, Anna Nagar West"
              className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 block font-medium">Product model name *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="e.g. Samsung Galaxy S21 FE"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Quantity (Units)</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Expected delivery date</label>
              <input
                type="date"
                name="expectedDeliveryDate"
                value={formData.expectedDeliveryDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Special instructions / remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="e.g. Handle with care"
                className="w-full px-3.5 py-2.5 rounded bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-[#070A0F] font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Order...</span>
              </>
            ) : (
              <span>Confirm & Register Order</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
