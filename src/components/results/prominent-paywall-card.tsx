"use client";

import React, { useState, useEffect } from "react";
import { Lock, CheckCircle2, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProminentPaywallCardProps {
  aggregate: number;
  totalMatches: number;
  totalInstitutions: number;
  resultSignature?: string;
  checkId?: string;
  onUnlocked?: () => void;
}

export function ProminentPaywallCard({
  aggregate,
  totalMatches,
  totalInstitutions,
  resultSignature,
  checkId,
}: ProminentPaywallCardProps) {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore email if previously saved
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved =
        localStorage.getItem("passmark_user_email") ||
        localStorage.getItem("passmark_user_contact");
      if (saved && saved.includes("@")) {
        setEmail(saved);
      }
    }
  }, []);

  const handlePaystackPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address for receipt and verification.");
      return;
    }

    setIsProcessing(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("passmark_user_email", trimmedEmail);
      }

      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmedEmail,
          amountInCedis: 15,
          metadata: {
            aggregate,
            totalMatches,
            resultSignature,
            checkId,
            source: "prominent_paywall_card",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.status || !data.data?.authorization_url) {
        throw new Error(data.message || "Failed to connect to Paystack payment gateway.");
      }

      // Redirect user to official Paystack Checkout (MoMo & Card)
      window.location.href = data.data.authorization_url;
    } catch (err: unknown) {
      console.error("Paystack init error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Could not connect to payment gateway. Please check your connection or try again.";
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  return (
    <Card className="relative overflow-hidden rounded-3xl border-2 border-blue-200/90 bg-gradient-to-b from-blue-50/60 via-white to-blue-50/80 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
      {/* Decorative subtle ambient accents */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-brand-blue/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

      {/* Top Badge & Lock Icon */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg shadow-blue-500/25 mx-auto ring-4 ring-blue-100">
          <Lock className="h-7 w-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-brand-darkBlue text-[11px] font-bold tracking-wide uppercase">
          <Sparkles className="h-3 w-3 text-brand-blue" />
          <span>Complete Admissions Dossier</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Unlock your full results — GH₵15
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-md mx-auto leading-relaxed">
          You qualify for degree programmes with Aggregate <span className="font-bold text-slate-900">{aggregate}</span>. Unlock all <span className="font-bold text-brand-blue">{totalMatches} matching programmes</span> across <span className="font-bold text-slate-900">{totalInstitutions} universities</span> with official cutoffs and subject requirements.
        </p>
      </div>

      {/* Feature Value Checklist */}
      <div className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-2.5 text-xs text-slate-700">
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>All <strong>{totalMatches} matching programmes</strong> unlocked in full</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Official cutoff aggregates for UG, KNUST, UCC, UPSA, UHAS &amp; more</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Fee-paying cutoffs &amp; parallel admission streams</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Full university search &amp; programme category filtering</span>
        </div>
        <div className="flex items-center gap-2.5 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Downloadable official PDF Admissions Dossier</span>
        </div>
      </div>

      {/* Direct Payment Action Form */}
      <form onSubmit={handlePaystackPayment} className="space-y-4 pt-1">
        <div className="space-y-1.5 text-left">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Email for Receipt &amp; Results Verification
          </label>
          <input
            type="email"
            required
            placeholder="e.g. kwame.mensah@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isProcessing}
            className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100 transition-all shadow-2xs"
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 text-center font-medium">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full h-13 sm:h-14 bg-brand-blue hover:bg-brand-darkBlue text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 text-base gap-2 transition-all active:scale-[0.99] cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Connecting to Paystack...</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>Unlock All {totalMatches} Programmes — GH₵15</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        {/* Security & Payment Methods */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-[11px] text-slate-500 font-medium text-center">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Secured by Paystack</span>
          </div>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span>MTN MoMo, Telecel Cash, AT &amp; Bank Cards</span>
        </div>
      </form>
    </Card>
  );
}
