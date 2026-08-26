import React from "react";
import { CheckCircle2, Shield, QrCode, ArrowRightLeft, Search, Clock, FileCheck } from "lucide-react";

export default function Timeline({ product, verifications = [] }) {
  const events = [];

  if (product) {
    events.push({
      title: "Product Manufacturing Registered",
      description: `Registered by ${product.manufacturer?.companyName || product.manufacturer?.name || "Manufacturer"}. Batch ${product.batchNumber}, Serial ${product.serialNumber}.`,
      timestamp: new Date(product.manufacturingDate || product.createdAt).toLocaleDateString(),
      icon: FileCheck,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    });

    events.push({
      title: "SHA-256 Digital Fingerprint Generated",
      description: `Cryptographic Hash: ${product.productHash ? `${product.productHash.substring(0, 18)}...` : "SHA-256 Computed"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: Shield,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    });

    events.push({
      title: "Blockchain Authenticity Smart Contract Record Created",
      description: `Transaction Tx: ${product.transactionHash ? `${product.transactionHash.substring(0, 16)}...` : "Recorded On Ethereum Network"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: CheckCircle2,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    });

    events.push({
      title: "Unique QR Verification Code Generated",
      description: `Target Verification URL: /verify/${product.productId}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: QrCode,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    });

    if (product.ownerWallet) {
      events.push({
        title: "Ownership Wallet Bound",
        description: `Current Registered Owner Wallet: ${product.ownerWallet.substring(0, 10)}...`,
        timestamp: new Date(product.updatedAt || product.createdAt).toLocaleDateString(),
        icon: ArrowRightLeft,
        color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
      });
    }
  }

  // Add customer verification events
  verifications.forEach((v) => {
    events.push({
      title: `Product Scanned & Verified (${v.verificationStatus})`,
      description: `Scanned from ${v.location || "Global Scanner"}. Status: ${v.verificationStatus}`,
      timestamp: new Date(v.timestamp).toLocaleString(),
      icon: Search,
      color: v.verificationStatus === "SUCCESS"
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
        : "text-red-400 bg-red-500/10 border-red-500/30",
    });
  });

  return (
    <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-4">
      {events.map((evt, idx) => {
        const Icon = evt.icon;
        return (
          <div key={idx} className="relative group">
            {/* Dot icon */}
            <div className={`absolute -left-[35px] top-0.5 w-8 h-8 rounded-full border flex items-center justify-center ${evt.color}`}>
              <Icon className="w-4 h-4" />
            </div>

            {/* Event content */}
            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">{evt.title}</h4>
                <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{evt.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
