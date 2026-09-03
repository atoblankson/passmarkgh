import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        
        <ScrollReveal variant="fade-up">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            One Simple Price. Zero Hidden Fees.
          </h2>
          
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            Instead of spending GH₵600+ on forms you might get rejected from, verify your eligibility across every university for the price of a lunch.
          </p>
        </ScrollReveal>

        {/* Pricing Card */}
        <ScrollReveal variant="zoom-in" delay={150}>
          <div className="mt-12 max-w-md mx-auto rounded-3xl border-2 border-brand-blue bg-white p-8 pt-10 shadow-2xl relative hover-lift transition-all overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-xl bg-brand-blue px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs">
              MOST POPULAR
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900">Full Eligibility Unlock</h3>
              <p className="text-xs text-slate-500 mt-1">Single WASSCE Result Check</p>

              <div className="mt-6 flex items-baseline justify-center gap-1">
                <span className="text-sm font-bold text-slate-500">GH₵</span>
                <span className="text-5xl font-extrabold text-slate-900">20</span>
                <span className="text-xs text-slate-500 font-medium">/ per unlock</span>
              </div>
            </div>

            {/* Features list */}
            <ul className="mt-8 space-y-3.5 text-left text-sm text-slate-700">
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-brand-blue shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Automatic WAEC Best 6 Aggregate calculation</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-brand-blue shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Scan across <strong>all Ghanaian universities</strong> instantly</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-brand-blue shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Prerequisite validation per subject &amp; grade</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-brand-blue shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Admission probability score per programme</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-brand-blue shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>Mobile Money (MTN, Telecel, AT) &amp; Card payments</span>
              </li>
            </ul>

            <div className="mt-8">
              <Button
                asChild
                className="w-full h-12 rounded-xl text-sm sm:text-base font-bold bg-brand-blue hover:bg-brand-darkBlue text-white shadow-md transition-all active:scale-[0.99]"
              >
                <a href="#waitlist" className="flex items-center justify-center gap-2">
                  <span>Join Waitlist for Launch Perks</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
