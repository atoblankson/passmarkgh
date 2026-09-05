"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WizardStepIndicatorProps {
  currentStep: 1 | 2 | 3;
  totalSteps?: number;
  onBack?: () => void;
}

const STEP_TITLES = {
  1: {
    title: "Your Background",
    subtitle: "Select your exam type, gender, and high school programme",
  },
  2: {
    title: "Core Subject Grades",
    subtitle: "Select the grade you obtained for each core subject",
  },
  3: {
    title: "Elective Subject Grades",
    subtitle: "Enter your elective grades to calculate your aggregate & match",
  },
};

export function WizardStepIndicator({
  currentStep,
  totalSteps = 3,
  onBack,
}: WizardStepIndicatorProps) {
  const { title, subtitle } = STEP_TITLES[currentStep];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Header Row with Back Button on Left and 3 Segmented Bars in Center */}
      <div className="relative flex items-center justify-center min-h-[36px]">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer py-1 pr-2 select-none"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
        )}

        {/* 3 Segmented Progress Bars matching Competitor screenshot */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((step) => {
            const isActive = step === currentStep;
            const isCompleted = step < currentStep;
            return (
              <div
                key={step}
                className={`h-1.5 w-7 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-brand-blue"
                    : isCompleted
                    ? "bg-blue-300"
                    : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Step Pill, Title & Subtitle */}
      <div className="text-center space-y-1.5">
        <Badge className="bg-blue-50 text-brand-darkBlue border-blue-200/80 px-3 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
          <span>
            Step {currentStep} of {totalSteps}
          </span>
        </Badge>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
