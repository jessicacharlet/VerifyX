import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import API from "../services/api";

export default function CreateOrderPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await API.post("/orders", formData);
      if (res.data && res.data.order) {
        setSuccess(`Order ${res.data.order.orderId} created successfully! Redirecting...`);
        setTimeout(() => {
          navigate(`/orders/${res.data.order.orderId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Create order error:", err);
      setError(err.response?.data?.message || "Failed to create order.");
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
        <span>Back to Orders List</span>
      </Link>

      <div className="bg-[#0D121A] p-6 rounded-xl border border-[#1E293B] shadow-xl space-y-6">
        <div className="border-b border-[#1E293B] pb-4 space-y-1">
          <h1 className="text-xl font-semibold text-white flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <span>Create Sales Order</span>
          </h1>
          <p className="text-xs text-[#94A3B8]">
            Receive customer order and prepare for physical product assignment and QR generation.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Customer name *</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                required
                placeholder="e.g. Rahul Kumar"
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
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
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
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
              placeholder="e.g. 42 Connaught Place, New Delhi, 110001"
              className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 block font-medium">Product name *</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
                placeholder="e.g. Samsung Galaxy S21 FE"
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
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
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 block font-medium">Special instructions / remarks</label>
              <input
                type="text"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="e.g. Handle fragile glass"
                className="w-full px-3.5 py-2.5 rounded-[#0D121A] bg-[#111821] border border-[#1E293B] text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-semibold text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            {loading ? "Creating Order..." : "Confirm & Create Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
