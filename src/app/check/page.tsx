import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GradeEntryForm } from "@/components/check/grade-entry-form";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Check Your Aggregate & University Eligibility — PassMarkGH",
  description:
    "Enter your WASSCE grades to calculate your official WAEC Best 6 aggregate score and discover all degree programmes you qualify for across Ghanaian universities.",
};

export default function CheckPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="mx-auto max-w-xl px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-10">
          {/* Breadcrumb / Back link */}
          <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-blue transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-semibold text-slate-600">Admission Checker</span>
          </nav>

          {/* Centered Mobile-First Wizard */}
          <GradeEntryForm />
        </main>
      </div>

      <Footer />
    </div>
  );
}
