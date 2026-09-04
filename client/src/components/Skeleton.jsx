import React from "react";

export function SkeletonCard() {
  return (
    <div className="bg-[#111A2A] p-5 rounded-xl border border-[#22304A] space-y-3 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 bg-[#162238] rounded"></div>
        <div className="h-4 w-4 bg-[#162238] rounded-full"></div>
      </div>
      <div className="h-8 w-16 bg-[#162238] rounded"></div>
      <div className="h-2.5 w-36 bg-[#162238] rounded"></div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="py-3 flex items-center justify-between animate-pulse">
      <div className="space-y-1.5">
        <div className="h-3.5 w-36 bg-[#162238] rounded"></div>
        <div className="h-2.5 w-24 bg-[#162238] rounded"></div>
      </div>
      <div className="h-6 w-20 bg-[#162238] rounded-full"></div>
    </div>
  );
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="space-y-3 p-4 bg-[#111A2A] rounded-xl border border-[#22304A]">
      <div className="h-4 w-full bg-[#162238] rounded animate-pulse"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
