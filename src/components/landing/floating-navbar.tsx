"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
      <header className="w-full max-w-4xl rounded-2xl border border-slate-200/90 bg-white/95 px-5 py-3 shadow-sm backdrop-blur-md transition-all sm:px-7 hover:shadow-md">
        <div className="flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
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

          {/* Center: Clean Text Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <Link
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors"
            >
              How it works
            </Link>
            <Link
              href="#comparison"
              className="hover:text-slate-900 transition-colors"
            >
              Why we are better
            </Link>
            <Link
              href="#calculator"
              className="hover:text-slate-900 transition-colors"
            >
              Calculator
            </Link>
            <Link
              href="#universities"
              className="hover:text-slate-900 transition-colors"
            >
              Universities
            </Link>
            <Link
              href="#pricing"
              className="hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="hover:text-slate-900 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Right: Action Button */}
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

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="mt-3 border-t border-slate-100 pt-3 pb-1 md:hidden">
            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
              <Link
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                How it works
              </Link>
              <Link
                href="#comparison"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                Why we are better
              </Link>
              <Link
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                Calculator
              </Link>
              <Link
                href="#universities"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                Universities
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                Pricing
              </Link>
              <Link
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                FAQ
              </Link>
              <div className="pt-2">
                <Button asChild size="sm" className="w-full rounded-xl bg-brand-blue">
                  <Link
                    href="#waitlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center"
                  >
                    <span>Get Early Access</span>
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}
