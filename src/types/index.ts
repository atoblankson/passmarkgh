export type ExamType = "WASSCE" | "BECE";

export type WassceGrade =
  | "A1"
  | "B2"
  | "B3"
  | "C4"
  | "C5"
  | "C6"
  | "D7"
  | "E8"
  | "F9";

export type BeceGrade = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type GradeValue = WassceGrade | BeceGrade;

export type SubjectCategory = "core" | "elective";

export interface Subject {
  id: string;
  name: string;
  category: SubjectCategory;
  examType: ExamType;
  group?: string; // e.g. "Science", "General Arts", "Business", "Visual Arts", "Home Economics"
}

export interface StudentSubjectGrade {
  subjectId: string;
  subjectName: string;
  grade: GradeValue;
  category: SubjectCategory;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  region: string;
  logoUrl?: string;
  iconUrl?: string;
  founded?: number;
  website?: string;
  type: "public" | "private";
}

export interface ProgrammeRequirement {
  id: string;
  programmeId: string;
  cutoffAggregate?: number | null;
  cutoffType?: string;
  feePayingCutoff?: number | null;
  genderAffirmativeActionCutoff?: number | null;
  requiredSubjects: string[]; // Subject names required with minimum grades
  minimumGrades?: Record<string, GradeValue>; // e.g. { "Core Mathematics": "C6" }
  electiveGroup?: string | null;
  year?: number;
  notes?: string;
  sourceUrl?: string;
  admissionEligibilityBenchmark?: number;
}

export interface Programme {
  id: string;
  universityId: string;
  name: string;
  faculty: string;
  category: string; // e.g. "Computing & Tech", "Engineering", "Health & Medicine", "Business", "Humanities"
  durationYears: number;
  campus?: string;
  requirements?: ProgrammeRequirement;
  university?: University;
  careerProspects?: string[];
}

export interface AggregateCalculationResult {
  aggregate: number;
  bestCore: StudentSubjectGrade[];
  bestElectives: StudentSubjectGrade[];
  allGrades: StudentSubjectGrade[];
  isValid: boolean;
  errors: string[];
}

export type MatchStatusTier =
  | "qualified"
  | "competitive"
  | "fee_paying"
  | "prerequisite_missing"
  | "unqualified";

export interface ProgrammeMatchResult {
  programme: Programme;
  university: University;
  cutoffAggregate: number | null;
  effectiveCutoff?: number | null;
  studentAggregate: number;
  meetsAggregate: boolean;
  meetsSubjectRequirements: boolean;
  qualified: boolean;
  matchScore: number; // 0-100 score indicating competitive buffer
  statusTier: MatchStatusTier;
  missingRequirements?: string[];
  notes?: string;
  isAffirmativeActionApplied?: boolean;
}

export interface WaitlistEntry {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  examType: ExamType;
  shsSchool?: string;
  targetUniversity?: string;
  createdAt?: string;
}
