"use client";

import React from "react";
import { WassceGrade } from "@/types";

const GRADE_OPTIONS: WassceGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

interface GradePillSelectorProps {
  value: WassceGrade;
  onChange: (grade: WassceGrade) => void;
  disabled?: boolean;
}

export function GradePillSelector({
  value,
  onChange,
  disabled = false,
}: GradePillSelectorProps) {
  return (
    <div className="grid grid-cols-9 gap-1 sm:gap-1.5 w-full sm:w-auto shrink-0">
      {GRADE_OPTIONS.map((grade) => {
        const isSelected = value === grade;
        const isFailing = grade === "F9";
        const isPassOnly = grade === "D7" || grade === "E8";

        let selectedClasses = "bg-brand-blue text-white shadow-sm ring-2 ring-blue-400/50 scale-[1.06] z-10 font-black";
        if (isSelected && isFailing) {
          selectedClasses = "bg-red-600 text-white shadow-sm ring-2 ring-red-400/50 scale-[1.06] z-10 font-black";
        } else if (isSelected && isPassOnly) {
          selectedClasses = "bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 scale-[1.06] z-10 font-black";
        }

        return (
          <button
            key={grade}
            type="button"
            disabled={disabled}
            onClick={() => onChange(grade)}
            className={`h-8 sm:h-8.5 w-full sm:w-7.5 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer select-none ${
              isSelected
                ? selectedClasses
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 active:scale-95"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={`Grade ${grade}`}
            aria-label={`Select grade ${grade}`}
          >
            {grade}
          </button>
        );
      })}
    </div>
  );
}
