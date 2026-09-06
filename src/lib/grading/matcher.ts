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

/**
 * Calculates a 0-100 relevance score indicating how strongly a tertiary programme
 * matches the student's high school stream and specific elective subjects.
 */
export function calculateProgrammeRelevanceScore(
  programme: Programme,
  studentGrades: StudentSubjectGrade[],
  selectedStreamId?: string
): number {
  const normStream = (selectedStreamId || "").toLowerCase().replace(/[^a-z]/g, "");
  const electives = studentGrades.filter((g) => g.category === "elective");
  const electiveNames = electives.map((e) => e.subjectName.toLowerCase().trim());

  const progName = (programme.name || "").toLowerCase();
  const progCat = (programme.category || "").toLowerCase();
  const progFaculty = (programme.faculty || "").toLowerCase();
  const electiveGroup = (programme.requirements?.electiveGroup || "").toLowerCase();

  let score = 40; // baseline neutral relevance

  // 1. Detect Student's Elective Subject Domain
  const hasTechElectives = electiveNames.some((n) =>
    n.includes("technical") ||
    n.includes("electricity") ||
    n.includes("electronics") ||
    n.includes("construction") ||
    n.includes("woodwork") ||
    n.includes("metalwork") ||
    n.includes("mechanic") ||
    n.includes("robotics") ||
    n.includes("engineering")
  );

  const hasBusinessElectives = electiveNames.some((n) =>
    n.includes("accounting") ||
    n.includes("costing") ||
    n.includes("business management") ||
    n.includes("clerical") ||
    n.includes("typewriting")
  );

  const hasArtsElectives = electiveNames.some((n) =>
    n.includes("government") ||
    n.includes("history") ||
    n.includes("literature") ||
    n.includes("religious") ||
    n.includes("french") ||
    n.includes("arabic") ||
    n.includes("spanish") ||
    n.includes("music") ||
    n.includes("performing") ||
    n.includes("twi") ||
    n.includes("fante") ||
    n.includes("ga") ||
    n.includes("ewe") ||
    n.includes("dagbani") ||
    n.includes("dangme") ||
    n.includes("dagaare") ||
    n.includes("gonja") ||
    n.includes("kasem") ||
    n.includes("nzema")
  );

  const hasVisualArtsElectives = electiveNames.some((n) =>
    n.includes("art") ||
    n.includes("graphic") ||
    n.includes("picture") ||
    n.includes("ceramics") ||
    n.includes("sculpture") ||
    n.includes("textiles") ||
    n.includes("basketry") ||
    n.includes("leatherwork") ||
    n.includes("jewellery")
  );

  const hasHomeEconElectives = electiveNames.some((n) =>
    n.includes("food") ||
    n.includes("nutrition") ||
    n.includes("living") ||
    n.includes("clothing")
  );

  const hasAgricElectives = electiveNames.some((n) =>
    n.includes("agric") ||
    n.includes("animal") ||
    n.includes("crop") ||
    n.includes("fisheries") ||
    n.includes("forestry")
  );

  const hasElectiveMaths = electiveNames.some((n) => n.includes("math"));
  const hasPhysics = electiveNames.some((n) => n.includes("physics"));
  const hasChemistry = electiveNames.some((n) => n.includes("chem"));
  const hasBiology = electiveNames.some((n) => n.includes("bio"));

  // 2. Identify Student Stream Profile
  const isTechnical = normStream.includes("tech") || hasTechElectives;
  const isBusiness = normStream.includes("bus") || hasBusinessElectives;
  const isArts = (normStream.includes("art") && !normStream.includes("visual")) || hasArtsElectives;
  const isVisualArts = normStream.includes("visual") || hasVisualArtsElectives;
  const isHomeEcon = normStream.includes("home") || (normStream.includes("econ") && hasHomeEconElectives);
  const isAgric = normStream.includes("agric") || hasAgricElectives;
  const isScience =
    normStream.includes("sci") ||
    (hasPhysics && hasChemistry) ||
    (hasBiology && hasChemistry) ||
    (hasElectiveMaths && hasPhysics);

  // 3. Programme Discipline Signals
  const isEngineeringOrTechProg =
    progCat.includes("engineering") ||
    progCat.includes("computing") ||
    progCat.includes("technology") ||
    progName.includes("engineering") ||
    progName.includes("computer") ||
    progName.includes("technology") ||
    progName.includes("robotics") ||
    progName.includes("software") ||
    progName.includes("information technology") ||
    progFaculty.includes("engineering");

  const isBusinessProg =
    progCat.includes("business") ||
    progCat.includes("management") ||
    progName.includes("administration") ||
    progName.includes("accounting") ||
    progName.includes("finance") ||
    progName.includes("marketing") ||
    progName.includes("banking") ||
    progName.includes("commerce") ||
    progName.includes("business") ||
    progName.includes("economics") ||
    progFaculty.includes("business");

  const isLawOrHumanitiesProg =
    progCat.includes("law") ||
    progCat.includes("humanities") ||
    progCat.includes("social") ||
    progName.includes("law") ||
    progName.includes("llb") ||
    progName.includes("political") ||
    progName.includes("sociology") ||
    progName.includes("history") ||
    progName.includes("english") ||
    progName.includes("arts") ||
    progName.includes("international relations") ||
    progName.includes("communication") ||
    progName.includes("psychology");

  const isHealthProg =
    progCat.includes("health") ||
    progCat.includes("medical") ||
    progName.includes("medicine") ||
    progName.includes("surgery") ||
    progName.includes("pharmacy") ||
    progName.includes("nursing") ||
    progName.includes("midwifery") ||
    progName.includes("medical") ||
    progName.includes("dentistry") ||
    progName.includes("allied health");

  const isVisualArtsProg =
    progName.includes("art") ||
    progName.includes("design") ||
    progName.includes("architecture") ||
    progName.includes("textile") ||
    progName.includes("painting") ||
    progName.includes("sculpture") ||
    progName.includes("publishing");

  const isAgricProg =
    progName.includes("agric") ||
    progName.includes("natural resources") ||
    progName.includes("forestry") ||
    progName.includes("fisheries") ||
    progName.includes("animal");

  // 4. Score Adjustments based on Discipline Alignment
  if (isTechnical) {
    if (isEngineeringOrTechProg) score += 50;
    else if (isBusinessProg || isVisualArtsProg) score += 10;
    else if (isHealthProg) score -= 40; // Nursing/Medicine is completely misaligned for a technical student
  }

  if (isBusiness) {
    if (isBusinessProg) score += 50;
    else if (isLawOrHumanitiesProg) score += 20;
    else if (isEngineeringOrTechProg || isHealthProg) score -= 40;
  }

  if (isArts) {
    if (isLawOrHumanitiesProg) score += 50;
    else if (isBusinessProg) score += 20;
    else if (isEngineeringOrTechProg || isHealthProg) score -= 40;
  }

  if (isVisualArts) {
    if (isVisualArtsProg) score += 55;
    else if (isLawOrHumanitiesProg) score += 20;
    else if (isHealthProg || isEngineeringOrTechProg) score -= 35;
  }

  if (isHomeEcon) {
    if (
      progName.includes("food") ||
      progName.includes("nutrition") ||
      progName.includes("hospitality") ||
      progName.includes("dietetics")
    ) {
      score += 55;
    } else if (isHealthProg && (progName.includes("nursing") || progName.includes("midwifery"))) {
      score += 35; // Nursing is an accepted pathway for Home Economics in Ghana
    } else if (isBusinessProg || isLawOrHumanitiesProg) {
      score += 15;
    } else if (isEngineeringOrTechProg) {
      score -= 30;
    }
  }

  if (isAgric) {
    if (isAgricProg) score += 55;
    else if (isHealthProg && (progName.includes("veterinary") || progName.includes("biological"))) {
      score += 35;
    } else if (isBusinessProg) {
      score += 20; // Agribusiness
    } else if (isEngineeringOrTechProg) {
      score -= 20;
    }
  }

  if (isScience) {
    if (hasBiology && isHealthProg) score += 50;
    if (
      hasElectiveMaths &&
      (isEngineeringOrTechProg ||
        progName.includes("computer") ||
        progName.includes("mathematics") ||
        progName.includes("actuarial"))
    ) {
      score += 50;
    }
    if (hasPhysics && isEngineeringOrTechProg) score += 40;
    if (!hasBiology && isHealthProg && (progName.includes("medicine") || progName.includes("nursing"))) {
      score -= 25;
    }
  }

  // 5. Check Elective Group Compatibility
  if (electiveGroup) {
    const streamKeywords: Record<string, string[]> = {
      technical: ["technical"],
      business: ["business"],
      arts: ["general arts", "arts"],
      visual_arts: ["visual arts", "general knowledge in art"],
      home_economics: ["home economics"],
      agriculture: ["agricultural science", "agriculture", "agric"],
      science: ["science", "general science"],
    };

    const myKeywords = streamKeywords[normStream] || [];
    const isListed = myKeywords.some((kw) => electiveGroup.includes(kw));

    if (isListed) {
      score += 20;
    } else if (myKeywords.length > 0) {
      // Stream is explicitly excluded from this programme's preferred intake
      score -= 35;
    }
  }

  return Math.min(100, Math.max(5, score));
}

