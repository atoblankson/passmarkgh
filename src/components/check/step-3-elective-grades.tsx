"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, BookOpen, Plus, Building2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WassceGrade } from "@/types";
import { WASSCE_ELECTIVE_SUBJECTS, SHS_STREAM_PRESETS } from "@/data/subjects";
import { GradeDropdown } from "./grade-dropdown";

const GRADE_OPTIONS: WassceGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

export interface ElectiveItem {
  slotId: string;
  subjectName: string;
  grade: WassceGrade | "";
}

interface Step3ElectiveGradesProps {
  selectedStreamId: string;
  electives: ElectiveItem[];
  onToggleSubject: (subjectName: string) => void;
  onGradeChange: (slotId: string, grade: WassceGrade) => void;
  aggregate: number;
  corePoints: number;
  electivePoints: number;
  estimatedMatches: number;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function Step3ElectiveGrades({
  selectedStreamId,
  electives,
  onToggleSubject,
  onGradeChange,
  aggregate,
  corePoints,
  electivePoints,
  estimatedMatches,
  onSubmit,
  isSubmitting = false,
}: Step3ElectiveGradesProps) {
  const [isOtherMenuOpen, setIsOtherMenuOpen] = useState(false);
  const otherMenuRef = useRef<HTMLDivElement>(null);

  const streamPreset =
    SHS_STREAM_PRESETS.find((p) => p.id === selectedStreamId) ||
    SHS_STREAM_PRESETS[0];

  const streamName = streamPreset.name;
  const suggestedPills = streamPreset.suggestedElectives || streamPreset.defaultElectives;

  const selectedCount = electives.length;
  const allElectivesGraded = selectedCount >= 3 && electives.every((e) => Boolean(e.grade));
  const canSubmit = allElectivesGraded;

  // Close other menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (otherMenuRef.current && !otherMenuRef.current.contains(event.target as Node)) {
        setIsOtherMenuOpen(false);
      }
    }

    if (isOtherMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOtherMenuOpen]);

  // Subjects not in the suggested list
  const otherSubjects = WASSCE_ELECTIVE_SUBJECTS.filter(
    (s) => !suggestedPills.includes(s.name)
  );

  let buttonText = "Check My Admission Chances";
  if (isSubmitting) {
    buttonText = "Checking Admission Chances...";
  } else if (selectedCount < 3) {
    buttonText = `Select ${3 - selectedCount} more elective${3 - selectedCount === 1 ? "" : "s"} (3–4 required)`;
  } else if (!allElectivesGraded) {
    buttonText = "Select grades for all electives";
  }

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-98 duration-200">
      <Card className="border-slate-200/90 shadow-sm bg-white rounded-3xl p-5 sm:p-7 space-y-6">
        {/* Header Inside Card */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Elective Subjects</h2>
            <p className="text-xs text-slate-400 font-normal">
              Select 3–4 electives from {streamName} · {selectedCount}/4 chosen
            </p>
          </div>
        </div>

        {/* 1. Tap to select elective subjects (Pill Matrix) */}
        <div className="space-y-3">
          <span className="text-xs font-normal text-slate-600 block">
            Tap to select your elective subjects
          </span>

          <div className="flex flex-wrap gap-2">
            {suggestedPills.map((subjName) => {
              const isSelected = electives.some((e) => e.subjectName === subjName);
              const isDisabled = !isSelected && selectedCount >= 4;

              return (
                <button
                  key={subjName}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onToggleSubject(subjName)}
                  className={`h-9 px-3.5 rounded-full text-xs sm:text-sm transition-all border cursor-pointer select-none flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-50 border-brand-blue text-brand-blue font-medium ring-1 ring-brand-blue shadow-2xs"
                      : isDisabled
                      ? "bg-slate-50 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed font-normal"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-normal"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                  <span>{subjName}</span>
                </button>
              );
            })}

            {/* + Other Subject Popover Pill */}
            <div className="relative inline-block" ref={otherMenuRef}>
              <button
                type="button"
                disabled={selectedCount >= 4}
                onClick={() => setIsOtherMenuOpen(!isOtherMenuOpen)}
                className={`h-9 px-3.5 rounded-full text-xs sm:text-sm border border-dashed border-slate-300 text-slate-600 hover:border-brand-blue hover:text-brand-blue hover:bg-blue-50/40 transition-all cursor-pointer select-none flex items-center gap-1 font-normal ${
                  selectedCount >= 4 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Other subject</span>
              </button>

              {isOtherMenuOpen && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 w-56 max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 custom-scrollbar">
                  <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1">
                    All Available Electives
                  </div>
                  {otherSubjects.map((subj) => {
                    const isSelected = electives.some((e) => e.subjectName === subj.name);
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => {
                          onToggleSubject(subj.name);
                          setIsOtherMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer select-none flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 text-brand-blue font-medium"
                            : "text-slate-700 hover:bg-slate-50 font-normal"
                        }`}
                      >
                        <span className="truncate">{subj.name}</span>
                        {isSelected && <Check className="h-3 w-3 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Select grade for each elective (Dynamic Grade Rows) */}
        {selectedCount > 0 ? (
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-xs font-normal text-slate-600 block">
              Select your grade for each elective
            </span>

            <div className="divide-y divide-slate-100">
              {electives.map((slot) => (
                <div
                  key={slot.slotId}
                  className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                >
                  <span className="text-sm font-normal text-slate-800">
                    {slot.subjectName}
                  </span>

                  <GradeDropdown
                    value={slot.grade}
                    onChange={(g) => onGradeChange(slot.slotId, g)}
                    options={GRADE_OPTIONS}
                    placeholder="Grade"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-100 text-center py-6 text-slate-400 text-xs font-normal">
            Tap 3–4 elective subject pills above to choose your subjects.
          </div>
        )}
      </Card>

      {/* Real-time Aggregate Scorecard */}
      {canSubmit && (
        <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-md relative overflow-hidden animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200 block">
                Calculated Best 6 Aggregate
              </span>
              <div className="text-4xl font-black tracking-tight text-white mt-0.5">
                {aggregate < 10 ? `0${aggregate}` : aggregate}
              </div>
              <div className="text-[11px] text-blue-100 mt-1 flex items-center gap-2 font-normal">
                <span>Core: {corePoints}</span>
                <span>•</span>
                <span>Electives: {electivePoints}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-400/30">
                <Building2 className="h-3.5 w-3.5" />
                <span>{estimatedMatches}+ Matches</span>
              </span>
              <p className="text-[10px] text-blue-200 mt-1 font-normal">
                across UG, KNUST, UCC &amp; more
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Full-width Find Matches Button */}
      <div className="pt-2">
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="w-full h-12 sm:h-13 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl shadow-md text-sm sm:text-base gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
