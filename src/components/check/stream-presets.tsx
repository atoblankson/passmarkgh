"use client";

import React from "react";
import { SHS_STREAM_PRESETS, StreamPreset } from "@/data/subjects";
import { Sparkles } from "lucide-react";

interface StreamPresetsProps {
  activePresetId: string | null;
  onSelectPreset: (preset: StreamPreset) => void;
}

export function StreamPresets({
  activePresetId,
  onSelectPreset,
}: StreamPresetsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Quick Fill by SHS Stream</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          1-click to auto-fill your elective subjects
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SHS_STREAM_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                isActive
                  ? "bg-blue-50 border-brand-blue text-brand-darkBlue shadow-xs ring-1 ring-brand-blue"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="text-sm">{preset.icon}</span>
              <span>{preset.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
