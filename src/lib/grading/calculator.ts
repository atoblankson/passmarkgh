import {
  StudentSubjectGrade,
  AggregateCalculationResult,
} from "@/types";
import { getNumericGrade, isCreditOrBetter } from "./grades";

/**
 * Calculates Ghanaian WASSCE Aggregate using official WAEC guidelines:
 * - 3 Core subjects: English Language (mandatory), Core Mathematics (mandatory),
 *   plus the better of Integrated Science or Social Studies.
 * - 3 Best Elective subjects.
 * Total: 6 subjects.
 */
export function calculateWassceAggregate(
  grades: StudentSubjectGrade[]
): AggregateCalculationResult {
  const errors: string[] = [];

  const coreGrades = grades.filter((g) => g.category === "core");
  const electiveGrades = grades.filter((g) => g.category === "elective");

  // Find English and Core Maths
  const english = coreGrades.find(
    (g) =>
      g.subjectName.toLowerCase().includes("english") ||
      g.subjectId.includes("english")
  );
  const coreMaths = coreGrades.find(
    (g) =>
      g.subjectName.toLowerCase().includes("core math") ||
      g.subjectId.includes("math")
  );
  const intScience = coreGrades.find(
    (g) =>
      g.subjectName.toLowerCase().includes("integrated science") ||
      g.subjectId.includes("science")
  );
  const socialStudies = coreGrades.find(
    (g) =>
      g.subjectName.toLowerCase().includes("social studies") ||
      g.subjectId.includes("social")
  );

  if (!english) {
    errors.push("English Language grade is required.");
  }
  if (!coreMaths) {
    errors.push("Core Mathematics grade is required.");
  }

  const selectedCore: StudentSubjectGrade[] = [];

  if (english) selectedCore.push(english);
  if (coreMaths) selectedCore.push(coreMaths);

  // Pick better between Integrated Science & Social Studies if available
  if (intScience && socialStudies) {
    const scienceVal = getNumericGrade(intScience.grade);
    const socialVal = getNumericGrade(socialStudies.grade);
    if (scienceVal <= socialVal) {
      selectedCore.push(intScience);
    } else {
      selectedCore.push(socialStudies);
    }
  } else if (intScience) {
    selectedCore.push(intScience);
  } else if (socialStudies) {
    selectedCore.push(socialStudies);
  } else {
    // If other core subjects exist
    const otherCores = coreGrades.filter(
      (g) => g !== english && g !== coreMaths
    );
    if (otherCores.length > 0) {
      otherCores.sort(
        (a, b) => getNumericGrade(a.grade) - getNumericGrade(b.grade)
      );
      selectedCore.push(otherCores[0]);
    } else {
      errors.push(
        "Either Integrated Science or Social Studies grade is required."
      );
    }
  }

  // Pick 3 best electives
  if (electiveGrades.length < 3) {
    errors.push("At least 3 elective subjects are required.");
  }

  const sortedElectives = [...electiveGrades].sort(
    (a, b) => getNumericGrade(a.grade) - getNumericGrade(b.grade)
  );

  const selectedElectives = sortedElectives.slice(0, 3);

  // Compute aggregate
  const allSelected = [...selectedCore, ...selectedElectives];
  const aggregate = allSelected.reduce(
    (sum, item) => sum + getNumericGrade(item.grade),
    0
  );

  return {
    aggregate,
    bestCore: selectedCore,
    bestElectives: selectedElectives,
    allGrades: grades,
    isValid: errors.length === 0 && allSelected.length === 6,
    errors,
  };
}

/**
 * Checks basic university entry qualification criteria in Ghana:
 * Minimum of credit passes (A1-C6) in 3 core and 3 elective subjects.
 */
export function meetsGeneralUniversityRequirement(
  calcResult: AggregateCalculationResult
): { eligible: boolean; reason?: string } {
  if (!calcResult.isValid) {
    return { eligible: false, reason: "Incomplete subject profile." };
  }

  const allSix = [...calcResult.bestCore, ...calcResult.bestElectives];
  const hasFailOrPassOnly = allSix.some((g) => !isCreditOrBetter(g.grade));

  if (hasFailOrPassOnly) {
    const failedOrD7Subjects = allSix
      .filter((g) => !isCreditOrBetter(g.grade))
      .map((g) => `${g.subjectName} (${g.grade})`)
      .join(", ");
    return {
      eligible: false,
      reason: `Grade C6 or better is required in all 6 subjects for direct degree admission. Issue with: ${failedOrD7Subjects}`,
    };
  }

  return { eligible: true };
}
