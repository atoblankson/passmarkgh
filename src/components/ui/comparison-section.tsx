"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  title: string;
  description: string;
}

const oldWayItems: ComparisonItem[] = [
  {
    title: "Blind guessing",
    description:
      "Buying 3–4 university application forms without knowing if you meet specific faculty cutoff marks.",
  },
  {
    title: "Uncertainty & Panic",
    description:
      "Scouring unverified social media PDFs, outdated forum posts, and rumors.",
  },
  {
    title: "Subject requirement traps",
    description:
      "Getting disqualified simply because your elective maths or science grade was D7 instead of C6.",
  },
  {
    title: "Repeated rejections",
    description:
      "Wasted hundreds of cedis and ending up staying home for a gap year.",
  },
];

const smartWayItems: ComparisonItem[] = [
  {
    title: "Instant Best 6 Calculation",
    description:
      "Official WAEC calculation formula applied accurately in milliseconds.",
  },
  {
    title: "All Universities at Once",
    description:
      "Scan UG, KNUST, UCC, UDS, UEW, UPSA, UMaT and more in a single click.",
  },
  {
    title: "Prerequisite Verification",
    description:
      "Instantly validates whether your specific subject grades satisfy faculty requirements.",
  },
  {
    title: "Apply with 100% Confidence",
    description:
      "Only spend money on forms for programmes where your admission probability is high.",
  },
];

export default function ComparisonSection({
  className,
}: {
  className?: string;
}) {
  return (
    <section id="comparison" className={cn("py-20 px-4 sm:px-6 bg-white", className)}>
      <div className="mx-auto max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Why we are better?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            How our students avoid rejection, save over GH₵580, and get admitted into their dream programmes on the first try.
          </p>
        </div>

        {/* 2-Column Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* ── Old Way ─────────────────────────────────────────────────── */}
          <Card className="relative overflow-hidden border-slate-200 bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover-lift transition-all">
            <div>
              {/* Header */}
              <div className="border-b border-slate-100 pb-5 mb-6">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    THE OLD WAY
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-600 border-red-200 font-semibold text-xs px-2.5 py-0.5"
                  >
                    ~GH₵600+ spent
                  </Badge>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Blind Buying &amp; Guesswork
                </h3>
              </div>

              {/* Items with vertical indicator line */}
              <div className="space-y-6">
                {oldWayItems.map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 border-slate-300 pl-4 py-0.5 transition-all"
                  >
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-8 pt-4">
              <div className="flex items-center gap-2.5 rounded-2xl border border-red-200/80 bg-white/90 p-4 shadow-2xs">
                <TrendingDown className="h-4 w-4 shrink-0 text-red-500" />
                <p className="text-xs font-semibold text-red-600">
                  High financial waste &amp; unnecessary admission heartbreak
                </p>
              </div>
            </div>
          </Card>

          {/* ── The PassMarkGH Way ──────────────────────────────────────── */}
          <Card className="relative overflow-hidden border-2 border-brand-blue bg-blue-50/30 rounded-3xl flex flex-col justify-between shadow-md hover-lift transition-all p-0">
            {/* Top Unified Header Banner */}
            <div className="w-full bg-brand-blue py-2.5 px-6 sm:px-8 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shimmer-badge">
              <span>SMART CHOICE</span>
              <span className="text-[10px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                Recommended
              </span>
            </div>

            <div className="p-6 sm:p-8 pt-6 flex flex-col justify-between flex-1">
              <div>
                {/* Header */}
                <div className="border-b border-blue-100 pb-5 mb-6">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-blue">
                      <Image
                        src="/logo-mark.png"
                        alt="PassMarkGH"
                        width={16}
                        height={16}
                        className="h-4 w-4 object-contain inline-block"
                      />
                      <span>THE PASSMARKGH WAY</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900">
                      Targeted, Verified Matching
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-700 border-blue-200 font-semibold text-xs px-2.5 py-0.5"
                    >
                      Just GH₵20
                    </Badge>
                  </div>
                </div>

                {/* Items with blue vertical indicator line */}
                <div className="space-y-6">
                  {smartWayItems.map((item) => (
                    <div
                      key={item.title}
                      className="border-l-2 border-blue-500 pl-4 py-0.5 transition-all"
                    >
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Vibrant Blue CTA Banner */}
              <div className="mt-8 pt-4">
                <a
                  href="#waitlist"
                  className="group flex items-center justify-between rounded-2xl bg-brand-blue p-5 text-white shadow-md hover:bg-brand-darkBlue transition-all"
                >
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-0.5">
                      GUARANTEED CLARITY
                    </div>
                    <div className="text-sm font-bold text-white group-hover:text-blue-50">
                      Save up to GH₵580+ and secure your university admission
                    </div>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition-transform group-hover:scale-110 group-hover:bg-white/30 ml-3">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </a>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}
