"use client";

import React, { useState } from "react";
import { MapPin, CheckCircle, Plus, ArrowRight } from "lucide-react";
import { GHANA_UNIVERSITIES } from "@/data/universities";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { scrollToHeroInput } from "@/components/landing/hero-action-bar";

function UniAvatar({ name, shortName, logoUrl }: { name: string; shortName: string; logoUrl?: string }) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <div className="h-10 w-10 shrink-0 rounded-xl border border-slate-200 bg-white p-1 shadow-xs flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue font-black text-xs group-hover:bg-brand-blue group-hover:text-white transition-colors">
      {shortName.slice(0, 3)}
    </span>
  );
}

export function UniversitiesGrid() {
  // We display top 9 universities (3 full rows) with the bottom row seamlessly fading into the blur overlay
  const displayedUnis = GHANA_UNIVERSITIES.slice(0, 9);
  const remainingCount = GHANA_UNIVERSITIES.length - displayedUnis.length;

  return (
    <section id="universities" className="py-20 bg-slate-50/70 border-t border-slate-200/80 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            All Major Ghanaian Universities in One Place
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            No need to visit 10 different university portals. PassMarkGH aggregates official admission cutoffs and prerequisites across Ghana.
          </p>
        </ScrollReveal>

        {/* Grid Container with Bottom Fade & Blur Overlay */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
            {displayedUnis.map((uni, idx) => {
              const isFaded = idx >= 6;
              return (
                <ScrollReveal key={uni.id} variant="zoom-in" delay={Math.min(idx, 5) * 80} threshold={0.08}>
                  <div
                    className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all flex flex-col justify-between group ${
                      isFaded
                        ? "opacity-40 blur-[1.5px] select-none pointer-events-none"
                        : "hover:shadow-soft hover:border-blue-300"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <UniAvatar name={uni.name} shortName={uni.shortName} logoUrl={uni.logoUrl} />
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                          {uni.type}
                        </Badge>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {uni.name}
                      </h3>
                      <div className="mt-2 flex items-center text-xs text-slate-500 gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{uni.location}, {uni.region}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-700 font-semibold">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        Cutoffs Verified
                      </span>
                      <span className="text-slate-400 group-hover:text-brand-blue transition-colors">
                        {uni.shortName}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Gradient Blur Overlay & "+ And More" Floating Pill Card */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-50/95 via-slate-50/80 to-transparent flex items-end justify-center pb-1">
            <div className="rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 shadow-xl text-center max-w-xl w-full mx-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-blue-300">
              <div className="flex items-center gap-3.5 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-brand-blue font-black">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    + {remainingCount}+ More Universities &amp; Technical Institutes
                  </div>
                  <div className="text-xs text-slate-500">
                    Including ATU, KsTU, TTU, HTU, STU &amp; accredited private institutions across Ghana.
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToHeroInput}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-brand-blue hover:bg-brand-darkBlue text-white px-4 py-2 text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>Check Matches</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
