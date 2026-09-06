"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WizardStepIndicator } from "./wizard-step-indicator";
import { Step1ExamProfile, ExamOption, GenderOption } from "./step-1-exam-profile";
import { Step2CoreGrades } from "./step-2-core-grades";
import { Step3ElectiveGrades, ElectiveItem } from "./step-3-elective-grades";
import { calculateWassceAggregate } from "@/lib/grading/calculator";
import { generateGradeSignature } from "@/lib/grading/grades";
import { WassceGrade, StudentSubjectGrade } from "@/types";
import { OFFICIAL_PROGRAMMES } from "@/data/programmes";
import { matchProgrammesAgainstGrades } from "@/lib/grading/matcher";

const DEFAULT_CORE_GRADES: Record<string, WassceGrade | ""> = {
  "English Language": "",
  "Core Mathematics": "",
  "Integrated Science": "",
  "Social Studies": "",
};

const DEFAULT_SECOND_SITTING_GRADES: Record<string, WassceGrade | "N/A"> = {
  "English Language": "N/A",
  "Core Mathematics": "N/A",
  "Integrated Science": "N/A",
  "Social Studies": "N/A",
};

export function GradeEntryForm() {
  const router = useRouter();

  // Wizard step (1, 2, 3)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1 states - ALWAYS start empty so user explicitly picks their own profile
  const [examType, setExamType] = useState<ExamOption | "">("");
  const [gender, setGender] = useState<GenderOption | "">("");
  const [selectedStreamId, setSelectedStreamId] = useState<string>("");

  // Step 2 states (Core subjects & 2nd sitting) - start empty
  const [coreGrades, setCoreGrades] = useState<Record<string, WassceGrade | "">>(DEFAULT_CORE_GRADES);
  const [hasSecondSitting, setHasSecondSitting] = useState<boolean>(false);
  const [secondSittingExam, setSecondSittingExam] = useState<string>("NOVDEC");
  const [secondSittingGrades, setSecondSittingGrades] = useState<Record<string, WassceGrade | "N/A">>(
    DEFAULT_SECOND_SITTING_GRADES
  );

  // Step 3 states (Electives) - start empty so user explicitly picks
  const [electives, setElectives] = useState<ElectiveItem[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // When stream changes in Step 1, update stream and reset electives selection
  const handleStreamChange = (streamId: string) => {
    setSelectedStreamId(streamId);
    setElectives([]);
  };

  // Update a 1st sitting core grade
  const handleCoreGradeChange = (subject: string, grade: WassceGrade) => {
    setCoreGrades((prev) => ({ ...prev, [subject]: grade }));
  };

  // Update a 2nd sitting core grade
  const handleSecondSittingGradeChange = (subject: string, grade: WassceGrade | "N/A") => {
    setSecondSittingGrades((prev) => ({ ...prev, [subject]: grade }));
  };

  // Toggle elective subject on/off (min 0, max 4)
  const handleToggleSubject = (subjectName: string) => {
    setElectives((prev) => {
      const exists = prev.some((e) => e.subjectName === subjectName);
      if (exists) {
        return prev.filter((e) => e.subjectName !== subjectName);
      } else {
        if (prev.length >= 4) return prev;
        return [
          ...prev,
          {
            slotId: `el-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            subjectName,
            grade: "", // Unselected by default so user selects
          },
        ];
      }
    });
  };

  // Update elective grade
  const handleElectiveGradeChange = (slotId: string, grade: WassceGrade) => {
    setElectives((prev) =>
      prev.map((item) => (item.slotId === slotId ? { ...item, grade } : item))
    );
  };

  // Combine grades for WAEC calculation (automatically picking best between 1st and 2nd sitting)
  const allStudentGrades: StudentSubjectGrade[] = useMemo(() => {
    const cores: StudentSubjectGrade[] = Object.entries(coreGrades)
      .filter(([, grade]) => Boolean(grade))
      .map(([name, grade]) => {
        let effectiveGrade = grade as WassceGrade;

        if (hasSecondSitting && secondSittingGrades[name] && secondSittingGrades[name] !== "N/A") {
          const retakeGrade = secondSittingGrades[name] as WassceGrade;
          const numFirst = parseInt(grade.slice(1)) || 9;
          const numSecond = parseInt(retakeGrade.slice(1)) || 9;
          // Lower numeric grade is better in WAEC (1 is A1, 9 is F9)
          if (numSecond < numFirst) {
            effectiveGrade = retakeGrade;
          }
        }

        return {
          subjectId: name.toLowerCase().replace(/\s+/g, "-"),
          subjectName: name,
          grade: effectiveGrade,
          category: "core",
        };
      });

    const elecs: StudentSubjectGrade[] = electives
      .filter((e) => Boolean(e.grade))
      .map((e) => ({
        subjectId: e.subjectName.toLowerCase().replace(/\s+/g, "-"),
        subjectName: e.subjectName,
        grade: e.grade as WassceGrade,
        category: "elective",
      }));

    return [...cores, ...elecs];
  }, [coreGrades, hasSecondSitting, secondSittingGrades, electives]);

  // Real-time aggregate calculation
  const calculation = useMemo(() => {
    return calculateWassceAggregate(allStudentGrades);
  }, [allStudentGrades]);

  // Core points vs Elective points breakdown
  const corePoints = useMemo(() => {
    return calculation.bestCore.reduce(
      (sum, item) => sum + (parseInt(item.grade.slice(1)) || 0),
      0
    );
  }, [calculation]);

  const electivePoints = useMemo(() => {
    return calculation.bestElectives.reduce(
      (sum, item) => sum + (parseInt(item.grade.slice(1)) || 0),
      0
    );
  }, [calculation]);

  // Estimated matched programmes
  const estimatedMatches = useMemo(() => {
    if (!calculation.isValid) return 0;
    const matches = matchProgrammesAgainstGrades(
      allStudentGrades,
      calculation.aggregate,
      OFFICIAL_PROGRAMMES,
      (gender || "prefer_not_to_say") as GenderOption,
      selectedStreamId
    );
    return matches.filter((m) => m.qualified).length;
  }, [allStudentGrades, calculation, gender, selectedStreamId]);

  // Save profile and route to /results
  const handleProceedToResults = useCallback(() => {
    try {
      const resultSignature = generateGradeSignature({
        gender: gender || "prefer_not_to_say",
        selectedStreamId: selectedStreamId || "science",
        allGrades: allStudentGrades,
      });
      const checkId = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const payload = {
        checkId,
        resultSignature,
        examType: examType || "WASSCE",
        gender: gender || "prefer_not_to_say",
        selectedStreamId: selectedStreamId || "science",
        coreGrades,
        hasSecondSitting,
        secondSittingExam,
        secondSittingGrades,
        electives,
        aggregate: calculation.aggregate,
        allGrades: allStudentGrades,
        timestamp: new Date().toISOString(),
      };

      // Clear legacy global unlock flag to prevent any cross-check leaking
      localStorage.removeItem("passmark_access_unlocked");

      // Save profile in localStorage
      localStorage.setItem("passmark_profile", JSON.stringify(payload));

      // Track real check in local admin store (localhost only)
      if (
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ) {
        fetch("/api/admin/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "check",
            aggregate: calculation.aggregate,
            stream: selectedStreamId,
            qualifiedCount: estimatedMatches,
          }),
        }).catch(() => {});
      }

      // Route to results
      router.push("/results");
    } catch {
      // ignore
    }
  }, [
    examType,
    gender,
    selectedStreamId,
    coreGrades,
    hasSecondSitting,
    secondSittingExam,
    secondSittingGrades,
    electives,
    calculation,
    allStudentGrades,
    estimatedMatches,
    router,
  ]);

  // Click on "Check My Admission Chances" saves profile and navigates to /results
  const handleSubmit = useCallback(() => {
    setIsSubmitting(true);
    handleProceedToResults();
  }, [handleProceedToResults]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Step Indicator with Back Button, Title & Progress Bar */}
      <WizardStepIndicator
        currentStep={currentStep}
        totalSteps={3}
        onBack={
          currentStep === 1
            ? () => router.push("/")
            : currentStep === 2
            ? () => setCurrentStep(1)
            : () => setCurrentStep(2)
        }
      />

      {/* Step 1: Exam Type, Gender, Stream */}
      {currentStep === 1 && (
        <Step1ExamProfile
          examType={examType}
          onExamTypeChange={setExamType}
          gender={gender}
          onGenderChange={setGender}
          selectedStreamId={selectedStreamId}
          onStreamChange={handleStreamChange}
          onContinue={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Core Subject Grades & 2nd Sitting */}
      {currentStep === 2 && (
        <Step2CoreGrades
          coreGrades={coreGrades}
          onGradeChange={handleCoreGradeChange}
          hasSecondSitting={hasSecondSitting}
          onToggleSecondSitting={setHasSecondSitting}
          secondSittingExam={secondSittingExam}
          onSecondSittingExamChange={setSecondSittingExam}
          secondSittingGrades={secondSittingGrades}
          onSecondSittingGradeChange={handleSecondSittingGradeChange}
          onContinue={() => setCurrentStep(3)}
        />
      )}

      {/* Step 3: Elective Subject Grades & Real-time Score */}
      {currentStep === 3 && (
        <Step3ElectiveGrades
          selectedStreamId={selectedStreamId}
          electives={electives}
          onToggleSubject={handleToggleSubject}
          onGradeChange={handleElectiveGradeChange}
          aggregate={calculation.aggregate}
          corePoints={corePoints}
          electivePoints={electivePoints}
          estimatedMatches={estimatedMatches}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
