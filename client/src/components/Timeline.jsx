import React from "react";
import { CheckCircle2, Shield, QrCode, ArrowRightLeft, Search, Clock, FileCheck } from "lucide-react";

export default function Timeline({ product, verifications = [] }) {
  const events = [];

  if (product) {
    events.push({
      title: "Product Identity Created",
      description: `Registered by ${product.manufacturer?.companyName || product.manufacturer?.name || "Manufacturer"}. Batch ${product.batchNumber}, Serial ${product.serialNumber}.`,
      timestamp: new Date(product.manufacturingDate || product.createdAt).toLocaleDateString(),
      icon: FileCheck,
      color: "text-purple-400 bg-purple-950/60 border-purple-500/40",
    });

    events.push({
      title: "SHA-256 Digital Signature Generated",
      description: `Cryptographic Hash: ${product.productHash ? `${product.productHash.substring(0, 24)}...` : "SHA-256 Signature"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: Shield,
      color: "text-purple-400 bg-purple-950/60 border-purple-500/40",
    });

    events.push({
      title: "Ethereum Smart Contract On-Chain Record Committed",
      description: `Transaction Tx: ${product.transactionHash ? `${product.transactionHash.substring(0, 20)}...` : "Committed On-Chain"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/40",
    });

    events.push({
      title: "Unique QR Code Generated",
      description: `Target Verification Route: /verify/${product.productId}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: QrCode,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
    });

    if (product.ownerWallet) {
      events.push({
        title: "Ownership Bound to Wallet Address",
        description: `Registered Owner Address: ${product.ownerWallet.substring(0, 14)}...`,
        timestamp: new Date(product.updatedAt || product.createdAt).toLocaleDateString(),
        icon: ArrowRightLeft,
        color: "text-indigo-400 bg-indigo-950/60 border-indigo-500/40",
      });
    }
  }

  verifications.forEach((v) => {
    events.push({
      title: `Product Scanned & Verified (${v.verificationStatus})`,
      description: `Scanned from ${v.location || "Global Scanner"}. Status: ${v.verificationStatus}`,
      timestamp: new Date(v.timestamp).toLocaleString(),
      icon: Search,
      color: v.verificationStatus === "SUCCESS"
        ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/40"
        : "text-red-400 bg-red-950/60 border-red-500/40",
    });
  });

  return (
    <div className="relative pl-6 border-l border-[#1E2A47] space-y-4 my-3 text-xs">
      {events.map((evt, idx) => {
        const Icon = evt.icon;
        return (
          <div key={idx} className="relative group">
            <div className={`absolute -left-[33px] top-1 w-7 h-7 rounded-lg border flex items-center justify-center ${evt.color}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            <div className="bg-[#0A1020] p-3.5 rounded-xl border border-[#1E2A47] space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-mono font-bold text-white text-xs">{evt.title}</h4>
                <span className="text-[10px] font-mono text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">{evt.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
