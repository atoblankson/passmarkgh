import React from "react";
import { FloatingNavbar } from "@/components/landing/floating-navbar";
import KineticGrid from "@/components/ui/kinetic-grid";
import { HeroActionBar } from "@/components/landing/hero-action-bar";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { InteractiveCalculatorTeaser } from "@/components/landing/interactive-calculator-teaser";
import { UniversitiesGrid } from "@/components/landing/universities-grid";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FAQSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/layout/footer";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Floating Header */}
      <FloatingNavbar />

      {/* Hero Section Wrapped in Interactive KineticGrid */}
      <div id="hero-section">
        <KineticGrid globalColor="default" className="pt-32 sm:pt-36 md:pt-44 pb-14 sm:pb-20 md:pb-28 px-4 sm:px-6">
          {/* Soft Radial Ambient Glow Gradients */}
          <div className="absolute top-1/4 -left-48 -z-10 w-[600px] h-[600px] bg-emerald-400/15 blur-[140px] rounded-full pointer-events-none animate-pulseGlow" />
          <div className="absolute top-1/4 -right-48 -z-10 w-[600px] h-[600px] bg-blue-500/15 blur-[140px] rounded-full pointer-events-none animate-pulseGlow" />

          <div className="mx-auto max-w-4xl text-center">
            {/* Main High-Impact Responsive Headline */}
            <h1 className="text-[32px] sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold tracking-tight text-slate-950 leading-[1.12] sm:leading-[1.1] text-balance">
              Know every university you qualify for{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                before buying a single form
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 max-w-xl mx-auto text-sm sm:text-lg font-normal text-slate-600 leading-relaxed text-balance">
              Stop wasting ₵150+ on rejected forms. Enter your WASSCE grades to calculate your aggregate and match with every programme you qualify for across Ghana.
            </p>

            {/* Inline Action Bar */}
            <HeroActionBar />
          </div>
        </KineticGrid>
      </div>

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
              <AnimatedCounter target={761} suffix="+" duration={1100} />
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              Students Checked Today
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

      {/* Customer Testimonials & Social Proof Section */}
      <ScrollReveal variant="fade-up" threshold={0.1}>
        <TestimonialsSection />
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
