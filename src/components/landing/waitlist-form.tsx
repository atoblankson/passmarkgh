"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CheckCircle, Share2, ArrowRight, Flame, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { GHANA_UNIVERSITIES } from "@/data/universities";

export function WaitlistForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    targetUniversity: "UG Legon",
  });

  const universityOptions = useMemo(
    () => [
      ...GHANA_UNIVERSITIES.map((uni) => ({
        value: uni.shortName,
        label: uni.shortName,
        subLabel: `${uni.name} (${uni.location})`,
        logoUrl: uni.logoUrl,
      })),
      {
        value: "Other",
        label: "Other Ghanaian Institution",
        subLabel: "Private, Technical, Nursing or Training College",
      },
    ],
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, examType: "WASSCE" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.[0] || data.message || "Failed to join waitlist");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please check your details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      "🇬🇭 Hey! Check out PassMarkGH — you can enter your WASSCE grades and instantly see every university programme you qualify for in Ghana before buying admission forms! Join the early access here: https://passmarkgh.site"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <section id="waitlist" className="relative py-24 px-4 sm:px-6">
      {/* Background soft glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[450px] w-[650px] rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <Badge className="bg-amber-100 text-amber-900 border-amber-200 mb-4 px-3 py-1 font-semibold">
          <Flame className="mr-1.5 h-3.5 w-3.5 text-amber-600 fill-amber-600" />
          Limited Early Access • Free Launch Perks
        </Badge>
        
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Get Instant Alerts on Results Day
        </h2>
        
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          Be the first to scan your results slip or calculate your aggregate the minute WAEC releases WASSCE results. Save hundreds of cedis on application forms.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl text-left sm:p-8">
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                <Image
                  src="/logo-badge.png"
                  alt="PassMarkGH"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-2xl shadow-sm object-contain"
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                You&apos;re On the Priority List! 🎉
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                We&apos;ve reserved your early access spot. We&apos;ll send an instant WhatsApp/email alert the moment WASSCE results are released.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={handleShareWhatsApp}
                  className="w-full sm:w-auto h-12 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold rounded-xl gap-2 shadow-sm"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share on WhatsApp Status</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsSubmitted(false)}
                  className="w-full sm:w-auto h-12 rounded-xl"
                >
                  Add Another Student
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Kwame Mensah"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="kwame@gmail.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="WhatsApp Phone (For SMS/Alerts)"
                  type="tel"
                  placeholder="024 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <SearchableSelect
                  label="Dream University (Optional)"
                  placeholder="Select or search university..."
                  searchPlaceholder="Search university, acronym or region..."
                  value={formData.targetUniversity}
                  onChange={(val) => setFormData({ ...formData, targetUniversity: val })}
                  options={universityOptions}
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full h-12 sm:h-13 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-xl shadow-md gap-2 mt-2 text-sm sm:text-base transition-all active:scale-[0.99]"
              >
                <BellRing className="h-4 w-4" />
                <span>Notify Me on Results Day</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}
        </div>

        {/* Counter Social Proof */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
          <span className="flex h-2 w-2 rounded-full bg-brand-blue animate-ping" />
          <span>Join <strong>3,400+ WASSCE candidates</strong> already waiting for launch</span>
        </div>
      </div>
    </section>
  );
}
