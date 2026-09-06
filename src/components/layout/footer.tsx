import Link from "next/link";
import Image from "next/image";
import { Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Col 1 - Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo-mark.png"
                alt="PassMarkGH Logo"
                width={36}
                height={36}
                className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                PassMark<span className="text-brand-blue">GH</span>
              </span>
            </Link>
            <p className="max-w-md text-sm text-slate-500 leading-relaxed">
              Empowering Ghanaian students to calculate aggregates and discover
              every eligible tertiary programme before spending money on
              application forms.
            </p>
            <p className="text-xs text-slate-400">
              Made with <Heart className="inline h-3.5 w-3.5 text-red-500 fill-red-500" /> for Ghanaian students.
            </p>
          </div>

          {/* Col 2 - Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#how-it-works" className="hover:text-brand-blue transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#universities" className="hover:text-brand-blue transition-colors">
                  Supported Universities
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-brand-blue transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="#calculator" className="hover:text-brand-blue transition-colors">
                  Calculate &amp; Match
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 - Contact & Disclaimer */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Contact Us
              </h4>
              <a
                href="mailto:passmarkgh@gmail.com"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-blue transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-brand-blue shrink-0" />
                <span>passmarkgh@gmail.com</span>
              </a>
            </div>

            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Disclaimer
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                PassMarkGH is an independent guidance platform. Cutoff points and
                admissions policies are determined solely by respective university
                admissions boards.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} PassMarkGH. All rights reserved.</p>
          <p>Built for Ghanaian WASSCE Candidates</p>
        </div>
      </div>
    </footer>
  );
}
