"use client";

import React, { useState } from "react";
import { Lock, CheckCircle2, X, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ResultsPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  aggregate: number;
  totalMatches: number;
  remainingCount?: number;
  resultSignature?: string;
  checkId?: string;
  onUnlocked?: () => void;
}

export function ResultsPaywallModal({
  isOpen,
  onClose,
  aggregate,
  totalMatches,
  remainingCount,
  resultSignature,
  checkId,
  onUnlocked,
}: ResultsPaywallModalProps) {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("passmark_user_email") || localStorage.getItem("passmark_user_contact");
      if (saved && saved.includes("@")) {
        setEmail(saved);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const countToShow = remainingCount !== undefined ? remainingCount : totalMatches;

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address for receipt and verification.");
      return;
    }

    setIsProcessing(true);

    try {
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
            source: "results_modal",
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
      console.error("Payment init error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Could not connect to payment gateway. Please check your network or try again.";
      setErrorMessage(message);
      setIsProcessing(false);
    }
  };

  const handleDone = () => {
    onUnlocked?.();
    setUnlocked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-slate-100 animate-in zoom-in-95 duration-200 space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {!unlocked ? (
          <>
            {/* Header with Icon */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-brand-blue mx-auto mb-1">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Unlock All {countToShow} Programmes — GH₵15
              </h2>
              <p className="text-xs text-slate-500 font-normal max-w-xs mx-auto">
                Get full access for Aggregate {aggregate} across all universities with official cutoffs and prerequisites.
              </p>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-normal">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>All {totalMatches} matched programmes unlocked in full</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-normal">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Fee-paying cutoffs &amp; parallel admission streams</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-normal">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Downloadable official PDF Admissions Dossier</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-normal">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Prerequisite subject verification guarantee</span>
              </div>
            </div>

            {/* Price & Email Action Form */}
            <form onSubmit={handleUnlock} className="space-y-3 pt-1">
              <div className="flex items-baseline justify-center gap-1.5 mb-1">
                <span className="text-3xl font-black text-slate-900">GH₵ 15</span>
                <span className="text-xs text-slate-400 font-normal line-through">GH₵ 50</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">
                  70% OFF
                </span>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Email for Receipt &amp; Verification
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isProcessing}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 font-medium text-center">
                  {errorMessage}
                </p>
              )}

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full h-12 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-xl shadow-md text-sm gap-2 transition-all active:scale-[0.99]"
              >
                <span>{isProcessing ? "Connecting to Paystack..." : `Pay GH₵15 with MoMo / Card`}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Secured by Paystack (MTN MoMo, Telecel, AT &amp; Bank Cards)</span>
              </div>
            </form>
          </>
        ) : (
          /* Success Screen */
          <div className="text-center space-y-4 py-4 animate-in fade-in">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                All Programmes Unlocked!
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-1">
                You now have full access to all {totalMatches} matching programmes across Ghana.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleDone}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-sm text-sm"
            >
              <span>View Full Results</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
