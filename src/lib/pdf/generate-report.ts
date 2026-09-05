import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ProgrammeMatchResult, StudentSubjectGrade } from "@/types";
import { SHS_STREAM_PRESETS } from "@/data/subjects";

export interface GeneratePdfParams {
  candidateEmail?: string;
  examType?: string;
  gender?: string;
  selectedStreamId?: string;
  aggregate: number;
  corePoints: number;
  electivePoints: number;
  grades: StudentSubjectGrade[];
  matches: ProgrammeMatchResult[];
  paymentReference?: string;
}

async function getBase64ImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateAdmissionsDossierPdf(params: GeneratePdfParams) {
  const {
    candidateEmail = "candidate@passmarkgh.site",
    examType = "WASSCE (May/June)",
    gender = "Not Specified",
    selectedStreamId = "general-science",
    aggregate,
    corePoints,
    electivePoints,
    grades,
    matches,
    paymentReference,
  } = params;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Attempt to fetch brand logo
  let logoBase64 = await getBase64ImageFromUrl("/logo-mark.png");
  if (!logoBase64) {
    logoBase64 = await getBase64ImageFromUrl("/logo.png");
  }

  const stream =
    SHS_STREAM_PRESETS.find((s) => s.id === selectedStreamId)?.name ||
    selectedStreamId.replace(/-/g, " ").toUpperCase();

  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const docRef =
    paymentReference ||
    `PMGH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  let tierLabel = "Direct Degree Qualified";
  if (aggregate <= 9) {
    tierLabel = "Top-Tier Competitive (Medicine, Law, CS, Engineering)";
  } else if (aggregate <= 15) {
    tierLabel = "High Competitive Tier (Computing, Nursing, Business, Architecture)";
  } else if (aggregate <= 24) {
    tierLabel = "Standard Degree Tier (Arts, Sciences, Administration, Education)";
  } else if (aggregate <= 36) {
    tierLabel = "Technical & Broad Admissions Degree Stream";
  }

  const primaryColor = [30, 58, 138] as [number, number, number]; // #1E3A8A Dark Royal Navy
  const accentColor = [37, 99, 235] as [number, number, number]; // #2563EB Brand Blue
  const slateDark = [15, 23, 42] as [number, number, number]; // #0F172A
  const slateMuted = [100, 116, 139] as [number, number, number]; // #64748B
  const emeraldColor = [5, 150, 105] as [number, number, number]; // #059669

  // ==========================================
  // PAGE 1: HEADER & CANDIDATE DOSSIER SUMMARY
  // ==========================================

  // Top Navy Header Bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 25, "F");

  // Render Official Logo if loaded
  let titleX = 14;
  if (logoBase64) {
    try {
      // Rounded white backing chip for logo mark
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(14, 4.5, 16, 16, 2.5, 2.5, "F");
      doc.addImage(logoBase64, "PNG", 15.5, 6, 13, 13);
      titleX = 34;
    } catch {
      titleX = 14;
    }
  }

  // Logo / Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.text("PASSMARK GHANA", titleX, 11.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(191, 219, 254);
  doc.text("OFFICIAL TERTIARY ADMISSIONS ELIGIBILITY & BEST 6 DOSSIER", titleX, 17.5);

  // Date at top right
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`ISSUED: ${generatedDate}`, 196, 14.5, { align: "right" });

  // Reset text color
  doc.setTextColor(...slateDark);

  // Section 1: Candidate Information
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("1. CANDIDATE PROFILE & VERIFICATION", 14, 33);

  // Candidate Profile Table
  const candidateInfo = [
    [
      { content: "Candidate Email / ID:", styles: { fontStyle: "bold" as const, cellWidth: 42 } },
      { content: candidateEmail },
      { content: "Examination Type:", styles: { fontStyle: "bold" as const, cellWidth: 38 } },
      { content: examType.toUpperCase() },
    ],
    [
      { content: "SHS Stream / Track:", styles: { fontStyle: "bold" as const } },
      { content: stream },
      { content: "Affirmative Action:", styles: { fontStyle: "bold" as const } },
      { content: gender.toLowerCase() === "female" ? "Applied (Female STEM Concession)" : "Standard" },
    ],
    [
      { content: "Verification Status:", styles: { fontStyle: "bold" as const } },
      { content: "Official Paid Verification (Verified Complete)", styles: { textColor: emeraldColor } },
      { content: "Dossier Reference:", styles: { fontStyle: "bold" as const } },
      { content: docRef },
    ],
  ];

  autoTable(doc, {
    startY: 34,
    body: candidateInfo,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 2,
      textColor: slateDark,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { fillColor: [248, 250, 252] },
      2: { fillColor: [248, 250, 252] },
    },
    margin: { left: 14, right: 14 },
  });

  // Section 2: Official WAEC Grade Breakdown
  const finalY1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.text("2. WAEC GRADE STATEMENT & POINTS BREAKDOWN", 14, finalY1);

  const gradeRows = grades.map((g, idx) => {
    const isCore = g.category === "core";
    const gradeVal = parseInt(g.grade.slice(1)) || 9;
    let remarks = "Credit";
    if (gradeVal === 1) remarks = "Excellent";
    else if (gradeVal === 2) remarks = "Very Good";
    else if (gradeVal === 3) remarks = "Good";
    else if (gradeVal <= 6) remarks = "Credit";
    else if (gradeVal <= 8) remarks = "Pass";
    else remarks = "Fail";

    return [
      (idx + 1).toString(),
      g.subjectName,
      isCore ? "Core Subject" : "Elective Subject",
      g.grade,
      `${gradeVal} pt${gradeVal > 1 ? "s" : ""}`,
      remarks,
    ];
  });

  autoTable(doc, {
    startY: finalY1 + 2,
    head: [["#", "Subject Name", "Category", "Grade", "Points", "WAEC Interpretation"]],
    body: gradeRows,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      cellPadding: 2,
    },
    styles: {
      fontSize: 7.8,
      cellPadding: 2,
      lineColor: [241, 245, 249],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Scorecard Highlight Box
  const finalY2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;

  doc.setFillColor(239, 246, 255); // Light blue #EFF6FF
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(0.4);
  doc.roundedRect(14, finalY2, 182, 22, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primaryColor);
  doc.text(`OFFICIAL WAEC BEST 6 AGGREGATE: ${aggregate < 10 ? `0${aggregate}` : aggregate}`, 20, finalY2 + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...slateDark);
  doc.text(`Core Points (English + Core Maths + Science/Social): ${corePoints} pts   |   Elective Points (Best 3): ${electivePoints} pts`, 20, finalY2 + 13);
  doc.text(`Academic Standing Tier: ${tierLabel}`, 20, finalY2 + 18);

  // Section 3: University Programme Matches
  const finalY3 = finalY2 + 28;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...slateDark);
  doc.text("3. QUALIFIED TERTIARY PROGRAMMES & CUTOFF AUDIT", 14, finalY3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text(
    `Audited ${matches.length} university degree programmes across Ghana. Sorted by eligibility status and cutoff relevance.`,
    14,
    finalY3 + 4
  );

  const tableData = matches.map((m) => {
    const uni = `${m.university.shortName} (${m.university.location})`;
    const prog = `${m.programme.name}\n${m.programme.faculty || ""}`.trim();
    const cutoff = m.effectiveCutoff !== null ? `≤ ${m.effectiveCutoff}` : "Threshold";
    const userScore = `Agg. ${m.studentAggregate}`;

    let statusText = "DIRECT QUALIFIED";
    if (m.statusTier === "competitive") statusText = "COMPETITIVE";
    else if (m.statusTier === "fee_paying") statusText = "FEE-PAYING";
    else if (m.statusTier === "prerequisite_missing") statusText = "PREREQ MISSING";
    else if (!m.qualified) statusText = "MISSED CUTOFF";

    const reqs = m.programme.requirements?.requiredSubjects?.length
      ? m.programme.requirements.requiredSubjects.join(", ")
      : "Standard C6 in Cores";

    return [uni, prog, cutoff, userScore, statusText, reqs];
  });

  autoTable(doc, {
    startY: finalY3 + 6,
    head: [["University", "Programme & Faculty", "Cutoff", "Your Score", "Eligibility", "Key Requirements"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      cellPadding: 2.2,
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      lineColor: [226, 232, 240],
      lineWidth: 0.15,
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 32, fontStyle: "bold" },
      1: { cellWidth: 50 },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 18, halign: "center", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "center", fontStyle: "bold" },
      5: { cellWidth: 40 },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 4) {
        const text = String(data.cell.raw);
        if (text === "DIRECT QUALIFIED") {
          data.cell.styles.textColor = [5, 150, 105]; // Green
        } else if (text === "COMPETITIVE") {
          data.cell.styles.textColor = [37, 99, 235]; // Blue
        } else if (text === "FEE-PAYING") {
          data.cell.styles.textColor = [217, 119, 6]; // Amber
        } else {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        }
      }
    },
    margin: { left: 14, right: 14, bottom: 20 },
  });

  // ==========================================
  // SECTION 4: ADVISORY & PREDICTIVE DISCLAIMER
  // ==========================================
  let disclaimerY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 6;

  // If disclaimer exceeds printable page height before footer (280mm), create a new page
  if (disclaimerY + 18 > 280) {
    doc.addPage();
    disclaimerY = 16;
  }

  // Draw Subtle Formal Disclaimer Callout Box
  doc.setFillColor(248, 250, 252); // #F8FAFC Light Slate
  doc.setDrawColor(203, 213, 225); // #CBD5E1 Border
  doc.setLineWidth(0.25);
  doc.roundedRect(14, disclaimerY, 182, 16, 2, 2, "FD");

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59); // Slate 800
  doc.text("Important Notice:", 18, disclaimerY + 5);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105); // Slate 600

  const disclaimerText =
    "These results are predictions based on official university cut-off points and subject requirements. This report is a guide to help you apply smartly, but does not guarantee automatic admission. Final admission decisions are made solely by each university.";

  const splitDisclaimer = doc.splitTextToSize(disclaimerText, 174);
  doc.text(splitDisclaimer, 18, disclaimerY + 9.5);

  // ==========================================
  // FOOTER ON ALL PAGES
  // ==========================================
  const pageCount = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, 285, 196, 285);

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(...slateMuted);
    doc.text(
      "PassMarkGH Official Tertiary Admissions Dossier • Issued via passmarkgh.site • Verified against Ghanaian University Admission Handbooks.",
      14,
      290
    );

    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: "right" });
  }

  // Auto-download PDF directly in user's browser
  const sanitizedEmail = candidateEmail.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 15);
  const fileName = `PassMarkGH_Admissions_Dossier_Agg${aggregate}_${sanitizedEmail}.pdf`;
  doc.save(fileName);
}
