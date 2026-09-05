import {
  Programme,
  StudentSubjectGrade,
  ProgrammeMatchResult,
  MatchStatusTier,
} from "@/types";
import { getNumericGrade } from "./grades";

/**
 * Checks if a requirement like "Social Studies or Integrated Science" or "Biology or Elective Mathematics"
 * is satisfied by the student's grades.
 */
function checkSubjectRequirement(
  reqString: string,
  gradeMap: Map<string, string>,
  minimumGrades?: Record<string, string>
): { satisfied: boolean; reason?: string } {
  // Check if requirement contains "or"
  const alternatives = reqString.split(/\s+or\s+/i).map((s) => s.trim());

  let satisfied = false;
  let subReason: string | null = null;

  for (const alt of alternatives) {
    const studentGrade = gradeMap.get(alt.toLowerCase().trim());
    if (studentGrade) {
      const minReq = minimumGrades?.[alt] || minimumGrades?.[reqString] || "C6";
      const minNum = getNumericGrade(minReq);
      const actualNum = getNumericGrade(studentGrade);

      if (actualNum <= minNum) {
        satisfied = true;
        break;
      } else {
        subReason = `${alt} grade ${studentGrade} is below required ${minReq}`;
      }
    }
  }

  if (satisfied) {
    return { satisfied: true };
  }

  if (subReason) {
    return { satisfied: false, reason: subReason };
  }

  return { satisfied: false, reason: `Missing ${reqString}` };
}

export function matchProgrammesAgainstGrades(
  grades: StudentSubjectGrade[],
  studentAggregate: number,
  programmes: Programme[],
  gender?: string
): ProgrammeMatchResult[] {
  const gradeMap = new Map<string, string>();
  grades.forEach((g) => {
    gradeMap.set(g.subjectName.toLowerCase().trim(), g.grade);
  });

  const isFemale = gender === "female";

  return programmes.map((programme) => {
    const requirements = programme.requirements;
    const baseCutoff = requirements?.cutoffAggregate ?? null;
    const femaleCutoff = requirements?.genderAffirmativeActionCutoff ?? null;
    const generalBenchmark = requirements?.admissionEligibilityBenchmark ?? 36;
    const feePayingCutoff = requirements?.feePayingCutoff ?? null;

    // Apply female affirmative action cutoff if eligible and available
    let effectiveCutoff = baseCutoff;
    let isAffirmativeActionApplied = false;

    if (isFemale && femaleCutoff !== null) {
      effectiveCutoff = femaleCutoff;
      isAffirmativeActionApplied = true;
    }

    const missingRequirements: string[] = [];

    // 1. Check specific required subjects & minimum grades
    if (requirements?.requiredSubjects && requirements.requiredSubjects.length > 0) {
      requirements.requiredSubjects.forEach((reqSubject) => {
        const check = checkSubjectRequirement(
          reqSubject,
          gradeMap,
          requirements.minimumGrades as Record<string, string> | undefined
        );
        if (!check.satisfied && check.reason) {
          missingRequirements.push(check.reason);
        }
      });
    }

    const meetsSubjectRequirements = missingRequirements.length === 0;

    // 2. Evaluate Aggregate
    let meetsRegular = false;
    let meetsFeePaying = false;
    let notes: string | undefined = undefined;

    if (effectiveCutoff !== null) {
      meetsRegular = studentAggregate <= effectiveCutoff;
      if (!meetsRegular && feePayingCutoff !== null && studentAggregate <= feePayingCutoff) {
        meetsFeePaying = true;
        notes = `Eligible under Fee-Paying / Parallel Stream (Cutoff ${feePayingCutoff})`;
      } else if (isAffirmativeActionApplied && meetsRegular && baseCutoff !== null && studentAggregate > baseCutoff) {
        notes = `Special female cutoff applied: Aggregate ${femaleCutoff} (Regular cutoff is ${baseCutoff})`;
      }
    } else {
      // General eligibility threshold (e.g. 24 or 36) or holistic admission
      meetsRegular = studentAggregate <= generalBenchmark;
      if (requirements?.cutoffType === "HOLISTIC_ADMISSIONS") {
        notes = "Holistic Review (Grades, Portfolio & Interview)";
      } else {
        notes = `General Admission Threshold (Aggregate ≤${generalBenchmark})`;
      }
    }

    const qualified = (meetsRegular || meetsFeePaying) && meetsSubjectRequirements;

    // Determine status tier
    let statusTier: MatchStatusTier = "unqualified";
    if (qualified) {
      if (meetsRegular) {
        if (effectiveCutoff !== null && studentAggregate === effectiveCutoff) {
          statusTier = "competitive";
        } else {
          statusTier = "qualified";
        }
      } else if (meetsFeePaying) {
        statusTier = "fee_paying";
      }
    } else {
      if (meetsRegular && !meetsSubjectRequirements) {
        statusTier = "prerequisite_missing";
      } else if (effectiveCutoff !== null && studentAggregate - effectiveCutoff <= 2 && meetsSubjectRequirements) {
        statusTier = "competitive";
      } else {
        statusTier = "unqualified";
      }
    }

    // 3. Match Score Calculation (0-100)
    let matchScore = 0;
    if (qualified) {
      if (effectiveCutoff !== null) {
        const buffer = effectiveCutoff - studentAggregate;
        matchScore = Math.min(100, Math.max(55, 75 + buffer * 5));
      } else {
        const buffer = generalBenchmark - studentAggregate;
        matchScore = Math.min(95, Math.max(50, 65 + buffer * 2));
      }
    } else if (statusTier === "competitive") {
      matchScore = 45;
    } else if (statusTier === "prerequisite_missing") {
      matchScore = 35;
    } else {
      matchScore = 15;
    }

    return {
      programme,
      university: programme.university!,
      cutoffAggregate: baseCutoff,
      effectiveCutoff,
      studentAggregate,
      meetsAggregate: meetsRegular || meetsFeePaying,
      meetsSubjectRequirements,
      qualified,
      statusTier,
      matchScore,
      missingRequirements:
        missingRequirements.length > 0 ? missingRequirements : undefined,
      notes,
      isAffirmativeActionApplied,
    };
  });
}

