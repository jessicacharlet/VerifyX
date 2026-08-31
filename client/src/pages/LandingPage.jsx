import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Upload, Search, Lock, Cpu, Database, CheckCircle, FileCode, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="space-y-16 py-12 font-sans">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 pt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-medium shadow-lg">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Blockchain-Based Digital Asset Authentication</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Cryptographic Fingerprinting & Verification for Digital Assets
        </h1>

        <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          VerifyX helps individuals and organizations securely register digital assets, generate SHA-256 cryptographic fingerprints, and instantly verify authenticity using Ethereum blockchain proofs.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/assets/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#070A0F] font-bold text-sm flex items-center justify-center space-x-2.5 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Upload className="w-4 h-4" />
            <span>Register Digital Asset</span>
          </Link>

          <Link
            to="/verify"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0D121A] hover:bg-[#111821] text-white border border-[#1E293B] font-semibold text-sm flex items-center justify-center space-x-2.5 transition-all"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Verify Asset Authenticity</span>
          </Link>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0D121A] p-6 rounded-2xl border border-[#1E293B] space-y-4 hover:border-cyan-500/40 transition-colors shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">1. SHA-256 Hash Generation</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              When a file is uploaded, VerifyX reads raw file bytes and computes a deterministic SHA-256 cryptographic hash representation.
            </p>
          </div>

          <div className="bg-[#0D121A] p-6 rounded-2xl border border-[#1E293B] space-y-4 hover:border-cyan-500/40 transition-colors shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">2. Blockchain Smart Contract</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              The asset's SHA-256 fingerprint is recorded on an Ethereum smart contract (<code className="font-mono text-cyan-300">AssetAuthenticator.sol</code>), creating an immutable proof of registration.
            </p>
          </div>

          <div className="bg-[#0D121A] p-6 rounded-2xl border border-[#1E293B] space-y-4 hover:border-cyan-500/40 transition-colors shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">3. Instant Modification Check</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Upload any digital file later to re-generate its hash, compare against database and blockchain records, and detect any content modification.
            </p>
          </div>
        </div>
      </section>

      {/* Security Architecture Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0D121A] p-8 rounded-2xl border border-[#1E293B] space-y-6 shadow-2xl">
          <div className="border-b border-[#1E293B] pb-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>VerifyX Digital Security Architecture</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#111821] border border-[#1E293B] space-y-1">
              <div className="font-semibold text-white">Deterministic Hashing</div>
              <div className="text-[#94A3B8]">Same byte content always produces identical SHA-256 hash.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#111821] border border-[#1E293B] space-y-1">
              <div className="font-semibold text-white">Tamper Evidence</div>
              <div className="text-[#94A3B8]">Changing even a single byte alters the output hash completely.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#111821] border border-[#1E293B] space-y-1">
              <div className="font-semibold text-white">Ethereum Audit Layer</div>
              <div className="text-[#94A3B8]">Smart contracts store asset hashes and transaction proofs on-chain.</div>
            </div>

            <div className="p-4 rounded-xl bg-[#111821] border border-[#1E293B] space-y-1">
              <div className="font-semibold text-white">Audit Trail Logging</div>
              <div className="text-[#94A3B8]">Every verification attempt is recorded in persistent MongoDB history.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
