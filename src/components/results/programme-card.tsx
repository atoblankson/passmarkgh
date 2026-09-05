"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgrammeMatchResult } from "@/types";

interface ProgrammeCardProps {
  match: ProgrammeMatchResult;
}

export function ProgrammeCard({ match }: ProgrammeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { programme, university, studentAggregate: userAggregate } = match;
  const statusTier = match.statusTier;
  const effectiveCutoff = match.effectiveCutoff ?? match.cutoffAggregate;

  let badgeLabel = "Direct Qualified";
  let badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";

  if (statusTier === "qualified") {
    badgeLabel = "Direct Qualified";
    badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (statusTier === "competitive") {
    badgeLabel = "Competitive";
    badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (statusTier === "fee_paying") {
    badgeLabel = "Fee-Paying Eligible";
    badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (statusTier === "prerequisite_missing") {
    badgeLabel = "Prerequisite Missing";
    badgeStyle = "bg-orange-50 text-orange-700 border-orange-200";
  } else {
    badgeLabel = "Missed Cutoff";
    badgeStyle = "bg-slate-50 text-slate-600 border-slate-200";
  }

  const reqSubjects = programme.requirements?.requiredSubjects || [];
  const minGrades = programme.requirements?.minimumGrades || {};
  const duration = programme.durationYears ? `${programme.durationYears} Years` : "4 Years";

  return (
    <Card className="border-slate-200/90 shadow-2xs hover:shadow-sm bg-white rounded-3xl p-5 transition-all space-y-4">
      {/* Top Header: University Info & Status Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2.5">
          {/* University Avatar + Full Name & Location below */}
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200/90 bg-white p-1 shadow-2xs flex items-center justify-center overflow-hidden mt-0.5">
              {university.logoUrl && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={university.logoUrl}
                  alt={`${university.name} logo`}
                  className="h-full w-full object-contain"
                  onError={() => setImgError(true)}
                  loading="lazy"
                />
              ) : (
                <span className="text-[11px] font-black text-brand-blue">
                  {university.shortName.slice(0, 3)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  {university.name}
                </span>
                {university.shortName && (
                  <span className="text-[10px] sm:text-[11px] font-black text-brand-blue bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100/80 shrink-0">
                    {university.shortName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                {university.location}
              </p>
            </div>
          </div>

          {/* Status Pill Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 whitespace-nowrap shadow-2xs ${badgeStyle}`}
          >
            {match.qualified ? (
              <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
            )}
            <span>{badgeLabel}</span>
          </span>
        </div>

        {/* Programme Title & Faculty */}
        <div className="space-y-0.5 pt-1.5 border-t border-slate-100">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {programme.name}
          </h3>
          {programme.faculty && (
            <p className="text-xs font-normal text-slate-500">
              {programme.faculty}
            </p>
          )}
        </div>
      </div>

      {/* Cutoff & Aggregate Comparison Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-normal">Official Cutoff:</span>
          <span className="font-bold text-slate-900">
            {effectiveCutoff !== null ? `Aggregate ≤ ${effectiveCutoff}` : "General Threshold"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-normal">Your Aggregate:</span>
          <span className={`font-black ${match.qualified ? "text-emerald-700" : "text-amber-700"}`}>
            Aggregate {userAggregate}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>{duration}</span>
        </div>
      </div>

      {/* Prerequisite Breakdown Chips */}
      {reqSubjects.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Required Subject Minimums
          </div>
          <div className="flex flex-wrap gap-1.5">
            {reqSubjects.map((sub) => {
              const reqGrade = minGrades[sub] || "C6";
              return (
                <span
                  key={sub}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100/80 text-slate-700 border border-slate-200/60"
                >
                  <span className="capitalize">{sub}</span>:
                  <span className="font-bold text-slate-900">≤ {reqGrade}</span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Notes / Missing Requirements Explanation */}
      {(match.notes || (match.missingRequirements && match.missingRequirements.length > 0)) && (
        <p className="text-xs text-slate-600 bg-blue-50/60 p-2.5 rounded-2xl border border-blue-100/80 leading-relaxed">
          💡 {match.notes || match.missingRequirements?.join(". ")}
        </p>
      )}

      {/* Collapsible Details */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-slate-600 hover:text-slate-900 px-2 h-8 rounded-lg gap-1"
        >
          <span>{expanded ? "Hide Requirements" : "View Full Faculty Requirements"}</span>
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </Button>

        {programme.careerProspects && programme.careerProspects.length > 0 && (
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            Career: {programme.careerProspects[0]}
          </span>
        )}
      </div>

      {/* Expanded Faculty Details Drawer */}
      {expanded && (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3 animate-in fade-in">
          <div>
            <span className="font-bold text-slate-900">Faculty/Department:</span>{" "}
            <span className="text-slate-600">{programme.faculty || "Not Specified"}</span>
          </div>

          {programme.careerProspects && programme.careerProspects.length > 0 && (
            <div>
              <span className="font-bold text-slate-900">Top Career Prospects:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {programme.careerProspects.map((career, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px]"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>
          )}

          {university.website && (
            <div className="pt-1">
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-brand-blue hover:text-brand-darkBlue"
              >
                <span>Official {university.shortName} Portal</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
