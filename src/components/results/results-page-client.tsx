"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  FilterX,
  GraduationCap,
  CheckCircle2,
  Download,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StudentSubjectGrade, WassceGrade, ProgrammeMatchResult } from "@/types";
import { OFFICIAL_PROGRAMMES } from "@/data/programmes";
import { matchProgrammesAgainstGrades } from "@/lib/grading/matcher";
import { generateGradeSignature } from "@/lib/grading/grades";
import { ResultsHeader } from "./results-header";
import { ResultsScorecard } from "./results-scorecard";
import { ResultsFilterBar, UniversityOption, CategoryOption } from "./results-filter-bar";
import { ProgrammeCard } from "./programme-card";
import { LockedProgrammeCard } from "./locked-programme-card";
import { ResultsPaywallModal } from "./results-paywall-modal";
import { ProminentPaywallCard } from "./prominent-paywall-card";

interface StoredProfile {
  checkId?: string;
  resultSignature?: string;
  examType: string;
  gender: string;
  selectedStreamId: string;
  coreGrades: Record<string, WassceGrade>;
  hasSecondSitting?: boolean;
  secondSittingExam?: string;
  secondSittingGrades?: Record<string, WassceGrade | "N/A">;
  electives: Array<{ slotId: string; subjectName: string; grade: WassceGrade }>;
  aggregate: number;
  allGrades?: StudentSubjectGrade[];
  timestamp?: string;
}

interface UnlockedCheckRecord {
  reference: string;
  unlockedAt: string;
  email?: string;
}

const UNLOCKED_SIGNATURES_KEY = "passmark_unlocked_signatures";

function getUnlockedSignatures(): Record<string, UnlockedCheckRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UNLOCKED_SIGNATURES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUnlockedSignature(signature: string, reference: string, email?: string) {
  if (typeof window === "undefined" || !signature) return;
  try {
    const map = getUnlockedSignatures();
    map[signature] = {
      reference,
      unlockedAt: new Date().toISOString(),
      email,
    };
    localStorage.setItem(UNLOCKED_SIGNATURES_KEY, JSON.stringify(map));
    localStorage.removeItem("passmark_access_unlocked");
  } catch {
    // ignore
  }
}

