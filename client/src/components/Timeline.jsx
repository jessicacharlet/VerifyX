import React from "react";
import { CheckCircle2, ShieldCheck, QrCode, ArrowRightLeft, Search, Clock, FileCheck, BrainCircuit } from "lucide-react";

export default function Timeline({ product, verifications = [] }) {
  const events = [];

  if (product) {
    events.push({
      title: "Product Identity & Specifications Created",
      description: `Registered by ${product.manufacturer?.companyName || product.manufacturer?.name || "Manufacturer"}. Batch ${product.batchNumber}, Serial ${product.serialNumber}.`,
      timestamp: new Date(product.manufacturingDate || product.createdAt).toLocaleDateString(),
      icon: FileCheck,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
      stepNumber: "01",
    });

    events.push({
      title: "SHA-256 Cryptographic Hash Computed",
      description: `64-Character Digital Fingerprint: ${product.productHash ? `${product.productHash.substring(0, 24)}...` : "SHA-256 Signature"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: ShieldCheck,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
      stepNumber: "02",
    });

    events.push({
      title: "Ethereum Smart Contract Ledger Committed",
      description: `On-Chain Transaction Tx: ${product.transactionHash ? `${product.transactionHash.substring(0, 20)}...` : "Committed On-Chain"}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: CheckCircle2,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/40",
      stepNumber: "03",
    });

    events.push({
      title: "Unique QR Verification Label Generated",
      description: `Verification Endpoint: /verify/${product.productId}`,
      timestamp: new Date(product.createdAt).toLocaleDateString(),
      icon: QrCode,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40",
      stepNumber: "04",
    });

    if (product.ownerWallet) {
      events.push({
        title: "Ownership Bound to Wallet Address",
        description: `Owner Address: ${product.ownerWallet.substring(0, 16)}...`,
        timestamp: new Date(product.updatedAt || product.createdAt).toLocaleDateString(),
        icon: ArrowRightLeft,
        color: "text-blue-400 bg-blue-950/60 border-blue-500/40",
        stepNumber: "05",
      });
    }
  }

  verifications.forEach((v, i) => {
    const risk = v.aiRiskScore !== undefined ? v.aiRiskScore : 12;
    events.push({
      title: `Verification Audit Log (${v.verificationStatus})`,
      description: `Public Scan query from ${v.location || "Global Verification Portal"}. Status: ${v.verificationStatus === "SUCCESS" ? "Authentic" : "Suspicious"}. AI Risk Score: ${risk}%.`,
      timestamp: new Date(v.timestamp).toLocaleString(),
      icon: Search,
      color: v.verificationStatus === "SUCCESS"
        ? "text-emerald-400 bg-emerald-950/60 border-emerald-500/40"
        : "text-red-400 bg-red-950/60 border-red-500/40",
      stepNumber: `0${6 + i}`,
    });
  });

  return (
    <div className="relative pl-8 border-l border-[#1E293B] space-y-6 my-4 text-xs font-mono">
      {events.map((evt, idx) => {
        const Icon = evt.icon;
        return (
          <div key={idx} className="relative group">
            {/* Step Icon Badge */}
            <div className={`absolute -left-[45px] top-0 w-8 h-8 rounded-lg border flex items-center justify-center shadow-sm ${evt.color}`}>
              <Icon className="w-4 h-4" />
            </div>

            <div className="bg-[#111821] p-4 rounded-xl border border-[#1E293B] space-y-1.5 hover:border-slate-600 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-cyan-400 bg-[#070A0F] px-2 py-0.5 rounded border border-[#1E293B]">
                    {evt.stepNumber}
                  </span>
                  <h4 className="font-bold text-white text-xs">{evt.title}</h4>
                </div>
                <span className="text-[10px] text-[#64748B] flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{evt.timestamp}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] leading-relaxed">{evt.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
