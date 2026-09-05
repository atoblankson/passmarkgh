"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Share2 } from "lucide-react";

interface ResultsHeaderProps {
  onReset?: () => void;
}

export function ResultsHeader({ onReset }: ResultsHeaderProps) {
  const handleShare = async () => {
    if (typeof window !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "My PassMarkGH Admission Results",
          text: "Check which Ghanaian universities and degree programmes your WASSCE grades qualify for!",
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Results page link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 mb-6">
      <Link
        href="/check"
        onClick={() => onReset?.()}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Edit Grades</span>
      </Link>

      <div className="text-center">
        <h1 className="text-base sm:text-lg font-bold text-slate-900">
          Admission Results
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-brand-blue hover:border-blue-300 transition-colors cursor-pointer"
          title="Share Results"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
