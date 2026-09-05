"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function scrollToHeroInput(e?: React.MouseEvent) {
  if (e) e.preventDefault();
  if (typeof window === "undefined") return;
  const el = document.getElementById("hero-section") || document.getElementById("hero-input");
  if (el) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new CustomEvent("focus-hero-input"));
  } else {
    window.location.href = "/#hero-input";
  }
}

export function HeroActionBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const handleFocusEvent = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        inputRef.current?.focus();
        setIsHighlighted(true);
      }, 150);

      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 2600);
      return () => clearTimeout(timer);
    };

    window.addEventListener("focus-hero-input", handleFocusEvent);

    if (window.location.hash === "#hero-input") {
      setTimeout(handleFocusEvent, 350);
    }

    return () => window.removeEventListener("focus-hero-input", handleFocusEvent);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = contact.trim();

    if (!trimmed) {
      router.push("/check");
      return;
    }

    setLoading(true);

    try {
      const isEmail = trimmed.includes("@");
      const payload: Record<string, unknown> = {
        name: "WASSCE Candidate",
        examType: "WASSCE",
        email: isEmail ? trimmed.toLowerCase() : `student_${trimmed.replace(/\D/g, "") || "user"}@passmarkgh.site`,
      };
      if (!isEmail) payload.phone = trimmed;

      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.warn("Lead capture notice:", err));

      if (typeof window !== "undefined") {
        localStorage.setItem("passmark_user_contact", trimmed);
        if (isEmail) {
          localStorage.setItem("passmark_user_email", trimmed);
        }
      }

      router.push("/check");
    } catch (err) {
      console.error("Navigation error:", err);
      router.push("/check");
    }
  };

  return (
    <div className="mt-8 mx-auto max-w-lg">
      <div
        ref={containerRef}
        id="hero-input"
        className={cn(
          "relative rounded-2xl p-[2px] transition-all duration-500 overflow-hidden",
          isHighlighted
            ? "shadow-[0_0_40px_rgba(37,99,235,0.45)] scale-[1.02]"
            : "bg-slate-200/90 shadow-lg hover:shadow-xl hover:bg-slate-300/90"
        )}
      >
        {/* Running Border Beam Effect */}
        {isHighlighted && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
            <div className="absolute -inset-[200%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_70%,#2563eb_85%,#60a5fa_95%,#ffffff_100%)]" />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col sm:flex-row items-center rounded-[14px] bg-white p-1.5 sm:p-2 gap-2 sm:gap-0 w-full shadow-inner"
        >
          <div className="flex-1 px-3.5 py-2 sm:py-2.5 w-full text-left">
            <input
              ref={inputRef}
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter email here to start check"
              disabled={loading}
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none font-medium"
            />
          </div>
          <Button
            type="submit"
            size="default"
            disabled={loading}
            className="w-full sm:w-auto h-11 sm:h-10.5 rounded-xl bg-brand-blue hover:bg-brand-darkBlue text-white font-bold px-4 sm:px-5 shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] text-xs sm:text-sm shrink-0 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Check My Admission Chances</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>
        </form>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs font-medium text-slate-600">
        <span className="flex items-center gap-1.5 font-normal">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> No sign up required
        </span>
        <span className="text-slate-300 hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5 font-normal">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Covers UG, KNUST, UCC &amp; more
        </span>
      </div>
    </div>
  );
}
