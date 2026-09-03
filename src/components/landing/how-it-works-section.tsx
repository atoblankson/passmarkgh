import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function HowItWorksSection() {
  const steps = [
    {
      stepNumber: "1",
      title: "Enter your grades",
      description:
        "Select your WASSCE subjects and choose your grades from A1 to F9.",
      highlights: [
        "Takes less than 30 seconds",
        "Supports Science, Arts, Business & all streams",
      ],
    },
    {
      stepNumber: "2",
      title: "We calculate & match",
      description:
        "We calculate your official Best 6 aggregate and check cutoff points for every university in Ghana.",
      highlights: [
        "Covers UG, KNUST, UCC, UDS, UEW & more",
        "Validates core & elective requirements",
      ],
    },
    {
      stepNumber: "3",
      title: "See all qualifying courses",
      description:
        "Instantly see every degree programme you qualify for across all Ghanaian universities.",
      highlights: [
        "Save ₵400–₵600 on rejected forms",
        "Apply with 100% confidence",
      ],
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            How it works?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            No complicated forms, no guessing cutoffs. Find your university in 3 simple steps:
          </p>
        </ScrollReveal>

        {/* 1, 2, 3 Horizontal Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.stepNumber} variant="fade-up" delay={i * 120}>
              <div className="relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover-lift transition-all flex flex-col justify-between group hover:border-blue-300 h-full">
                <div>
                  {/* Step Number Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white font-black text-xl shadow-sm transition-transform duration-200 group-hover:scale-110 group-hover:shadow-md">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-brand-blue transition-colors">
                      Step {step.stepNumber}
                    </span>
                  </div>

                  {/* Step Title & Plain Description */}
                  <h3 className="text-xl font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-700">
                  {step.highlights.map((highlight, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
