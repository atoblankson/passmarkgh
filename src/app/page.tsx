import React from "react";
import { CheckCircle } from "lucide-react";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import KineticGrid from "@/components/ui/kinetic-grid";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { InteractiveCalculatorTeaser } from "@/components/landing/interactive-calculator-teaser";
import { UniversitiesGrid } from "@/components/landing/universities-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { WaitlistForm } from "@/components/landing/waitlist-form";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Floating Header */}
      <FloatingNavbar />

      {/* Hero Section Wrapped in Interactive KineticGrid */}
      <KineticGrid globalColor="default" className="pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6">
        {/* Soft Radial Ambient Glow Gradients */}
        <div className="absolute top-1/4 -left-48 -z-10 w-[600px] h-[600px] bg-emerald-400/15 blur-[140px] rounded-full pointer-events-none animate-pulseGlow" />
        <div className="absolute top-1/4 -right-48 -z-10 w-[600px] h-[600px] bg-blue-500/15 blur-[140px] rounded-full pointer-events-none animate-pulseGlow" />

        <div className="mx-auto max-w-4xl text-center">
          {/* Main Huge Headline */}
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.1] text-balance">
            Know every university<br />
            you qualify for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              before<br className="hidden sm:inline" /> buying a single form
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg font-medium text-slate-900 leading-relaxed text-balance">
            Stop wasting ₵150+ on rejected forms. Enter your WASSCE grades to calculate your aggregate and match with every programme you qualify for across Ghana.
          </p>

          {/* Inline Action Bar */}
          <div className="mt-8 mx-auto max-w-lg">
            <form
              action="#waitlist"
              className="flex flex-col sm:flex-row items-center rounded-2xl sm:rounded-xl border border-slate-300/80 bg-white p-1.5 shadow-md focus-within:ring-2 focus-within:ring-brand-blue/30 focus-within:border-brand-blue transition-all gap-2 sm:gap-0"
            >
              <div className="flex-1 px-4 py-2 w-full text-left">
                <input
                  type="text"
                  placeholder="Enter email or WhatsApp phone here"
                  className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <Button
                type="submit"
                size="default"
                className="w-full sm:w-auto rounded-xl bg-brand-blue hover:bg-brand-darkBlue text-white font-bold px-6 shadow-sm flex items-center justify-center transition-transform active:scale-[0.98]"
              >
                <span>Check My Eligibility</span>
              </Button>
            </form>

            <div className="mt-3 flex items-center justify-center gap-4 text-[11px] font-bold text-slate-950">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Free Results Alert
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" /> Covers UG, KNUST, UCC &amp; more
              </span>
            </div>
          </div>
        </div>
      </KineticGrid>

      {/* Social Proof Stats Bar */}
      <section className="border-y border-slate-200/80 bg-slate-50/50 py-8 px-4 sm:px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-slate-200/80 text-center">
          <ScrollReveal variant="fade-up" delay={0} className="hover-lift px-2 py-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              <AnimatedCounter target={300000} suffix="+" duration={1200} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Annual WASSCE Candidates
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={80} className="hover-lift px-2 py-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
              <AnimatedCounter target={60} suffix="+" duration={1000} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Ghanaian Universities
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={160} className="hover-lift px-2 py-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              <AnimatedCounter target={400} suffix="+" duration={1100} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Degree Programmes Indexed
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={240} className="hover-lift px-2 py-1">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
              <AnimatedCounter prefix="GH₵" target={580} suffix="+" duration={1200} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Average Savings Per Student
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Dedicated How It Works Section */}
      <HowItWorksSection />

      {/* Comparison Section (Old Way vs PassMarkGH) */}
      <ComparisonSection />

      {/* Interactive Real-Time Calculator Teaser Widget */}
      <ScrollReveal variant="fade-up" threshold={0.08}>
        <InteractiveCalculatorTeaser />
      </ScrollReveal>

      {/* Supported Universities Showcase */}
      <UniversitiesGrid />

      {/* Pricing Section */}
      <PricingSection />

      {/* Full Waitlist & Instant Alerts Form */}
      <ScrollReveal variant="fade-up" threshold={0.1}>
        <WaitlistForm />
      </ScrollReveal>

      {/* FAQ Accordion Section */}
      <ScrollReveal variant="fade-up" threshold={0.1}>
        <FAQSection />
      </ScrollReveal>

      {/* Footer */}
      <Footer />
    </div>
  );
}
