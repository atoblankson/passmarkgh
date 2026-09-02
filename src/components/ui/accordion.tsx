"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpenDefault?: boolean;
  className?: string;
}

export function AccordionItem({
  title,
  children,
  isOpenDefault = false,
  className,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(isOpenDefault);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white transition-all overflow-hidden",
        isOpen ? "shadow-sm border-blue-200" : "hover:border-slate-300",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left font-semibold text-slate-900 transition-colors hover:text-brand-blue"
        aria-expanded={isOpen}
      >
        <span className="text-base sm:text-lg">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-brand-blue"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 border-t border-slate-100/60 animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

export function AccordionGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-3", className)}>{children}</div>;
}
