import rawData from "./admissions_data.json";
import { University, Programme, ProgrammeRequirement, GradeValue } from "@/types";

export interface InstitutionEntry {
  university: {
    name: string;
    shortName: string;
    location: string;
    region: string;
    type: "public" | "private";
  };
  admissionsCycle?: string;
  officialPortal?: string;
  sources?: string[];
  cutoffStatus?: string;
  generalEligibilityAggregateWASSCE?: number;
  programmes?: Array<{
    name: string;
    faculty?: string | null;
    category?: string;
    durationYears?: number;
    cutoffAggregate?: number | null;
    feePayingCutoff?: number | null;
    genderAffirmativeActionCutoff?: number | null;
    cutoffType?: string;
    requiredSubjects?: string[];
    minimumGrades?: Record<string, string>;
    electiveGroup?: string | null;
    sourceUrl?: string;
    admissionEligibilityBenchmark?: number;
  }>;
}

// Convert raw JSON to standard University and Programme arrays
export function getLoadedUniversities(): University[] {
  return (rawData.institutions as InstitutionEntry[]).map((inst, index) => ({
    id: `uni-${inst.university.shortName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${index}`,
    name: inst.university.name,
    shortName: inst.university.shortName,
    location: inst.university.location,
    region: inst.university.region,
    type: inst.university.type,
    website: inst.officialPortal,
    logoUrl: `/logos/${inst.university.shortName.toLowerCase().replace(/[^a-z0-9]/g, "")}.png`,
  }));
}

export function getLoadedProgrammes(): Programme[] {
  const programmes: Programme[] = [];
  const universities = getLoadedUniversities();

  (rawData.institutions as InstitutionEntry[]).forEach((inst, uIndex) => {
    const uniObj = universities[uIndex];
    if (!inst.programmes) return;

    inst.programmes.forEach((p, pIndex) => {
      const progId = `prog-${uniObj.shortName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${pIndex}`;
      const reqId = `req-${progId}`;

      const minGradesCleaned: Record<string, GradeValue> = {};
      if (p.minimumGrades) {
        Object.entries(p.minimumGrades).forEach(([subj, grade]) => {
          minGradesCleaned[subj] = grade as GradeValue;
        });
      }

      const requirement: ProgrammeRequirement = {
        id: reqId,
        programmeId: progId,
        cutoffAggregate: p.cutoffAggregate ?? null,
        cutoffType: p.cutoffType,
        feePayingCutoff: p.feePayingCutoff ?? null,
        genderAffirmativeActionCutoff: p.genderAffirmativeActionCutoff ?? null,
        requiredSubjects: p.requiredSubjects || [],
        minimumGrades: minGradesCleaned,
        electiveGroup: p.electiveGroup,
        sourceUrl: p.sourceUrl,
        admissionEligibilityBenchmark: p.admissionEligibilityBenchmark,
      };

      programmes.push({
        id: progId,
        universityId: uniObj.id,
        name: p.name,
        faculty: p.faculty || "General Faculty",
        category: p.category || "Undergraduate",
        durationYears: p.durationYears || 4,
        university: uniObj,
        requirements: requirement,
      });
    });
  });

  return programmes;
}

export const OFFICIAL_PROGRAMMES: Programme[] = getLoadedProgrammes();
export const OFFICIAL_UNIVERSITIES: University[] = getLoadedUniversities();
