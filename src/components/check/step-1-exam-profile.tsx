"use client";

import React from "react";
import { ArrowRight, FileText, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SHS_STREAM_PRESETS } from "@/data/subjects";

export type ExamOption = "WASSCE" | "SSSCE" | "NOVDEC";
export type GenderOption = "male" | "female" | "prefer_not_to_say";

interface Step1ExamProfileProps {
  examType: ExamOption | "";
  onExamTypeChange: (type: ExamOption) => void;
  gender: GenderOption | "";
  onGenderChange: (gender: GenderOption) => void;
  selectedStreamId: string;
  onStreamChange: (streamId: string) => void;
  onContinue: () => void;
}

const EXAM_OPTIONS: { id: ExamOption; label: string }[] = [
  { id: "WASSCE", label: "WASSCE" },
  { id: "SSSCE", label: "SSSCE" },
  { id: "NOVDEC", label: "NOVDEC" },
];

const GENDER_OPTIONS: { id: GenderOption; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "prefer_not_to_say", label: "Prefer not to say" },
];

export function Step1ExamProfile({
  examType,
  onExamTypeChange,
  gender,
  onGenderChange,
  selectedStreamId,
  onStreamChange,
  onContinue,
}: Step1ExamProfileProps) {
  const isStep1Complete = Boolean(examType && gender && selectedStreamId);
  return (
    <Card className="border-slate-200/90 shadow-sm bg-white rounded-3xl p-5 sm:p-7 space-y-6 animate-in fade-in zoom-in-98 duration-200">
      {/* 1. Which Exam Did You Take? */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <FileText className="h-4 w-4 text-brand-blue" />
          <span>Which Exam Did You Take?</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {EXAM_OPTIONS.map((opt) => {
            const isSelected = examType === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onExamTypeChange(opt.id)}
                className={`h-11 rounded-xl text-xs sm:text-sm font-medium transition-all border cursor-pointer select-none flex items-center justify-center ${
                  isSelected
                    ? "bg-blue-50 border-brand-blue text-brand-blue shadow-xs ring-1 ring-brand-blue font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Gender */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Users className="h-4 w-4 text-brand-blue" />
            <span>Gender</span>
          </div>
          <span className="text-[10px] text-slate-400 font-normal">
            Used for university cutoff points
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {GENDER_OPTIONS.map((opt) => {
            const isSelected = gender === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onGenderChange(opt.id)}
                className={`h-11 rounded-xl text-xs sm:text-sm font-medium transition-all border cursor-pointer select-none flex items-center justify-center px-1 text-center ${
                  isSelected
                    ? "bg-blue-50 border-brand-blue text-brand-blue shadow-xs ring-1 ring-brand-blue font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. What Did You Study? */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <GraduationCap className="h-4 w-4 text-brand-blue" />
          <span>What Did You Study?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SHS_STREAM_PRESETS.map((stream) => {
            const isSelected = selectedStreamId === stream.id;
            return (
              <button
                key={stream.id}
                type="button"
                onClick={() => onStreamChange(stream.id)}
                className={`h-12 px-4 rounded-xl text-xs sm:text-sm font-normal transition-all border cursor-pointer select-none flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-50 border-brand-blue text-brand-blue shadow-xs ring-1 ring-brand-blue font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{stream.name}</span>
                <span className="text-base">{stream.icon}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="pt-3">
        <Button
          type="button"
          disabled={!isStep1Complete}
          onClick={onContinue}
          className="w-full h-12 sm:h-13 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl shadow-md text-sm sm:text-base gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{isStep1Complete ? "Continue to Grade Entry" : "Select Exam, Gender & Programme to Continue"}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
