"use client";

import React from "react";
import { ArrowRight, BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WassceGrade } from "@/types";
import { GradeDropdown } from "./grade-dropdown";

const FIRST_SITTING_GRADES: WassceGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];
const SECOND_SITTING_OPTIONS: (WassceGrade | "N/A")[] = ["N/A", "A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

interface Step2CoreGradesProps {
  coreGrades: Record<string, WassceGrade | "">;
  onGradeChange: (subject: string, grade: WassceGrade) => void;
  hasSecondSitting: boolean;
  onToggleSecondSitting: (enabled: boolean) => void;
  secondSittingExam: string;
  onSecondSittingExamChange: (exam: string) => void;
  secondSittingGrades: Record<string, WassceGrade | "N/A">;
  onSecondSittingGradeChange: (subject: string, grade: WassceGrade | "N/A") => void;
  onContinue: () => void;
}

const CORE_SUBJECTS = [
  { id: "Social Studies", label: "Social Studies" },
  { id: "English Language", label: "English Language" },
  { id: "Core Mathematics", label: "Mathematics (Core)" },
  { id: "Integrated Science", label: "Integrated Science" },
];

export function Step2CoreGrades({
  coreGrades,
  onGradeChange,
  hasSecondSitting,
  onToggleSecondSitting,
  secondSittingExam,
  onSecondSittingExamChange,
  secondSittingGrades,
  onSecondSittingGradeChange,
  onContinue,
}: Step2CoreGradesProps) {
  const isAllCoreFilled = CORE_SUBJECTS.every((subj) => Boolean(coreGrades[subj.id]));

  return (
    <Card className="border-slate-200/90 shadow-sm bg-white rounded-3xl p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-98 duration-200">
      {/* Header Inside Card */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Core Subjects</h2>
          <p className="text-xs text-slate-400 font-normal">WASSCE grading system</p>
        </div>
      </div>

      {/* Core Subject Rows (1st Sitting) */}
      <div className="divide-y divide-slate-100">
        {CORE_SUBJECTS.map((subj) => {
          const currentGrade = coreGrades[subj.id] || "";
          return (
            <div
              key={subj.id}
              className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
            >
              <div>
                <span className="text-sm font-normal text-slate-800 block">
                  {subj.label}
                </span>
              </div>

              {/* Custom Smooth Animated Dropdown */}
              <GradeDropdown
                value={currentGrade}
                onChange={(g) => onGradeChange(subj.id, g)}
                options={FIRST_SITTING_GRADES}
                placeholder="Grade"
              />
            </div>
          );
        })}
      </div>

      {/* 2nd Sitting Section (Consistent Header & Seamless Expansion) */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        <button
          type="button"
          onClick={() => onToggleSecondSitting(!hasSecondSitting)}
          className="text-left group transition-colors py-1 cursor-pointer block"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-brand-blue group-hover:text-brand-darkBlue">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{hasSecondSitting ? "Remove 2nd Sitting" : "Add 2nd Sitting"}</span>
          </span>
          <span className="text-[11px] text-slate-400 group-hover:text-slate-500 font-normal block mt-0.5">
            If you retook some subjects in NOV/DEC or another WASSCE
          </span>
        </button>

        {hasSecondSitting && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {/* 2nd Sitting Exam Type */}
            <div>
              <span className="text-xs font-normal text-slate-700 block mb-2">
                2nd Sitting Exam Type
              </span>

              <div className="grid grid-cols-3 gap-2">
                {["WASSCE", "SSSCE", "NOVDEC"].map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => onSecondSittingExamChange(exam)}
                    className={`h-9 rounded-xl text-xs font-normal border transition-all cursor-pointer ${
                      secondSittingExam === exam
                        ? "bg-blue-50 border-brand-blue text-brand-blue font-medium shadow-2xs ring-1 ring-brand-blue"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {exam}
                  </button>
                ))}
              </div>
            </div>

            {/* 2nd Sitting Subject Retake Pickers */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-normal text-slate-400 block">
                Select grades only for core subjects you retook
              </span>

              <div className="divide-y divide-slate-100">
                {CORE_SUBJECTS.map((subj) => {
                  const retakeGrade = secondSittingGrades[subj.id] || "N/A";
                  return (
                    <div
                      key={`2nd-${subj.id}`}
                      className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                    >
                      <span className="text-sm font-normal text-slate-700">
                        {subj.label}
                      </span>

                      {/* Custom Smooth Animated Retake Dropdown */}
                      <GradeDropdown
                        value={retakeGrade}
                        onChange={(g) => onSecondSittingGradeChange(subj.id, g)}
                        options={SECOND_SITTING_OPTIONS}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Full-Width Continue Button */}
      <div className="pt-3">
        <Button
          type="button"
          disabled={!isAllCoreFilled}
          onClick={onContinue}
          className="w-full h-12 sm:h-13 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl shadow-md text-sm sm:text-base gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isAllCoreFilled ? "Continue to Elective Subjects" : "Select all 4 Core Grades to Continue"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
