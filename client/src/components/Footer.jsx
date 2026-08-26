import React from "react";
import { ShieldCheck, Cpu, Database, Lock, Layers, Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">VeriMark</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enterprise decentralized product authenticity verification platform. Protecting global supply chains with Ethereum smart contracts, SHA-256 digital signatures, and instant QR verification.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Technology Stack</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center space-x-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Ethereum Solidity Smart Contracts</span>
            </li>
            <li className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>SHA-256 Cryptographic Hashing</span>
            </li>
            <li className="flex items-center space-x-2">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>MongoDB Off-Chain Storage</span>
            </li>
            <li className="flex items-center space-x-2">
              <Code className="w-3.5 h-3.5 text-purple-400" />
              <span>Node.js REST Express API</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Quick Navigation</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="/verify" className="hover:text-blue-400 transition-colors">
                Public Product Verification
              </a>
            </li>
            <li>
              <a href="/register-product" className="hover:text-blue-400 transition-colors">
                Register Product Metadata
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-blue-400 transition-colors">
                Product Catalog & Search
              </a>
            </li>
            <li>
              <a href="/admin" className="hover:text-purple-400 transition-colors">
                Admin Security Governance
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Security & Trust</h4>
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Tamper-Resistant Ledger</span>
            </div>
            <p className="text-[11px] text-slate-400">
              All registered product identities are cryptographically bound to immutable on-chain smart contract hashes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} VeriMark Platform. Built for production-quality product authenticity verification.
      </div>
    </footer>
  );
}
