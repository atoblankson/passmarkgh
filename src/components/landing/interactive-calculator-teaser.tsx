"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNumericGrade } from "@/lib/grading/grades";
import { WassceGrade } from "@/types";

const GRADE_OPTIONS: WassceGrade[] = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

function SmoothAggregate({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startVal = displayValue;
    const endVal = value;
    if (startVal === endVal) return;

    let startTime: number | null = null;
    const duration = 200; // Snappy 200ms transition
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

interface SubjectItem {
  id: string;
  name: string;
  category: "core" | "elective";
  subtitle: string;
  defaultGrade: WassceGrade;
}

const SUBJECT_ITEMS: SubjectItem[] = [
  {
    id: "eng",
    name: "English Language",
    category: "core",
    subtitle: "Core (Mandatory)",
    defaultGrade: "A1",
  },
  {
    id: "math",
    name: "Core Mathematics",
    category: "core",
    subtitle: "Core (Mandatory)",
    defaultGrade: "B2",
  },
  {
    id: "sci",
    name: "Integrated Science",
    category: "core",
    subtitle: "Core (Science option)",
    defaultGrade: "A1",
  },
  {
    id: "soc",
    name: "Social Studies",
    category: "core",
    subtitle: "Core (Social option)",
    defaultGrade: "B3",
  },
  {
    id: "el1",
    name: "Elective 1",
    category: "elective",
    subtitle: "e.g. Elective Maths",
    defaultGrade: "B2",
  },
  {
    id: "el2",
    name: "Elective 2",
    category: "elective",
    subtitle: "e.g. Physics / Econ",
    defaultGrade: "B3",
  },
  {
    id: "el3",
    name: "Elective 3",
    category: "elective",
    subtitle: "e.g. Chem / Govt",
    defaultGrade: "C4",
  },
];

export function InteractiveCalculatorTeaser() {
  const [grades, setGrades] = useState<{ [subjectId: string]: WassceGrade }>({
    eng: "A1",
    math: "B2",
    sci: "A1",
    soc: "B3",
    el1: "B2",
    el2: "B3",
    el3: "C4",
  });

  const handleGradeChange = (subjectId: string, grade: WassceGrade) => {
    setGrades((prev) => ({ ...prev, [subjectId]: grade }));
  };

  // Calculation logic
  const engVal = getNumericGrade(grades.eng);
  const mathVal = getNumericGrade(grades.math);
  const sciVal = getNumericGrade(grades.sci);
  const socVal = getNumericGrade(grades.soc);
  
  // Better of science or social studies (lower number is better grade in WAEC)
  const thirdCore = Math.min(sciVal, socVal);
  
  // Electives
  const el1 = getNumericGrade(grades.el1);
  const el2 = getNumericGrade(grades.el2);
  const el3 = getNumericGrade(grades.el3);

  const coreTotal = engVal + mathVal + thirdCore;
  const electiveTotal = el1 + el2 + el3;
  const previewAggregate = coreTotal + electiveTotal;

  return (
    <section id="calculator" className="relative py-20 bg-slate-50/50 border-y border-slate-200/80">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Test Your Aggregate in Real Time
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Select sample grades below. See how the official WAEC Best 6 formula calculates your aggregate dynamically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Select Sample Grades
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-0.5">
                      Tap any grade to update the score calculation in real time.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="hidden sm:inline-flex bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    7 Subjects
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-3.5 sm:p-5 space-y-2.5">
                {SUBJECT_ITEMS.map((subject) => {
                  const currentGrade = grades[subject.id];

                  return (
                    <div
                      key={subject.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200/90 bg-slate-50 hover:border-slate-300 transition-all gap-2 sm:gap-3"
                    >
                      {/* Left: Subject Name & Info */}
                      <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 sm:w-44 shrink-0">
                        <div className="truncate">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {subject.name}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 block truncate">
                            {subject.subtitle}
                          </span>
                        </div>

                        {/* Current selected pill indicator for mobile */}
                        <span className="sm:hidden text-xs font-bold text-brand-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-lg">
                          Grade: {currentGrade}
                        </span>
                      </div>

                      {/* Right: Exactly 9-column Grade Matrix */}
                      <div className="grid grid-cols-9 gap-1 sm:gap-1.5 w-full sm:w-auto shrink-0">
                        {GRADE_OPTIONS.map((g) => {
                          const isSelected = currentGrade === g;
                          return (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handleGradeChange(subject.id, g)}
                              className={`h-7.5 sm:h-8 w-full sm:w-7 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-150 cursor-pointer select-none ${
                                isSelected
                                  ? "bg-brand-blue text-white shadow-sm ring-2 ring-blue-400/50 scale-[1.05] z-10"
                                  : "bg-white text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/80 active:scale-95"
                              }`}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Realtime Output Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl hover-lift relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-blue-400/30 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                  Calculated Score
                </span>
                <Badge className="bg-white/20 text-white border-0 text-[10px] shimmer-badge">
                  WAEC Standard
                </Badge>
              </div>

              <div className="my-6 text-center">
                <div className="text-5xl font-extrabold tracking-tight sm:text-6xl text-white inline-block">
                  <SmoothAggregate value={previewAggregate} />
                </div>
                <div className="mt-2 text-xs font-medium text-blue-100">
                  Best 6 Aggregate Score
                </div>
              </div>

              <div className="space-y-2 rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm text-xs text-blue-50 border border-white/10">
                <div className="flex justify-between">
                  <span className="text-blue-200">Core Points (3 Best):</span>
                  <span className="font-bold tabular-nums">{coreTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Elective Points (3 Best):</span>
                  <span className="font-bold tabular-nums">{electiveTotal}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-1.5 font-bold text-white">
                  <span>Estimated Programme Matches:</span>
                  <span className="text-emerald-300 font-extrabold">
                    {previewAggregate <= 12 ? "45+ Programmes" : previewAggregate <= 24 ? "25+ Programmes" : "10+ Programmes"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  asChild
                  className="w-full bg-white text-brand-darkBlue hover:bg-blue-50 font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <a href="#waitlist" className="flex items-center justify-center gap-2">
                    <span>Unlock All University Matches</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100">
              <Info className="h-4 w-4 shrink-0 mt-0.5 text-brand-blue" />
              <span>
                When the app comes out, simply enter your subjects or snap a photo of your result slip to instantly see every university course you qualify for.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
