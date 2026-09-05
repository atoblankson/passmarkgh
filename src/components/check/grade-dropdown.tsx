"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface GradeDropdownProps<T extends string> {
  value?: T | "" | null;
  onChange: (value: T) => void;
  options: T[];
  placeholder?: string;
  className?: string;
  minWidth?: string;
}

export function GradeDropdown<T extends string>({
  value,
  onChange,
  options,
  placeholder = "Grade",
  className = "",
  minWidth = "min-w-[92px]",
}: GradeDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  const isSelected = Boolean(value && value !== "");

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-sm font-normal rounded-xl px-3 py-2 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-brand-blue/30 active:scale-[0.97] ${
          isSelected ? "text-slate-800" : "text-slate-400"
        } ${minWidth}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex-1 text-center font-normal truncate">
          {isSelected ? value : placeholder}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-brand-blue" : "rotate-0"
          }`}
        />
      </button>

      {/* Floating Popover Options Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 w-24 max-h-60 overflow-y-auto bg-white rounded-2xl border border-slate-100 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 custom-scrollbar"
          role="listbox"
        >
          {options.map((option) => {
            const isOptionSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isOptionSelected}
                onClick={() => handleSelect(option)}
                className={`w-full text-center py-2 text-sm rounded-xl transition-all cursor-pointer select-none block ${
                  isOptionSelected
                    ? "bg-slate-100 font-semibold text-slate-900"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-normal"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