export function ResultsPageClient() {
  const router = useRouter();
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "qualified" | "fee_paying">("all");
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Load profile from storage on mount
  useEffect(() => {
    try {
      // Clear legacy global key so old test unlocks don't leak
      localStorage.removeItem("passmark_access_unlocked");

      const saved = localStorage.getItem("passmark_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Compute Student Grades Array
  const allStudentGrades: StudentSubjectGrade[] = useMemo(() => {
    if (!profile) return [];
    if (profile.allGrades && profile.allGrades.length > 0) {
      return profile.allGrades;
    }

    const cores: StudentSubjectGrade[] = Object.entries(profile.coreGrades || {}).map(
      ([name, grade]) => {
        let effectiveGrade = grade;
        if (
          profile.hasSecondSitting &&
          profile.secondSittingGrades &&
          profile.secondSittingGrades[name] &&
          profile.secondSittingGrades[name] !== "N/A"
        ) {
          const retakeGrade = profile.secondSittingGrades[name] as WassceGrade;
          const numFirst = parseInt(grade.slice(1)) || 9;
          const numSecond = parseInt(retakeGrade.slice(1)) || 9;
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
      }
    );

    const elecs: StudentSubjectGrade[] = (profile.electives || []).map((e) => ({
      subjectId: e.subjectName.toLowerCase().replace(/\s+/g, "-"),
      subjectName: e.subjectName,
      grade: e.grade,
      category: "elective",
    }));

    return [...cores, ...elecs];
  }, [profile]);

  // Aggregate and Core/Elective Points Breakdown
  const aggregate = profile?.aggregate || 0;

  const corePoints = useMemo(() => {
    const cores = allStudentGrades.filter((g) => g.category === "core");
    const eng = cores.find((c) => c.subjectName.toLowerCase().includes("english"));
    const math = cores.find((c) => c.subjectName.toLowerCase().includes("math"));
    const science = cores.find((c) => c.subjectName.toLowerCase().includes("science"));
    const social = cores.find((c) => c.subjectName.toLowerCase().includes("social"));

    let sum = 0;
    if (eng) sum += parseInt(eng.grade.slice(1)) || 0;
    if (math) sum += parseInt(math.grade.slice(1)) || 0;

    if (science && social) {
      const sVal = parseInt(science.grade.slice(1)) || 9;
      const socVal = parseInt(social.grade.slice(1)) || 9;
      sum += Math.min(sVal, socVal);
    } else if (science) {
      sum += parseInt(science.grade.slice(1)) || 0;
    } else if (social) {
      sum += parseInt(social.grade.slice(1)) || 0;
    }
    return sum;
  }, [allStudentGrades]);

  const electivePoints = useMemo(() => {
    return Math.max(0, aggregate - corePoints);
  }, [aggregate, corePoints]);

  // Match all programmes with gender affirmative action support
  const allMatches: ProgrammeMatchResult[] = useMemo(() => {
    if (!profile || allStudentGrades.length === 0) return [];
    const matches = matchProgrammesAgainstGrades(
      allStudentGrades,
      aggregate,
      OFFICIAL_PROGRAMMES,
      profile.gender
    );

    // Sort: Qualified first, then Fee-Paying, then Competitive, then Others
    return matches.sort((a, b) => {
      const rankOrder: Record<string, number> = {
        qualified: 1,
        fee_paying: 2,
        competitive: 3,
        prerequisite_missing: 4,
        unqualified: 5,
      };
      const rankA = rankOrder[a.statusTier] || 99;
      const rankB = rankOrder[b.statusTier] || 99;
      if (rankA !== rankB) return rankA - rankB;
      return b.matchScore - a.matchScore;
    });
  }, [profile, allStudentGrades, aggregate]);

  // Filter Options & Counts Calculation
  const universityOptions: UniversityOption[] = useMemo(() => {
    const map = new Map<string, number>();
    allMatches.forEach((m) => {
      const shortName = m.university.shortName;
      map.set(shortName, (map.get(shortName) || 0) + 1);
    });
    return Array.from(map.entries()).map(([shortName, count]) => ({
      shortName,
      count,
    }));
  }, [allMatches]);

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const map = new Map<string, number>();
    allMatches.forEach((m) => {
      const cat = m.programme.category || "General";
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [allMatches]);

  const counts = useMemo(() => {
    return {
      all: allMatches.length,
      qualified: allMatches.filter((m) => m.statusTier === "qualified" || m.statusTier === "competitive").length,
      feePaying: allMatches.filter((m) => m.statusTier === "fee_paying").length,
    };
  }, [allMatches]);

  // Filtered Matches
  const filteredMatches = useMemo(() => {
    return allMatches.filter((match) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesProg = match.programme.name.toLowerCase().includes(q);
        const matchesUni = match.university.name.toLowerCase().includes(q) || match.university.shortName.toLowerCase().includes(q);
        const matchesFaculty = match.programme.faculty?.toLowerCase().includes(q);
        if (!matchesProg && !matchesUni && !matchesFaculty) return false;
      }

      // University filter
      if (selectedUniversity !== "all" && match.university.shortName !== selectedUniversity) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && match.programme.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter === "qualified" && !match.qualified) {
        return false;
      }
      if (statusFilter === "fee_paying" && match.statusTier !== "fee_paying") {
        return false;
      }

      return true;
    });
  }, [allMatches, searchQuery, selectedUniversity, selectedCategory, statusFilter]);

  const remainingCount = allMatches.length;

  const qualifiedMatches = useMemo(() => {
    return allMatches.filter((m) => m.qualified);
  }, [allMatches]);

  // Compute deterministic signature for the current check
  const currentSignature = useMemo(() => {
    if (!profile) return "";
    if (profile.resultSignature) return profile.resultSignature;
    return generateGradeSignature({
      gender: profile.gender,
      selectedStreamId: profile.selectedStreamId,
      allGrades: allStudentGrades,
    });
  }, [profile, allStudentGrades]);

  // Synchronize unlock status with the current check's signature
  useEffect(() => {
    if (!currentSignature) {
      setIsUnlocked(false);
      return;
    }
    const unlockedMap = getUnlockedSignatures();
    const isThisCheckPaid = Boolean(unlockedMap[currentSignature]);
    setIsUnlocked(isThisCheckPaid);
  }, [currentSignature]);

  // Detect return from Paystack checkout (e.g. ?reference=xxx or ?trxref=xxx)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("reference") || params.get("trxref");
    if (!ref) return;

    setIsVerifyingPayment(true);
    fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          const paidSignature = data.data?.metadata?.resultSignature;
          const targetSig = paidSignature || currentSignature;
          if (targetSig) {
            saveUnlockedSignature(targetSig, ref, data.data?.customer?.email);
          }

          if (!paidSignature || paidSignature === currentSignature) {
            setIsUnlocked(true);
            setPaymentNotice("Payment verified! Full access to this admission report has been unlocked.");
          } else {
            setIsUnlocked(false);
            setPaymentNotice(
              "Payment verified for a previous check. To view full details for these newly modified grades, please unlock this result."
            );
          }
        } else {
          setPaymentNotice(data.message || "Payment verification failed. Please contact support.");
        }
      })
      .catch((err: unknown) => {
        console.error("Payment verification error:", err);
        setPaymentNotice("Could not verify payment automatically. Please refresh or try again.");
      })
      .finally(() => {
        setIsVerifyingPayment(false);
        // Clean query params so browser refresh does not re-trigger verification
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      });
  }, [currentSignature]);

  const handleTeaserClick = () => {
    const paywallEl = document.getElementById("paywall-card");
    if (paywallEl) {
      paywallEl.scrollIntoView({ behavior: "smooth", block: "center" });
      const emailInput = paywallEl.querySelector("input");
      if (emailInput) {
        setTimeout(() => emailInput.focus(), 350);
      }
    } else {
      setIsPaywallOpen(true);
    }
  };

  const handleUnlockSuccess = (reference = "manual_unlock", email?: string) => {
    if (currentSignature) {
      saveUnlockedSignature(currentSignature, reference, email);
    }
    setIsUnlocked(true);
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      let email = "candidate@passmarkgh.site";
      let ref = "";
      if (typeof window !== "undefined") {
        email =
          localStorage.getItem("passmark_user_email") ||
          localStorage.getItem("passmark_user_contact") ||
          email;
        const unlockedMap = getUnlockedSignatures();
        ref =
          unlockedMap[currentSignature]?.reference ||
          localStorage.getItem("passmark_payment_ref") ||
          "";
      }

      const { generateAdmissionsDossierPdf } = await import("@/lib/pdf/generate-report");

      await generateAdmissionsDossierPdf({
        candidateEmail: email,
        examType: profile?.examType || "WASSCE (May/June)",
        gender: profile?.gender || "Not Specified",
        selectedStreamId: profile?.selectedStreamId || "general-science",
        aggregate,
        corePoints,
        electivePoints,
        grades: allStudentGrades,
        matches: allMatches,
        paymentReference: ref,
      });
    } catch (err) {
      console.error("PDF generation error:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-lg mx-auto py-16 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-blue border-t-transparent" />
        <p className="text-xs text-slate-500 font-normal">Loading your admission results...</p>
      </div>
    );
  }

  // If no profile found in localStorage
  if (!profile) {
    return (
      <div className="w-full max-w-lg mx-auto py-12 text-center space-y-6">
        <Card className="p-8 border-slate-200/90 rounded-3xl bg-white shadow-sm space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center mx-auto">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">No Grades Entered Yet</h2>
            <p className="text-xs text-slate-500 font-normal mt-1 max-w-xs mx-auto">
              Please enter your WASSCE or NOVDEC grades to see your official Ghanaian university cutoffs and matching programmes.
            </p>
          </div>
          <Link href="/check" className="block pt-2">
            <Button className="w-full h-12 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl gap-2 shadow-md text-sm">
              <span>Enter Your Grades Now</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header with Navigation */}
      <ResultsHeader onReset={() => router.push("/check")} />

      {/* Hero Scorecard */}
      <ResultsScorecard
        aggregate={aggregate}
        corePoints={corePoints}
        electivePoints={electivePoints}
        gender={profile.gender}
        selectedStreamId={profile.selectedStreamId}
        totalQualified={counts.qualified + counts.feePaying}
        totalInstitutions={universityOptions.length}
      />

      {/* Payment Verifying Status Banner */}
      {isVerifyingPayment && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-brand-darkBlue flex items-center gap-3 text-xs animate-in fade-in">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-blue border-t-transparent shrink-0" />
          <span className="font-semibold">Verifying your payment with Paystack... Please wait.</span>
        </div>
      )}

      {/* Payment Failure / Status Notice */}
      {paymentNotice && !isVerifyingPayment && !isUnlocked && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-3 text-xs animate-in fade-in">
          <span className="font-medium">{paymentNotice}</span>
        </div>
      )}

      {/* Unlocked banner if already paid */}
      {isUnlocked && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Full Access Unlocked (Viewing all {allMatches.length} programmes)</span>
          </div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 active:bg-emerald-300 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-60"
          >
            {isGeneratingPdf ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent shrink-0" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5 shrink-0" />
                <span>PDF</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Unlocked Experience: Search, Filters & Full Programme List */}
      {isUnlocked ? (
        <>
          {/* Filters Bar — Only for paying users */}
          <ResultsFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedUniversity={selectedUniversity}
            onUniversityChange={setSelectedUniversity}
            universities={universityOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categoryOptions}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            counts={counts}
          />

          {/* Full Results List */}
          <div className="space-y-4">
            {filteredMatches.length > 0 ? (
              <>
                {filteredMatches.map((match) => (
                  <ProgrammeCard key={match.programme.id} match={match} />
                ))}

                {/* Bottom Dossier Download Card */}
                <div className="pt-3">
                  <div className="rounded-3xl border border-blue-200/90 bg-gradient-to-br from-blue-50 via-white to-blue-50/60 p-5 sm:p-6 text-center space-y-3 shadow-xs">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white mx-auto shadow-md">
                      <Download className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Official Admissions Dossier (PDF)
                      </h4>
                      <p className="text-xs text-slate-600 font-normal max-w-sm mx-auto mt-1 leading-relaxed">
                        Export your verified WAEC Best 6 score statement, points audit, and complete university eligibility report.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="w-full h-12 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-2xl shadow-md text-sm gap-2 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Generating PDF Dossier...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download Official PDF Report</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Card className="p-8 border-slate-200/90 rounded-3xl bg-white text-center space-y-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FilterX className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">No Matching Programmes</h3>
                <p className="text-xs text-slate-500 font-normal max-w-xs mx-auto">
                  No programmes match your current filter settings. Try resetting your search or university filter.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedUniversity("all");
                    setSelectedCategory("all");
                    setStatusFilter("all");
                  }}
                  className="rounded-xl text-xs font-medium h-9 mt-2"
                >
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </>
      ) : (
        /* Free User Experience: No search/filter bar, 2 blurred teaser rows, and prominent paywall card */
        <div className="space-y-5">
          {/* Teaser Section Header */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Sparkles className="h-3.5 w-3.5 text-brand-blue" />
              Eligible Programme Previews (Locked)
            </span>
            <span className="text-brand-blue bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full font-semibold text-[11px]">
              {counts.qualified + counts.feePaying} Qualified
            </span>
          </div>

          {/* 2 Blurred & Locked Teaser Programme Cards */}
          <div className="space-y-3.5">
            <LockedProgrammeCard
              match={qualifiedMatches[0] || allMatches[0]}
              index={0}
              onUnlockClick={handleTeaserClick}
            />
            <LockedProgrammeCard
              match={qualifiedMatches[1] || allMatches[1]}
              index={1}
              onUnlockClick={handleTeaserClick}
            />
          </div>

          {/* Prominent Paywall Card: Unlock full results for ₵15 */}
          <div id="paywall-card" className="pt-2">
            <ProminentPaywallCard
              aggregate={aggregate}
              totalMatches={counts.all}
              totalInstitutions={universityOptions.length}
              resultSignature={currentSignature}
              checkId={profile?.checkId}
              onUnlocked={handleUnlockSuccess}
            />
          </div>
        </div>
      )}

      {/* Paywall / PDF Report Unlock Modal */}
      <ResultsPaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        aggregate={aggregate}
        totalMatches={counts.all}
        remainingCount={remainingCount}
        resultSignature={currentSignature}
        checkId={profile?.checkId}
        onUnlocked={handleUnlockSuccess}
      />
    </div>
  );
}
