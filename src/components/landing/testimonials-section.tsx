"use client";

import React from "react";
import { Star, Quote, CheckCircle, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { scrollToHeroInput } from "@/components/landing/hero-action-bar";

interface Testimonial {
  name: string;
  role: string;
  school: string;
  admittedTo: string;
  quote: string;
  rating: number;
  initials: string;
  badgeColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Kwaku Asare",
    role: "WASSCE Graduate",
    school: "Presec Legon Alum",
    admittedTo: "BSc Computer Science, KNUST",
    quote:
      "I thought my aggregate 11 meant I had to guess between UG and KNUST. PassMarkGH showed me my elective science grades met KNUST's prerequisite but missed UG's cutoff. Saved my dad ₵500 in wasted forms!",
    rating: 5,
    initials: "KA",
    badgeColor: "bg-blue-600",
  },
  {
    name: "Akosua Boateng",
    role: "WASSCE Graduate",
    school: "Wesley Girls Alum",
    admittedTo: "BSc Administration, UG Legon",
    quote:
      "Everyone told me I wouldn't get into Legon Business School with aggregate 13. PassMarkGH verified that with my core maths and economics grades, I comfortably met the cutoff. I got admitted in the first batch!",
    rating: 5,
    initials: "AB",
    badgeColor: "bg-indigo-600",
  },
  {
    name: "Mr. Emmanuel Osei",
    role: "Parent",
    school: "Kumasi, Ashanti",
    admittedTo: "BSc Nursing, UCC (Daughter)",
    quote:
      "Last year my older son bought 4 different university forms and was rejected by 3 because of a single D7. For my daughter this year, we used PassMarkGH first. We bought only one form for UCC and she got admitted right away.",
    rating: 5,
    initials: "EO",
    badgeColor: "bg-emerald-600",
  },
  {
    name: "Efua Mensah",
    role: "WASSCE Graduate",
    school: "Holy Child Alum",
    admittedTo: "Doctor of Pharmacy, UCC",
    quote:
      "The prerequisite checker is a lifesaver. Most people only look at aggregate, but PassMarkGH warned me about specific chemistry grade requirements before I spent a single cedi on the wrong voucher.",
    rating: 5,
    initials: "EM",
    badgeColor: "bg-purple-600",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 bg-slate-50/70 border-t border-slate-200/80">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge className="bg-blue-100 text-brand-blue border-blue-200 mb-3 font-semibold">
            <GraduationCap className="mr-1.5 h-3.5 w-3.5 text-brand-blue" />
            Proven Student Success
          </Badge>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved by Ghanaian Students &amp; Parents
          </h2>

          <p className="mt-3 text-base text-slate-600">
            Hear from students and parents who avoided costly application mistakes and secured admission to their dream programmes on the first try.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-slate-200" />
                </div>

                {/* Quote Text */}
                <p className="text-sm leading-relaxed text-slate-700 font-medium mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              {/* Author Info & Verified Admission Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-xs shadow-xs ${t.badgeColor}`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-500">{t.school}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                    <span>{t.admittedTo}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar */}
        <div className="mt-12 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-around gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white ring-2 ring-white">
                KA
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white ring-2 ring-white">
                AB
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white ring-2 ring-white">
                EM
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white ring-2 ring-white">
                EO
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 ml-1">
              4.9/5 Average Rating
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Over <strong className="text-slate-900">3,400+ WASSCE checks</strong> completed nationwide
          </div>

          <button
            type="button"
            onClick={scrollToHeroInput}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-darkBlue transition-colors cursor-pointer group"
          >
            <span>Check your own eligibility now</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