export function matchProgrammesAgainstGrades(
  grades: StudentSubjectGrade[],
  studentAggregate: number,
  programmes: Programme[],
  gender?: string,
  selectedStreamId?: string
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

    // 3. Calibrated Match Score Calculation (0-100)
    // Avoids awarding huge 100/100 buffers to national benchmark minimum thresholds (e.g. cutoff 36)
    let matchScore = 0;
    if (qualified) {
      const isNationalBenchmark =
        requirements?.cutoffType === "NATIONAL_ENTRY_BENCHMARK" ||
        (effectiveCutoff !== null && effectiveCutoff > 24);

      if (effectiveCutoff !== null && effectiveCutoff <= 24) {
        // High-selectivity university degree programme (cutoffs 6 to 20 at premier universities)
        // Base score: 75
        const selectivityBonus = Math.max(0, 24 - effectiveCutoff) * 0.7; // Tighter cutoff gets prestige bonus
        const buffer = Math.max(0, effectiveCutoff - studentAggregate);
        const bufferBonus = Math.min(12, buffer * 2.5); // Comfortable buffer within degree cutoff

        matchScore = Math.min(100, Math.round(75 + selectivityBonus + bufferBonus));
      } else if (isNationalBenchmark) {
        // Broad national entry baseline (e.g. aggregate 36 general diploma threshold)
        // Solid safety pass, capped at 65 so it never eclipses competitive degree courses
        const buffer = Math.max(0, (effectiveCutoff || generalBenchmark) - studentAggregate);
        matchScore = Math.min(65, Math.round(50 + buffer * 0.5));
      } else {
        // Holistic review or standard institutional threshold (e.g. aggregate 24)
        const buffer = Math.max(0, generalBenchmark - studentAggregate);
        matchScore = Math.min(85, Math.round(65 + buffer * 1.5));
      }
    } else if (statusTier === "competitive") {
      matchScore = 48;
    } else if (statusTier === "fee_paying") {
      matchScore = 60;
    } else if (statusTier === "prerequisite_missing") {
      matchScore = 35;
    } else {
      matchScore = 15;
    }

    // 4. Calculate Personalised Relevance Score based on Student's Electives and Stream
    const relevanceScore = calculateProgrammeRelevanceScore(
      programme,
      grades,
      selectedStreamId
    );

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
      relevanceScore,
      missingRequirements:
        missingRequirements.length > 0 ? missingRequirements : undefined,
      notes,
      isAffirmativeActionApplied,
    };
  });
}


