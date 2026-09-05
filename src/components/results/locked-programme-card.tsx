"use client";

import React, { useState } from "react";
import { CheckCircle2, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgrammeMatchResult } from "@/types";

interface LockedProgrammeCardProps {
  index?: number;
  match?: ProgrammeMatchResult;
  onUnlockClick: () => void;
}

const TEASER_SAMPLES = [
  {
    uni: "University of Ghana",
    shortName: "UG",
    campus: "Legon Campus, Accra",
    prog: "BSc. Biological & Medical Science Stream",
    faculty: "College of Basic & Applied Sciences",
    cutoff: "Aggregate ≤ 16",
    logoUrl: "/logos/ug.png",
  },
  {
    uni: "Kwame Nkrumah Univ. of Science & Tech.",
    shortName: "KNUST",
    campus: "Main Campus, Kumasi",
    prog: "BSc. Computer Science & Software Engineering",
    faculty: "Faculty of Physical & Computational Sciences",
    cutoff: "Aggregate ≤ 14",
    logoUrl: "/logos/knust.png",
  },
  {
    uni: "University of Cape Coast",
    shortName: "UCC",
    campus: "Main Campus, Cape Coast",
    prog: "Doctor of Pharmacy / BSc. Nursing",
    faculty: "College of Health & Allied Sciences",
    cutoff: "Aggregate ≤ 12",
    logoUrl: "/logos/ucc.png",
  },
];

export function LockedProgrammeCard({ index = 0, match, onUnlockClick }: LockedProgrammeCardProps) {
  const [imgError, setImgError] = useState(false);
  const fallback = TEASER_SAMPLES[index % TEASER_SAMPLES.length];

  const uniName = match?.university.name || fallback.uni;
  const shortName = match?.university.shortName || fallback.shortName;
  const location = match?.university.location || fallback.campus;
  const progName = match?.programme.name || fallback.prog;
  const faculty = match?.programme.faculty || fallback.faculty;
  const cutoffText = match?.effectiveCutoff
    ? `Aggregate ≤ ${match.effectiveCutoff}`
    : fallback.cutoff;
  const logoUrl = match?.university.logoUrl || fallback.logoUrl;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onUnlockClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onUnlockClick();
        }
      }}
      className="relative group cursor-pointer rounded-3xl overflow-hidden transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-blue"
    >
      {/* Blurred Background Card */}
      <Card className="border border-slate-200/90 bg-white rounded-3xl p-5 space-y-4 filter blur-[6px] opacity-40 select-none pointer-events-none transition-all">
        {/* Top Header: Uni Info & Status Badge */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center overflow-hidden mt-0.5">
                {logoUrl && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt={`${uniName} logo`}
                    className="h-full w-full object-contain"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                ) : (
                  <span className="text-[11px] font-black text-brand-blue">
                    {shortName.slice(0, 3)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                    {uniName}
                  </span>
                  {shortName && (
                    <span className="text-[10px] sm:text-[11px] font-black text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/80 shrink-0">
                      {shortName}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                  {location}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 whitespace-nowrap shadow-2xs">
              <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-600" />
              <span>Direct Qualified</span>
            </span>
          </div>

          <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-snug">
              {progName}
            </h4>
            <p className="text-xs text-slate-500 font-normal">
              {faculty}
            </p>
          </div>
        </div>

        {/* Cutoff row */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
          <span>Official Cutoff: {cutoffText}</span>
          <span className="font-bold text-emerald-600">You Qualify</span>
        </div>

        {/* Prerequisites row */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-xl text-[11px] bg-slate-100 text-slate-500 font-medium">
            Core Maths: Credit Required
          </span>
          <span className="px-2.5 py-1 rounded-xl text-[11px] bg-slate-100 text-slate-500 font-medium">
            English: Credit Required
          </span>
          <span className="px-2.5 py-1 rounded-xl text-[11px] bg-slate-100 text-slate-500 font-medium">
            Science / Social: Credit Required
          </span>
        </div>
      </Card>

      {/* Sharp Crisp Lock Overlay in Center */}
      <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-900/5 hover:bg-slate-900/10 transition-colors">
        <div className="px-4 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xl backdrop-blur-md transition-transform group-hover:scale-105 border border-white/10">
          <Lock className="h-4 w-4 text-amber-400 shrink-0" />
          <span>Locked Qualifying Programme • Click to Unlock</span>
        </div>
      </div>
    </div>
  );
}
