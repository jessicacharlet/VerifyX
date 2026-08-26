import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, QrCode, Lock, Cpu, CheckCircle, AlertTriangle, ArrowRight, Layers, Database, ShieldAlert, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Decentralized Product Authenticity</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Verify What’s Real. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
                Trust What’s Verified.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              VeriMark leverages Ethereum smart contracts, SHA-256 cryptographic hashing, and instant QR verification to eliminate counterfeit products and provide transparent, tamper-resistant authenticity records.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/verify"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
              >
                <QrCode className="w-5 h-5" />
                <span>Verify a Product</span>
              </Link>

              <Link
                to="/register-product"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 flex items-center justify-center space-x-2 transition-all"
              >
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>Register a Product</span>
              </Link>
            </div>

            {/* Quick Stats Bar */}
            <div className="pt-8 border-t border-slate-800 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="text-xl font-bold text-white">100%</div>
                <div className="text-xs text-slate-400">Tamper-Proof</div>
              </div>
              <div>
                <div className="text-xl font-bold text-emerald-400">&lt; 1 sec</div>
                <div className="text-xs text-slate-400">Instant Lookup</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">SHA-256</div>
                <div className="text-xs text-slate-400">Crypto Fingerprint</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-6 border border-slate-700/80 shadow-2xl relative space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    On-Chain Verified
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">PROD-AP-9901</span>
              </div>

              {/* Product Preview Card */}
              <div className="flex items-center space-x-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&auto=format&fit=crop&q=80"
                  alt="AirPods Pro"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-700"
                />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Apple AirPods Pro (2nd Gen)</h4>
                  <p className="text-xs text-slate-400">Batch: BATCH-2026-A1</p>
                  <p className="text-[10px] text-blue-400 font-mono">SN: SN-AP-98213890</p>
                </div>
              </div>

              {/* Cryptographic Hash Badge */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>SHA-256 Digital Fingerprint</span>
                  <span className="text-emerald-400 font-semibold">Match 100%</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800/80">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              {/* QR Verification Status */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>Solidity Smart Contract Immutable</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center space-x-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>AUTHENTIC</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">End-To-End Workflow</span>
          <h2 className="text-3xl font-extrabold text-white">How VeriMark Protects Authenticity</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From manufacturer registration to customer QR scanning, every step is cryptographically verified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            {
              step: "01",
              title: "Register Product",
              desc: "Manufacturer inputs batch number, serial, manufacturing date, and specs.",
              icon: ShieldCheck,
            },
            {
              step: "02",
              title: "Digital Fingerprint",
              desc: "System computes a deterministic SHA-256 hash representation.",
              icon: Lock,
            },
            {
              step: "03",
              title: "On-Chain Solidity",
              desc: "Hash & ownership are stored permanently on the Ethereum blockchain.",
              icon: Cpu,
            },
            {
              step: "04",
              title: "Generate QR",
              desc: "Unique verification QR code created for physical product packaging.",
              icon: QrCode,
            },
            {
              step: "05",
              title: "Verify Anywhere",
              desc: "Customer scans QR or enters Product ID to instantly confirm authenticity.",
              icon: CheckCircle,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-500/40">{item.step}</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY VERIMARK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Enterprise Advantages</span>
            <h2 className="text-3xl font-extrabold text-white">Why VeriMark?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Blockchain Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Records stored on Solidity smart contracts cannot be modified, deleted, or forged by counterfeiters.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Tamper Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If serial numbers or metadata are altered, the SHA-256 cryptographic hash check immediately flags the mismatch.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant QR Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers can verify products directly from their mobile browser without downloading additional apps or logging in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK BADGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Powered by Modern Web3 Technologies</h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["React.js", "Vite", "Tailwind CSS", "Node.js", "Express API", "MongoDB Mongoose", "Solidity", "Hardhat", "Ethers.js", "SHA-256 Crypto"].map(
            (tech, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold shadow-sm"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </section>
    </div>
  );
}
