import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  QrCode,
  Lock,
  Cpu,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  Search,
  Code,
  Layers,
  Terminal,
  ExternalLink,
  Github,
  Key,
  Smartphone,
  Server,
  FileCode,
  Eye,
  Activity,
} from "lucide-react";

export default function LandingPage() {
  const [quickInput, setQuickInput] = useState("");
  const navigate = useNavigate();

  const handleQuickVerify = (e) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    navigate(`/verify/${encodeURIComponent(quickInput.trim())}`);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* ---------------------------------------------------- */}
      {/* HERO SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle purple background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono font-semibold">
              <Code className="w-3.5 h-3.5" />
              <span>BLOCKCHAIN-BASED PRODUCT AUTHENTICATION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Verify What’s Real. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                Trust What’s Verified.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              VeriMark is a blockchain-based product authentication system that uses cryptographic hashing and QR verification to help detect counterfeit and tampered products.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2.5 sm:space-y-0 sm:space-x-3.5 pt-2">
              <Link
                to="/verify"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Verify a Product</span>
              </Link>

              <a
                href="#project-overview"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-xs text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center space-x-2 transition-all"
              >
                <span>Explore Project</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Technical UI Flow Visualization */}
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl p-5 border border-purple-500/20 space-y-4 shadow-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">STATUS: ON-CHAIN VERIFIED</span>
                </div>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/20">
                  VMK-2026-001
                </span>
              </div>

              {/* Technical Flow Steps Visual */}
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">1. Product Input</span>
                  <span className="text-slate-200 font-bold text-[11px]">AirPods Pro (SN-AP-98213)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-purple-500/30 flex items-center justify-between">
                  <span className="text-purple-400 text-[11px]">2. SHA-256 Hash</span>
                  <span className="text-purple-300 font-mono text-[10px] truncate max-w-[170px]">
                    8f4a91b2c7e4...91bd
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                  <span className="text-indigo-400 text-[11px]">3. Solidity Contract</span>
                  <span className="text-indigo-300 text-[10px]">ProductAuthenticity.sol</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between">
                  <span className="text-cyan-400 text-[11px]">4. QR Route</span>
                  <span className="text-cyan-300 text-[10px]">/verify/VMK-2026-001</span>
                </div>
              </div>

              {/* Verification Result Preview */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400">✓ AUTHENTIC PRODUCT</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100% Match</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROJECT OVERVIEW */}
      {/* ---------------------------------------------------- */}
      <section id="project-overview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
              SYSTEM ARCHITECTURE OVERVIEW
            </span>
            <h2 className="text-2xl font-extrabold text-white">Project Overview</h2>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              VeriMark provides a secure and transparent method for verifying product authenticity. Each registered product is assigned a unique cryptographic fingerprint and linked to a blockchain record. Customers can verify the product using its QR code or Product ID.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">SHA-256</h3>
              <p className="text-xs text-slate-400">Cryptographic Product Fingerprint</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Ethereum</h3>
              <p className="text-xs text-slate-400">Immutable Verification Record</p>
            </div>

            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">QR Code</h3>
              <p className="text-xs text-slate-400">Instant Product Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* HOW VERIMARK WORKS */}
      {/* ---------------------------------------------------- */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
            TECHNICAL EXECUTION WORKFLOW
          </span>
          <h2 className="text-2xl font-extrabold text-white">How VeriMark Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Product Registration",
              desc: "Manufacturer enters product details and creates a unique product identity.",
            },
            {
              step: "02",
              title: "Hash Generation",
              desc: "The system generates a SHA-256 fingerprint from the product information.",
            },
            {
              step: "03",
              title: "Blockchain Storage",
              desc: "The product hash and ownership information are recorded through a Solidity smart contract.",
            },
            {
              step: "04",
              title: "QR Generation",
              desc: "A unique QR code is generated and linked to the product verification page.",
            },
            {
              step: "05",
              title: "Product Verification",
              desc: "Customers scan the QR code or enter the Product ID to verify authenticity.",
            },
          ].map((item, idx) => (
            <div key={idx} className="glass-card p-4 rounded-xl border border-slate-800 space-y-2 relative">
              <span className="text-xs font-mono font-bold text-purple-400">{item.step}</span>
              <h3 className="text-xs font-bold text-white">{item.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* VERIFICATION SECTION */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-white">Verify a Product</h2>
            <p className="text-xs text-slate-400">
              Check whether a product matches its original blockchain-backed authenticity record.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Input & Search */}
            <form onSubmit={handleQuickVerify} className="md:col-span-7 space-y-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono font-bold text-slate-300 uppercase block">
                  Enter Product ID or Serial Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="e.g. PROD-AP-9901"
                    className="flex-grow px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors"
                  >
                    Verify Product
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">OR</span>
                <Link
                  to="/verify"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold inline-flex items-center space-x-1.5"
                >
                  <QrCode className="w-3.5 h-3.5 text-purple-400" />
                  <span>Scan QR Code</span>
                </Link>
              </div>
            </form>

            {/* Verification Result Visual Previews */}
            <div className="md:col-span-5 space-y-2">
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-400 font-bold">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>✓ AUTHENTIC PRODUCT — Hash Match 100%</span>
              </div>

              <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center space-x-2 text-xs text-red-400 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>⚠ PRODUCT NOT AUTHENTIC — Hash Mismatch / Unregistered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* TECHNOLOGY STACK */}
      {/* ---------------------------------------------------- */}
      <section id="technology-stack" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
            TECHNICAL ARCHITECTURE
          </span>
          <h2 className="text-2xl font-extrabold text-white">Technology Stack</h2>
          <p className="text-xs text-slate-400">Technologies used to build VeriMark</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-purple-400 block">Frontend</span>
            <span className="text-slate-300 text-[11px] block">React.js</span>
            <span className="text-slate-400 text-[10px] block">Vite / Tailwind CSS</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-400 block">Backend</span>
            <span className="text-slate-300 text-[11px] block">Node.js</span>
            <span className="text-slate-400 text-[10px] block">Express.js API</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">Database</span>
            <span className="text-slate-300 text-[11px] block">MongoDB</span>
            <span className="text-slate-400 text-[10px] block">Mongoose ODM</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-purple-400 block">Blockchain</span>
            <span className="text-slate-300 text-[11px] block">Ethereum</span>
            <span className="text-slate-400 text-[10px] block">Solidity / Hardhat</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-indigo-400 block">Security</span>
            <span className="text-slate-300 text-[11px] block">SHA-256</span>
            <span className="text-slate-400 text-[10px] block">JWT / bcrypt</span>
          </div>

          <div className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-cyan-400 block">QR Engine</span>
            <span className="text-slate-300 text-[11px] block">Generation</span>
            <span className="text-slate-400 text-[10px] block">HTML5 QR Scanning</span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* BLOCKCHAIN VERIFICATION INTEGRATION */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Blockchain Verification</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              VeriMark stores the product's cryptographic fingerprint and ownership information on an Ethereum-compatible blockchain through a Solidity smart contract.
            </p>
          </div>

          {/* Simple Technical Flow */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300">
            <span>Product Hash</span>
            <span className="text-purple-400">→</span>
            <span>Smart Contract</span>
            <span className="text-purple-400">→</span>
            <span>Ethereum Blockchain</span>
            <span className="text-purple-400">→</span>
            <span>Immutable Record</span>
            <span className="text-purple-400">→</span>
            <span className="text-emerald-400 font-bold">Verification</span>
          </div>

          {/* Technical Interface Card */}
          <div className="glass-card p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>ON-CHAIN SMART CONTRACT STATE</span>
              <span className="text-purple-400">ProductAuthenticity.sol</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Product ID</span>
                <span className="text-blue-400 font-bold">VMK-2026-001</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SHA-256 Hash</span>
                <span className="text-purple-300 truncate block">8f4a...91bd</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Network</span>
                <span className="text-slate-200">Ethereum Local / Test</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Status</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Transaction</span>
                <span className="text-cyan-400 truncate block">0x7a3...91f</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* CORE FEATURES */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
            PROJECT CAPABILITIES
          </span>
          <h2 className="text-2xl font-extrabold text-white">Core Features</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          {[
            { name: "Product Registration", desc: "Metadata & image intake" },
            { name: "SHA-256 Hashing", desc: "Deterministic digital fingerprint" },
            { name: "Blockchain Storage", desc: "Solidity smart contract ledger" },
            { name: "QR Code Generation", desc: "Instant product label creation" },
            { name: "QR Verification", desc: "Public camera & ID verification" },
            { name: "Product History", desc: "Lifecycle & scan log timeline" },
            { name: "Ownership Tracking", desc: "On-chain wallet transfers" },
            { name: "Authentication", desc: "JWT & bcrypt manufacturer login" },
            { name: "Admin Monitoring", desc: "Suspicious attempt governance" },
          ].map((feat, idx) => (
            <div key={idx} className="glass-card p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block">{feat.name}</span>
              <span className="text-slate-400 text-[11px] block">{feat.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* SYSTEM ARCHITECTURE DIAGRAM */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-purple-500/20 space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">System Architecture</h2>
            <p className="text-xs text-slate-400">Decoupled off-chain storage and on-chain blockchain verification pipeline</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
            {/* Flow 1: Web App & MongoDB */}
            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-purple-400 font-bold block text-[11px]">1. Off-Chain REST API & Database</span>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                <span>React Frontend</span>
                <span className="text-purple-400">→</span>
                <span>Node.js / Express API</span>
                <span className="text-purple-400">→</span>
                <span>MongoDB</span>
              </div>
            </div>

            {/* Flow 2: Web3 & Ethereum Smart Contract */}
            <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-3">
              <span className="text-indigo-400 font-bold block text-[11px]">2. On-Chain Smart Contract Ledger</span>
              <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                <span>React / Express</span>
                <span className="text-indigo-400">→</span>
                <span>Ethers.js</span>
                <span className="text-indigo-400">→</span>
                <span>Solidity Smart Contract</span>
                <span className="text-indigo-400">→</span>
                <span>Ethereum</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* PROJECT INTERFACE */}
      {/* ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
            USER INTERFACE PREVIEWS
          </span>
          <h2 className="text-2xl font-extrabold text-white">Project Interface</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {[
            { title: "Manufacturer Dashboard", link: "/dashboard", desc: "Analytics & Scans" },
            { title: "Product Registration", link: "/register-product", desc: "Form & On-Chain" },
            { title: "QR Verification", link: "/verify", desc: "Scanner Portal" },
            { title: "Authentic Result", link: "/verify/PROD-AP-9901", desc: "Green Verified View" },
            { title: "Product Management", link: "/products", desc: "Catalog Table" },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="glass-card p-3.5 rounded-xl border border-slate-800 hover:border-purple-500/40 space-y-1.5 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-purple-400 transition-colors">{item.title}</span>
                <Eye className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
              </div>
              <span className="text-slate-400 text-[10px] block">{item.desc}</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
