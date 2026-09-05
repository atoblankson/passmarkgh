"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StudentSubjectGrade } from "@/types";

interface AggregateSidebarProps {
  aggregate: number;
  bestCore: StudentSubjectGrade[];
  bestElectives: StudentSubjectGrade[];
  isValid: boolean;
  errors: string[];
  onSubmit: () => void;
  isLoading?: boolean;
  estimatedMatches: number;
}

function SmoothNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startVal = displayValue;
    const endVal = value;
    if (startVal === endVal) return;

    let startTime: number | null = null;
    const duration = 200;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(startVal + (endVal - startVal) * progress);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value, displayValue]);

  return (
    <span className="tabular-nums">
      {displayValue < 10 ? `0${displayValue}` : displayValue}
    </span>
  );
}

export function AggregateSidebar({
  aggregate,
  bestCore,
  bestElectives,
  isValid,
  errors,
  onSubmit,
  isLoading = false,
  estimatedMatches,
}: AggregateSidebarProps) {
  // Aggregate Tier Analysis
  let tierLabel = "Direct Degree Eligible";
  let tierColor = "text-emerald-300";

  if (aggregate <= 10) {
    tierLabel = "Top Competitive Tier (Medicine, Law, Eng.)";
    tierColor = "text-amber-300";
  } else if (aggregate <= 15) {
    tierLabel = "Highly Competitive (CS, Nursing, Business)";
    tierColor = "text-emerald-300";
  } else if (aggregate <= 24) {
    tierLabel = "Strong Public Degree Tier";
    tierColor = "text-blue-200";
  } else if (aggregate <= 36) {
    tierLabel = "Technical Universities & Selected Degrees";
    tierColor = "text-amber-200";
  } else {
    tierLabel = "Diploma / Pre-University Options";
    tierColor = "text-slate-300";
  }

  const coreSum = bestCore.reduce((sum, item) => sum + (typeof item.grade === "string" ? parseInt(item.grade.slice(1)) || 0 : 0), 0);
  const elecSum = bestElectives.reduce((sum, item) => sum + (typeof item.grade === "string" ? parseInt(item.grade.slice(1)) || 0 : 0), 0);

  return (
    <div className="space-y-4">
      {/* Primary Aggregate Card */}
      <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl relative overflow-hidden">
        {/* Soft Ambient Inner Glow */}
        <div className="absolute top-0 right-0 -z-0 h-40 w-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between border-b border-blue-400/30 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
              WAEC Best 6 Aggregate
            </span>
            <Badge className="bg-white/20 text-white border-0 text-[10px] font-bold">
              Official Formula
            </Badge>
          </div>

          <div className="my-6 text-center">
            <div className="text-6xl font-extrabold tracking-tight text-white inline-block">
              {isValid ? <SmoothNumber value={aggregate} /> : "--"}
            </div>
            <div className={`mt-1.5 text-xs font-bold ${tierColor}`}>
              {isValid ? tierLabel : "Complete your 6 subjects"}
            </div>
          </div>

          {/* Core & Elective Breakdown Pills */}
          <div className="space-y-2 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm text-xs text-blue-50 border border-white/10">
            <div className="flex justify-between items-center">
              <span className="text-blue-200">3 Core Points:</span>
              <span className="font-bold tabular-nums text-white">
                {isValid ? coreSum : "--"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-200">3 Best Electives:</span>
              <span className="font-bold tabular-nums text-white">
                {isValid ? elecSum : "--"}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2 flex justify-between items-center font-bold text-white">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-emerald-300" />
                <span>Estimated Matches:</span>
              </span>
              <span className="text-emerald-300 font-extrabold text-sm">
                {isValid ? `${estimatedMatches}+ Programmes` : "--"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={!isValid || isLoading}
              className="w-full h-12 bg-white text-brand-darkBlue hover:bg-blue-50 font-bold rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span>{isLoading ? "Checking Admission Chances..." : "Check My Admission Chances"}</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-blue-100 font-medium">
            <Sparkles className="h-3 w-3 text-amber-300" />
            <span>Covers UG, KNUST, UCC, UDS, UHAS &amp; all Ghana unis</span>
          </div>
        </div>
      </div>

      {/* Validation or Error Box */}
      {errors.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs space-y-2 text-amber-900">
          <div className="flex items-center gap-1.5 font-bold text-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>Action Required:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-amber-700">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Reassurance Info Card */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Official Ghana WAEC Calculation Standard</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-500">
          English and Core Maths are mandatory. The better of Integrated Science or Social Studies is selected automatically. Only your top 3 elective grades are counted.
        </p>
      </div>
    </div>
  );
}
