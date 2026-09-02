import React from "react";
import Image from "next/image";

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Outer Card Container */}
      <div className="relative rounded-3xl border border-slate-200/90 bg-white p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10">
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          
          {/* 1. Left Component: WASSCE Grades Sheet (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between h-[360px]">
            <div>
              {/* Header */}
              <div className="text-center font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-2">
                WASSCE Result
              </div>

              {/* Rows with square bullets (matching the Google Sheet aesthetic from screenshot) */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-xs bg-emerald-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">English Language</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">A1</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-xs bg-emerald-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">Core Mathematics</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">B2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-xs bg-emerald-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">Integrated Science</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">A1</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-xs bg-blue-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">Elective Maths</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[10px]">B2</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3.5 w-3.5 rounded-xs bg-blue-500 shrink-0" />
                  <div className="flex-1 flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700">Physics & Chemistry</span>
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 text-[10px]">B3, B3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="text-[11px] text-slate-400 leading-tight border-t border-slate-100 pt-3">
              Official subject grades, core limits, and electives verified automatically.
            </div>
          </div>

          {/* 2. Middle Component: Floating Engine / API Endpoint (4 cols) */}
          <div className="relative lg:col-span-4 flex flex-col items-center">
            
            {/* Dark Terminal Box (Matching Screenshot center card) */}
            <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 p-5 text-white shadow-xl h-[360px] flex flex-col justify-between">
              <div>
                {/* Header bar with macOS dots */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Image
                      src="/logo-mark.png"
                      alt="PassMarkGH"
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      Admission Matcher
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                    <div className="h-2 w-2 rounded-full bg-slate-700" />
                  </div>
                </div>

                {/* Status badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                  <span>POST</span>
                  <span className="text-slate-300">/api/match-all-universities</span>
                </div>

                {/* JSON Data representation */}
                <div className="space-y-1 font-mono text-[11px] text-slate-300">
                  <div>&#123;</div>
                  <div className="pl-4 text-blue-300">
                    &quot;best_6_aggregate&quot;: <span className="text-emerald-400 font-bold">&quot;09&quot;</span>,
                  </div>
                  <div className="pl-4 text-blue-300">
                    &quot;qualification&quot;: <span className="text-amber-300">&quot;Distinction&quot;</span>,
                  </div>
                  <div className="pl-4 text-blue-300">
                    &quot;universities_scanned&quot;: <span className="text-white">10</span>,
                  </div>
                  <div className="pl-4 text-blue-300">
                    &quot;programmes_matched&quot;: <span className="text-emerald-400 font-bold">38</span>
                  </div>
                  <div>&#125;</div>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="rounded-xl bg-slate-800/80 p-2.5 text-[10px] text-slate-300 flex items-center justify-between border border-slate-700/50">
                <span className="text-slate-400">Response time:</span>
                <span className="font-mono text-emerald-400 font-bold">42ms</span>
              </div>
            </div>

            {/* Subtle SVG connector arrow at bottom */}
            <div className="hidden lg:block absolute -bottom-6 left-1/4 pointer-events-none text-emerald-500">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                <path d="M4 4C12 20 28 20 36 6" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />
                <path d="M34 10L36 6L32 6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* 3. Right Component: App Preview (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden h-[360px] flex flex-col justify-between">
            {/* Top dark header */}
            <div className="bg-slate-800 px-4 py-2 text-center text-xs font-bold text-white flex items-center justify-center gap-2">
              <Image
                src="/logo-badge.png"
                alt="PassMarkGH"
                width={16}
                height={16}
                className="h-4 w-4 rounded-xs object-contain"
              />
              <span>App Preview</span>
            </div>

            {/* Profile & Matches Body */}
            <div className="p-4 space-y-3 flex-1">
              {/* User Avatar Card */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-brand-blue flex items-center justify-center font-bold text-white text-xs">
                    KM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Kwame Mensah</div>
                    <div className="text-[10px] text-slate-500">Aggregate 09 • Science</div>
                  </div>
                </div>
                <span className="text-slate-400 font-bold text-sm">•••</span>
              </div>

              {/* Match Highlights */}
              <div className="space-y-1.5">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-2 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-emerald-800">UG LEGON</div>
                    <div className="text-[11px] font-bold text-slate-900">BSc Computer Science</div>
                  </div>
                  <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Cutoff 12</span>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-2 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-blue-800">KNUST</div>
                    <div className="text-[11px] font-bold text-slate-900">BSc Biomedical Eng.</div>
                  </div>
                  <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">Cutoff 10</span>
                </div>
              </div>
            </div>

            {/* Bottom Stat Card */}
            <div className="p-4 pt-0">
              <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">Total Programmes Matched:</span>
                <span className="font-extrabold text-brand-blue text-sm">38</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
