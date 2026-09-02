import {
  Programme,
  StudentSubjectGrade,
  ProgrammeMatchResult,
} from "@/types";
import { getNumericGrade } from "./grades";

export function matchProgrammesAgainstGrades(
  grades: StudentSubjectGrade[],
  studentAggregate: number,
  programmes: Programme[]
): ProgrammeMatchResult[] {
  const gradeMap = new Map<string, string>();
  grades.forEach((g) => {
    gradeMap.set(g.subjectName.toLowerCase().trim(), g.grade);
  });

  return programmes.map((programme) => {
    const requirements = programme.requirements;
    const cutoff = requirements?.cutoffAggregate ?? 24;
    const meetsAggregate = studentAggregate <= cutoff;

    const missingRequirements: string[] = [];

    // Check specific required subjects & minimum grades
    if (requirements?.requiredSubjects && requirements.requiredSubjects.length > 0) {
      requirements.requiredSubjects.forEach((reqSubject) => {
        const studentGrade = gradeMap.get(reqSubject.toLowerCase().trim());
        if (!studentGrade) {
          missingRequirements.push(`Missing ${reqSubject}`);
        } else {
          const minGrade = requirements.minimumGrades?.[reqSubject];
          if (minGrade) {
            const minNum = getNumericGrade(minGrade);
            const actualNum = getNumericGrade(studentGrade);
            if (actualNum > minNum) {
              missingRequirements.push(
                `${reqSubject} grade ${studentGrade} is below required ${minGrade}`
              );
            }
          }
        }
      });
    }

    const meetsSubjectRequirements = missingRequirements.length === 0;
    const qualified = meetsAggregate && meetsSubjectRequirements;

    // Match score: 100 max, higher if student aggregate is comfortably below cutoff
    let matchScore = 0;
    if (qualified) {
      const buffer = cutoff - studentAggregate;
      matchScore = Math.min(100, Math.max(50, 70 + buffer * 5));
    } else if (meetsSubjectRequirements && studentAggregate - cutoff <= 2) {
      matchScore = 40; // close on aggregate
    } else {
      matchScore = 20;
    }

    return {
      programme,
      university: programme.university!,
      cutoffAggregate: cutoff,
      studentAggregate,
      meetsAggregate,
      meetsSubjectRequirements,
      qualified,
      matchScore,
      missingRequirements:
        missingRequirements.length > 0 ? missingRequirements : undefined,
    };
  });
}
