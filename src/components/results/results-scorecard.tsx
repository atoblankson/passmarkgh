"use client";

import React, { useState, useRef, useEffect } from "react";
import { Building2, CheckCircle, Info } from "lucide-react";
import { SHS_STREAM_PRESETS } from "@/data/subjects";

function FemaleConcessionBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      className="relative inline-block"
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Female Concession Policy explanation"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-pink-500/20 hover:bg-pink-500/30 active:bg-pink-500/40 border border-pink-300/40 text-pink-100 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300/50"
      >
        <Info className="h-3 w-3 text-pink-200 shrink-0" />
        <span>Female Concession Applied</span>
      </button>

      {isOpen && (
        <div
          role="tooltip"
          className="absolute right-0 top-full mt-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900/95 text-slate-100 backdrop-blur-md border border-white/20 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center gap-1.5 font-semibold text-xs text-pink-200 mb-1.5">
            <Info className="h-3.5 w-3.5 text-pink-300 shrink-0" />
            <span>Affirmative Action Concession</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-200 font-normal">
            Ghanaian public universities (e.g., UG, KNUST) apply an affirmative action policy, granting a 1 to 2 point concession on cut-off aggregates for eligible female applicants into competitive and STEM programmes.
          </p>
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-pink-200/90 font-medium">
            <span>University Admissions Policy</span>
            <span className="text-slate-400">1–2 Points Concession</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ResultsScorecardProps {
  aggregate: number;
  corePoints: number;
  electivePoints: number;
  gender: string;
  selectedStreamId: string;
  totalQualified: number;
  totalInstitutions: number;
}

export function ResultsScorecard({
  aggregate,
  corePoints,
  electivePoints,
  gender,
  selectedStreamId,
  totalQualified,
  totalInstitutions,
}: ResultsScorecardProps) {
  const stream =
    SHS_STREAM_PRESETS.find((s) => s.id === selectedStreamId) ||
    SHS_STREAM_PRESETS[0];

  const isFemale = gender === "female";

  let tierLabel = "Direct Degree Qualified";
  if (aggregate <= 9) {
    tierLabel = "Top Tier Competitive (Medicine, Law, CS, Engineering)";
  } else if (aggregate <= 15) {
    tierLabel = "High Competitive Tier (Computing, Nursing, Business)";
  } else if (aggregate <= 24) {
    tierLabel = "Standard Degree Tier (Arts, Sciences, Administration)";
  } else if (aggregate <= 36) {
    tierLabel = "Technical & Broad Admissions Tier";
  }

  return (
    <div className="rounded-3xl border border-blue-200/70 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 sm:p-7 text-white shadow-lg relative mb-6">
      {/* Soft Ambient Light Glow */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-400/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              Official WAEC Best 6
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/15 text-white">
              {stream.name}
            </span>
          </div>

          {isFemale && <FemaleConcessionBadge />}
        </div>

        {/* Big Number & Points Row */}
        <div className="flex items-end justify-between gap-4 py-1">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
                {aggregate < 10 ? `0${aggregate}` : aggregate}
              </span>
              <span className="text-xs font-normal text-blue-200">Aggregate</span>
            </div>
            <p className="text-xs text-blue-100 font-normal mt-1">
              {tierLabel}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="inline-flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-blue-200 font-normal">Core:</span>
              <span className="font-semibold text-white">{corePoints}</span>
              <span className="text-blue-300 font-normal">•</span>
              <span className="text-blue-200 font-normal">Electives:</span>
              <span className="font-semibold text-white">{electivePoints}</span>
            </div>
          </div>
        </div>

        {/* Summary Metrics Bar */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-3 border-t border-blue-400/30">
          <div className="flex items-center gap-2.5 bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/10 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300 shrink-0">
              <CheckCircle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {totalQualified}
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-100 font-normal truncate">
                Qualified Programmes
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/10 rounded-2xl p-2.5 sm:p-3 border border-white/10 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-blue-300/20 text-blue-200 shrink-0">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base sm:text-lg font-extrabold text-white leading-tight">
                {totalInstitutions}
              </div>
              <div className="text-[10px] sm:text-[11px] text-blue-100 font-normal truncate">
                Institutions Matched
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
