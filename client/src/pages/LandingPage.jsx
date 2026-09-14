import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FilePlus,
  Search,
  ShieldCheck,
  Fingerprint,
  Database,
  CheckCircle2,
  FileText,
  Clock,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12 font-sans text-slate-100">
      {/* Hero Section */}
      <section className="text-center space-y-5 pt-4 max-w-3xl mx-auto">
        <div className="inline-block px-3 py-1 rounded-md bg-[#0F172A] border border-[#1E293B] text-sky-400 text-xs font-semibold tracking-wider uppercase">
          VERIFYX
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
          Digital Asset Authentication
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          VerifyX registers original digital assets using SHA-256 fingerprints and allows files to be checked later for authenticity or modification.
        </p>

        {/* Primary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/assets/register"
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors border border-sky-500/50 shadow-sm"
          >
            <FilePlus className="w-4 h-4" />
            <span>Register Asset</span>
          </Link>

          <Link
            to={user ? "/verify" : "/verify-product"}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 border border-[#1E293B] hover:border-slate-700 font-medium text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Search className="w-4 h-4 text-sky-400" />
            <span>Verify Asset</span>
          </Link>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <h2 className="text-lg font-semibold text-white tracking-tight">Verification Process</h2>
          <p className="text-xs text-slate-400">Four-step cryptographic asset lifecycle</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 01 */}
          <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                STEP 01
              </span>
              <FilePlus className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Register</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Register the original digital asset file into the system.
            </p>
          </div>

          {/* Step 02 */}
          <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                STEP 02
              </span>
              <Fingerprint className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Fingerprint</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Generate its unique SHA-256 digital fingerprint signature.
            </p>
          </div>

          {/* Step 03 */}
          <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                STEP 03
              </span>
              <Database className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Secure Record</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Store the authenticity record securely in the database repository.
            </p>
          </div>

          {/* Step 04 */}
          <div className="p-4 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-500/20">
                STEP 04
              </span>
              <ShieldCheck className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Verify</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Upload the file again and compare its fingerprint against stored records.
            </p>
          </div>
        </div>
      </section>

      {/* Product Preview / Application Interface Panel */}
      <section className="space-y-4">
        <div className="border-b border-[#1E293B] pb-3">
          <h2 className="text-lg font-semibold text-white tracking-tight">Software Preview</h2>
          <p className="text-xs text-slate-400">Sample output from a completed asset verification check</p>
        </div>

        <div className="rounded-lg bg-[#0F172A] border border-[#1E293B] overflow-hidden shadow-sm">
          {/* Header Bar */}
          <div className="px-5 py-3.5 bg-[#090D16] border-b border-[#1E293B] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-semibold text-white">Verification Result</span>
            </div>
            <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              <span>Authentic Asset</span>
            </div>
          </div>

          {/* Preview Details Content */}
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3">
              <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                <span className="text-slate-400 block text-[11px] mb-1">Registered Asset</span>
                <span className="font-semibold text-slate-100 font-mono">Q3_Executive_Audit_Report.pdf</span>
              </div>

              <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                <span className="text-slate-400 block text-[11px] mb-1">SHA-256 Digital Fingerprint</span>
                <span className="font-mono text-slate-300 break-all text-[11px]">
                  d60224ef9e86f8cf6fc3ac7718d96ecfe558663c8c4f374d5c8fc1c11e03d93d
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px] mb-1">Hash Match</span>
                  <span className="font-semibold text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Match Verified</span>
                  </span>
                </div>
                <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px] mb-1">File Integrity</span>
                  <span className="font-semibold text-slate-200">Unmodified (100%)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px] mb-1">Registration Date</span>
                  <span className="text-slate-300 font-mono text-[11px] flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>2026-09-14 14:17 UTC</span>
                  </span>
                </div>
                <div className="bg-[#090D16] p-3 rounded border border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px] mb-1">Verification Date</span>
                  <span className="text-slate-300 font-mono text-[11px] flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>2026-09-14 14:18 UTC</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
