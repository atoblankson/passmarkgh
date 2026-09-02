import { Subject } from "@/types";

export const WASSCE_CORE_SUBJECTS: Subject[] = [
  {
    id: "core-english",
    name: "English Language",
    category: "core",
    examType: "WASSCE",
  },
  {
    id: "core-maths",
    name: "Core Mathematics",
    category: "core",
    examType: "WASSCE",
  },
  {
    id: "core-science",
    name: "Integrated Science",
    category: "core",
    examType: "WASSCE",
  },
  {
    id: "core-social",
    name: "Social Studies",
    category: "core",
    examType: "WASSCE",
  },
];

export const WASSCE_ELECTIVE_SUBJECTS: Subject[] = [
  // Science
  { id: "elec-emaths", name: "Elective Mathematics", category: "elective", examType: "WASSCE", group: "General Science" },
  { id: "elec-physics", name: "Physics", category: "elective", examType: "WASSCE", group: "General Science" },
  { id: "elec-chem", name: "Chemistry", category: "elective", examType: "WASSCE", group: "General Science" },
  { id: "elec-bio", name: "Biology", category: "elective", examType: "WASSCE", group: "General Science" },
  { id: "elec-ict", name: "Information & Comm. Tech (Elective)", category: "elective", examType: "WASSCE", group: "General Science" },
  
  // General Arts
  { id: "elec-econ", name: "Economics", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-govt", name: "Government", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-geog", name: "Geography", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-hist", name: "History", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-lit", name: "Literature in English", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-french", name: "French", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-crs", name: "Christian Religious Studies (CRS)", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-irs", name: "Islamic Religious Studies (IRS)", category: "elective", examType: "WASSCE", group: "General Arts" },
  { id: "elec-gh-lang", name: "Ghanaian Language (Twi/Fante/Ga/Ewe)", category: "elective", examType: "WASSCE", group: "General Arts" },

  // Business
  { id: "elec-accounting", name: "Financial Accounting", category: "elective", examType: "WASSCE", group: "Business" },
  { id: "elec-costing", name: "Cost Accounting", category: "elective", examType: "WASSCE", group: "Business" },
  { id: "elec-bus-mgmt", name: "Business Management", category: "elective", examType: "WASSCE", group: "Business" },
  { id: "elec-business-maths", name: "Business Mathematics", category: "elective", examType: "WASSCE", group: "Business" },
  { id: "elec-typewriting", name: "Typewriting / Clerical Office", category: "elective", examType: "WASSCE", group: "Business" },

  // Visual Arts
  { id: "elec-gka", name: "General Knowledge in Art (GKA)", category: "elective", examType: "WASSCE", group: "Visual Arts" },
  { id: "elec-graphic-design", name: "Graphic Design", category: "elective", examType: "WASSCE", group: "Visual Arts" },
  { id: "elec-picture-making", name: "Picture Making", category: "elective", examType: "WASSCE", group: "Visual Arts" },
  { id: "elec-ceramics", name: "Ceramics", category: "elective", examType: "WASSCE", group: "Visual Arts" },
  { id: "elec-sculpture", name: "Sculpture", category: "elective", examType: "WASSCE", group: "Visual Arts" },
  { id: "elec-textiles", name: "Textiles", category: "elective", examType: "WASSCE", group: "Visual Arts" },

  // Home Economics
  { id: "elec-food-nutrition", name: "Food & Nutrition", category: "elective", examType: "WASSCE", group: "Home Economics" },
  { id: "elec-mgmt-in-living", name: "Management in Living", category: "elective", examType: "WASSCE", group: "Home Economics" },
  { id: "elec-clothing-textiles", name: "Clothing & Textiles", category: "elective", examType: "WASSCE", group: "Home Economics" },

  // Agricultural Science
  { id: "elec-gen-agric", name: "General Agriculture", category: "elective", examType: "WASSCE", group: "Agricultural Science" },
  { id: "elec-animal-husbandry", name: "Animal Husbandry", category: "elective", examType: "WASSCE", group: "Agricultural Science" },
  { id: "elec-crop-husbandry", name: "Crop Husbandry & Horticulture", category: "elective", examType: "WASSCE", group: "Agricultural Science" },
  { id: "elec-fisheries", name: "Fisheries", category: "elective", examType: "WASSCE", group: "Agricultural Science" },

  // Technical
  { id: "elec-tech-drawing", name: "Technical Drawing", category: "elective", examType: "WASSCE", group: "Technical" },
  { id: "elec-woodwork", name: "Woodwork", category: "elective", examType: "WASSCE", group: "Technical" },
  { id: "elec-metalwork", name: "Metalwork", category: "elective", examType: "WASSCE", group: "Technical" },
  { id: "elec-building-construction", name: "Building Construction", category: "elective", examType: "WASSCE", group: "Technical" },
  { id: "elec-applied-electricity", name: "Applied Electricity", category: "elective", examType: "WASSCE", group: "Technical" },
  { id: "elec-auto-mechanics", name: "Auto Mechanics", category: "elective", examType: "WASSCE", group: "Technical" },
];

export const ALL_WASSCE_SUBJECTS = [...WASSCE_CORE_SUBJECTS, ...WASSCE_ELECTIVE_SUBJECTS];
