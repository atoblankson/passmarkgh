import { WassceGrade, BeceGrade } from "@/types";

export const WASSCE_GRADE_VALUES: Record<WassceGrade, number> = {
  A1: 1,
  B2: 2,
  B3: 3,
  C4: 4,
  C5: 5,
  C6: 6,
  D7: 7,
  E8: 8,
  F9: 9,
};

export const WASSCE_GRADE_LABELS: Record<WassceGrade, { label: string; pass: boolean; credit: boolean }> = {
  A1: { label: "Excellent", pass: true, credit: true },
  B2: { label: "Very Good", pass: true, credit: true },
  B3: { label: "Good", pass: true, credit: true },
  C4: { label: "Credit", pass: true, credit: true },
  C5: { label: "Credit", pass: true, credit: true },
  C6: { label: "Credit", pass: true, credit: true },
  D7: { label: "Pass", pass: true, credit: false },
  E8: { label: "Pass", pass: true, credit: false },
  F9: { label: "Fail", pass: false, credit: false },
};

export const BECE_GRADE_VALUES: Record<BeceGrade, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

export function getNumericGrade(grade: string): number {
  if (grade in WASSCE_GRADE_VALUES) {
    return WASSCE_GRADE_VALUES[grade as WassceGrade];
  }
  if (grade in BECE_GRADE_VALUES) {
    return BECE_GRADE_VALUES[grade as BeceGrade];
  }
  return 9;
}

export function isCreditOrBetter(grade: string): boolean {
  const num = getNumericGrade(grade);
  return num >= 1 && num <= 6;
}
