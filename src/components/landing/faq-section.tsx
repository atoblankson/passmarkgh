import React from "react";
import { HelpCircle } from "lucide-react";
import { AccordionItem, AccordionGroup } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function FAQSection() {
  const faqs = [
    {
      question: "How does PassMarkGH calculate my aggregate score?",
      answer:
        "PassMarkGH implements the official WAEC Ghana grading standard: English Language (mandatory), Core Mathematics (mandatory), plus the better of Integrated Science or Social Studies, combined with your 3 best elective subjects (total of 6 subjects). Grade points range from A1 (1) to F9 (9).",
    },
    {
      question: "Where do you get the university cutoff points and requirements?",
      answer:
        "Our cutoff points and subject prerequisite rules are curated directly from official university admission brochures, published faculty guidelines, and verified admission statistics across UG Legon, KNUST, UCC, UDS, UEW, UPSA, and other Ghanaian tertiary institutions.",
    },
    {
      question: "Can I check results for multiple universities at the same time?",
      answer:
        "Yes! Unlike older tools that force you to select one university at a time, PassMarkGH checks your subject profile against all participating Ghanaian universities simultaneously in a single click.",
    },
    {
      question: "How much does it cost and what payment methods are accepted?",
      answer:
        "A full results unlock is just GH₵15 per check. Payments are processed securely via Paystack, supporting MTN Mobile Money, Telecel Cash, AT Money, and all local debit/credit cards.",
    },
    {
      question: "Can both regular school candidates and Nov/Dec private candidates use PassMarkGH?",
      answer:
        "Yes! PassMarkGH supports all WASSCE candidates, whether you wrote the school exam (May/June) or private exams (Nov/Dec).",
    },
    {
      question: "Is the checker live and updated for this academic year?",
      answer:
        "Yes! PassMarkGH is fully live with updated admission cut-off points and entry requirements across all major Ghanaian public and private universities.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-slate-50/60 border-t border-slate-200/80 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-brand-blue border-blue-200 mb-3">
            <HelpCircle className="mr-1 h-3.5 w-3.5" />
            Got Questions?
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Everything you need to know about PassMarkGH, WAEC calculation, and university eligibility in Ghana.
          </p>
        </div>

        <AccordionGroup>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              title={faq.question}
            >
              {faq.answer}
            </AccordionItem>
          ))}
        </AccordionGroup>
      </div>
    </section>
  );
}
