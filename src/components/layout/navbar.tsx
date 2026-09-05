"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo-mark.png"
            alt="PassMarkGH Logo"
            width={38}
            height={38}
            className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            PassMark<span className="text-brand-blue">GH</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="/#how-it-works"
            className="transition-colors hover:text-brand-blue"
          >
            How It Works
          </Link>
          <Link
            href="/#universities"
            className="transition-colors hover:text-brand-blue"
          >
            Universities
          </Link>
          <Link
            href="/#faq"
            className="transition-colors hover:text-brand-blue"
          >
            FAQ
          </Link>
        </nav>

        {/* Desktop Action */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild size="default" className="rounded-xl font-semibold shadow-sm bg-brand-blue hover:bg-brand-darkBlue text-white">
            <Link href="/check" className="flex items-center gap-2">
              <span>Check Eligibility</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-6 md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-4 text-base font-medium text-slate-700">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-blue"
            >
              How It Works
            </Link>
            <Link
              href="/#universities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-blue"
            >
              Universities
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-brand-blue"
            >
              FAQ
            </Link>
            <div className="pt-2">
              <Button asChild className="w-full bg-brand-blue hover:bg-brand-darkBlue text-white font-semibold">
                <Link
                  href="/check"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2"
                >
                  <span>Check Eligibility</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
