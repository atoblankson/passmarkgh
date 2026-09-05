"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const navLinks = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Why we are better", href: "#comparison" },
    { label: "Calculator", href: "#calculator" },
    { label: "Universities", href: "#universities" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      {/* Soft Mobile Backdrop Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/25 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed top-5 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
        <header
          ref={menuRef}
          className={cn(
            "w-full max-w-4xl rounded-2xl sm:rounded-3xl border bg-white/95 px-4 sm:px-6 py-2.5 sm:py-3 shadow-lg backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            mobileMenuOpen
              ? "border-blue-200/90 shadow-2xl ring-2 ring-blue-100/60"
              : "border-slate-200/90 hover:shadow-xl"
          )}
        >
          <div className="flex items-center justify-between">
            
            {/* Left: Brand Logo */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group select-none"
            >
              <Image
                src="/logo-mark.png"
                alt="PassMarkGH Logo"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                PassMark<span className="text-brand-blue">GH</span>
              </span>
            </Link>

            {/* Center: Clean Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-semibold text-slate-600">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-slate-900 transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Desktop Action Button */}
            <div className="hidden md:flex items-center">
              <Button
                asChild
                size="sm"
                className="rounded-xl bg-brand-blue hover:bg-brand-darkBlue px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
              >
                <Link href="#waitlist">
                  <span>Get Early Access</span>
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle with Smooth Rotation */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-200 md:hidden active:scale-90",
                mobileMenuOpen
                  ? "border-blue-200 bg-blue-50 text-brand-blue shadow-xs"
                  : "border-slate-200/90 text-slate-700 hover:bg-slate-50"
              )}
              aria-label="Toggle Navigation"
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative h-4 w-4">
                <Menu
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-200",
                    mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                  )}
                />
                <X
                  className={cn(
                    "absolute inset-0 h-4 w-4 transition-all duration-200",
                    mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"
                  )}
                />
              </div>
            </button>
          </div>

          {/* Smooth Accordion-based Mobile Drawer */}
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden",
              mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
            )}
          >
            <div className="overflow-hidden">
              <nav className="mt-3.5 border-t border-slate-100/90 pt-3 pb-1 flex flex-col space-y-1 text-sm font-semibold text-slate-800">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-slate-800 transition-all hover:bg-blue-50/70 hover:text-brand-blue active:bg-blue-100/70 active:scale-[0.99]"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-blue" />
                  </Link>
                ))}

                {/* Mobile CTA Button */}
                <div className="pt-2.5 pb-1">
                  <Button
                    asChild
                    size="default"
                    className="w-full h-11 rounded-xl bg-brand-blue hover:bg-brand-darkBlue font-bold text-white shadow-md transition-all active:scale-[0.99]"
                  >
                    <Link
                      href="#waitlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2"
                    >
                      <span>Get Early Access</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
