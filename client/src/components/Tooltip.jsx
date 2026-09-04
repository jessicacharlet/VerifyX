import React, { useState } from "react";
import { HelpCircle } from "lucide-react";

export default function Tooltip({ text, content, children }) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-flex items-center group">
      {children ? (
        <span
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
          className="cursor-help underline decoration-dotted underline-offset-4 decoration-[#64748B] hover:decoration-sky-400 transition-colors"
        >
          {children}
        </span>
      ) : null}

      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="ml-1 text-[#64748B] hover:text-sky-400 transition-colors focus:outline-none"
        aria-label="More information"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-[#0D1422] text-[#F8FAFC] text-[11px] rounded-lg border border-[#22304A] shadow-xl z-50 pointer-events-none transition-all animate-fadeIn">
          {text || content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#22304A]" />
        </div>
      )}
    </span>
  );
}
