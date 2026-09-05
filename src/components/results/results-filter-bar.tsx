"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface UniversityOption {
  shortName: string;
  count: number;
}

export interface CategoryOption {
  name: string;
  count: number;
}

interface ResultsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedUniversity: string;
  onUniversityChange: (uni: string) => void;
  universities: UniversityOption[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  categories: CategoryOption[];
  statusFilter: "all" | "qualified" | "fee_paying";
  onStatusFilterChange: (status: "all" | "qualified" | "fee_paying") => void;
  counts: {
    all: number;
    qualified: number;
    feePaying: number;
  };
}

export function ResultsFilterBar({
  searchQuery,
  onSearchChange,
  selectedUniversity,
  onUniversityChange,
  selectedCategory,
  onCategoryChange,
  categories,
  universities,
  statusFilter,
  onStatusFilterChange,
  counts,
}: ResultsFilterBarProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search programmes (e.g. Computer Science, Nursing, Law...)"
          className="pl-10 pr-10 h-11 bg-white border-slate-200/90 rounded-2xl text-xs sm:text-sm placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-brand-blue/30 focus-visible:border-brand-blue"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Qualification Status Segment Toggle */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/70 text-xs">
        <button
          type="button"
          onClick={() => onStatusFilterChange("all")}
          className={`flex-1 py-2 rounded-xl transition-all font-medium text-center cursor-pointer ${
            statusFilter === "all"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900 font-normal"
          }`}
        >
          <span>All Results</span>
          <span className="ml-1 text-[11px] text-slate-400 font-normal">
            ({counts.all})
          </span>
        </button>

        <button
          type="button"
          onClick={() => onStatusFilterChange("qualified")}
          className={`flex-1 py-2 rounded-xl transition-all font-medium text-center cursor-pointer ${
            statusFilter === "qualified"
              ? "bg-white text-emerald-700 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900 font-normal"
          }`}
        >
          <span>Qualified</span>
          <span className="ml-1 text-[11px] text-emerald-600 font-normal">
            ({counts.qualified})
          </span>
        </button>

        {counts.feePaying > 0 && (
          <button
            type="button"
            onClick={() => onStatusFilterChange("fee_paying")}
            className={`flex-1 py-2 rounded-xl transition-all font-medium text-center cursor-pointer ${
              statusFilter === "fee_paying"
                ? "bg-white text-amber-700 shadow-2xs font-bold"
                : "text-slate-600 hover:text-slate-900 font-normal"
            }`}
          >
            <span>Fee-Paying</span>
            <span className="ml-1 text-[11px] text-amber-600 font-normal">
              ({counts.feePaying})
            </span>
          </button>
        )}
      </div>

      {/* University Horizontal Scrollable Pills */}
      <div className="space-y-1.5">
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => onUniversityChange("all")}
            className={`h-8 px-3.5 rounded-full text-xs shrink-0 transition-all border cursor-pointer select-none flex items-center gap-1 ${
              selectedUniversity === "all"
                ? "bg-brand-blue text-white border-brand-blue font-medium shadow-2xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-normal"
            }`}
          >
            <span>All Universities</span>
          </button>

          {universities.map((uni) => {
            const isSelected = selectedUniversity === uni.shortName;
            return (
              <button
                key={uni.shortName}
                type="button"
                onClick={() => onUniversityChange(uni.shortName)}
                className={`h-8 px-3.5 rounded-full text-xs shrink-0 transition-all border cursor-pointer select-none flex items-center gap-1 ${
                  isSelected
                    ? "bg-brand-blue text-white border-brand-blue font-medium shadow-2xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 font-normal"
                }`}
              >
                <span>{uni.shortName}</span>
                <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                  ({uni.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div
          className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`h-7 px-3 rounded-xl text-[11px] shrink-0 transition-all border cursor-pointer select-none flex items-center gap-1 ${
              selectedCategory === "all"
                ? "bg-slate-800 text-white border-slate-800 font-medium"
                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-normal"
            }`}
          >
            <span>All Fields</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => onCategoryChange(cat.name)}
                className={`h-7 px-3 rounded-xl text-[11px] shrink-0 transition-all border cursor-pointer select-none flex items-center gap-1 ${
                  isSelected
                    ? "bg-slate-800 text-white border-slate-800 font-medium"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 font-normal"
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[9px] ${isSelected ? "text-slate-300" : "text-slate-400"}`}>
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
