"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ListOrdered,
  ShieldCheck,
  Calculator,
  GraduationCap,
  CreditCard,
  HelpCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/#how-it-works", label: "How it works", icon: ListOrdered },
  { href: "/#comparison", label: "Why we are better", icon: ShieldCheck },
  { href: "/#calculator", label: "Calculator", icon: Calculator },
  { href: "/#universities", label: "Universities", icon: GraduationCap },
  { href: "/#pricing", label: "Pricing", icon: CreditCard },
  { href: "/#faq", label: "FAQ", icon: HelpCircle },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click & Escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="fixed top-3 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none">
      <header
        ref={navRef}
        className={cn(
          "w-full max-w-4xl rounded-2xl border bg-white/95 px-4 py-2 sm:px-7 sm:py-2.5 backdrop-blur-xl transition-all duration-300 pointer-events-auto",
          mobileMenuOpen
            ? "border-blue-200/80 shadow-xl ring-1 ring-blue-100/60"
            : "border-slate-200/90 shadow-sm hover:shadow-md"
        )}
      >
        <div className="flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <Image
              src="/logo-mark.png"
              alt="PassMarkGH Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              priority
            />
            <span className="text-base font-black tracking-tight text-slate-900">
              PassMark<span className="text-brand-blue">GH</span>
            </span>
          </Link>

          {/* Center: Desktop Text Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-slate-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: Desktop Action Button */}
          <div className="hidden md:flex items-center">
            <Button
              asChild
              size="sm"
              className="rounded-xl bg-brand-blue hover:bg-brand-darkBlue px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Link href="/check">
                <span>Check Eligibility</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle Button with morphing bars */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 md:hidden active:scale-95",
              mobileMenuOpen
                ? "border-blue-200 bg-blue-50 text-brand-blue"
                : "border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100"
            )}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="relative h-4 w-4 flex items-center justify-center">
              <span
                className={cn(
                  "absolute block h-0.5 w-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  mobileMenuOpen
                    ? "bg-brand-blue rotate-45 translate-y-0"
                    : "bg-slate-800 -translate-y-1.5"
                )}
              />
              <span
                className={cn(
                  "absolute block h-0.5 w-4 rounded-full transition-all duration-200 ease-out",
                  mobileMenuOpen
                    ? "opacity-0 scale-x-0"
                    : "bg-slate-800 opacity-100 scale-x-100"
                )}
              />
              <span
                className={cn(
                  "absolute block h-0.5 w-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  mobileMenuOpen
                    ? "bg-brand-blue -rotate-45 translate-y-0"
                    : "bg-slate-800 translate-y-1.5"
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Animated Drawer via CSS Grid */}
        <div
          className={cn(
            "grid md:hidden transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileMenuOpen
              ? "grid-rows-[1fr] opacity-100 mt-3 pt-3 border-t border-slate-100"
              : "grid-rows-[0fr] opacity-0 pointer-events-none"
          )}
        >
          <div className="overflow-hidden">
            <nav className="flex flex-col space-y-1 pb-1">
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:text-brand-blue hover:bg-blue-50/80 active:bg-blue-100/60 active:scale-[0.99] transition-all group"
                    style={{
                      transitionDelay: mobileMenuOpen ? `${idx * 20}ms` : "0ms",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-brand-blue transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand-blue transition-all" />
                  </Link>
                );
              })}

              <div className="pt-3 mt-1 border-t border-slate-100">
                <Button
                  asChild
                  size="default"
                  className="w-full h-11 rounded-xl bg-brand-blue hover:bg-brand-darkBlue font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Link
                    href="/check"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Check Eligibility</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
