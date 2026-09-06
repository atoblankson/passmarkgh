import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AdminVisitTracker } from "@/components/analytics/admin-visit-tracker";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://passmarkgh.site"),
  title: {
    default: "PassMarkGH — Discover Every University Programme You Qualify For in Ghana",
    template: "%s | PassMarkGH",
  },
  description:
    "Enter your WASSCE or NOVDEC grades and instantly see which universities and degree programmes you qualify for across Ghana (UG, KNUST, UCC, etc.) before buying application forms.",
  keywords: [
    "WASSCE aggregate calculator 2024",
    "Ghana university cutoff points",
    "UG cut off points 2024",
    "KNUST cut off points 2024",
    "UCC cut off points",
    "WASSCE grade checker",
    "Best 6 aggregate calculator Ghana",
    "How to calculate WASSCE aggregate",
    "Ghana university admission checker",
    "PassMarkGH",
  ],
  authors: [{ name: "PassMarkGH Team", url: "https://passmarkgh.site" }],
  creator: "PassMarkGH",
  publisher: "PassMarkGH",
  alternates: {
    canonical: "https://passmarkgh.site",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "PassMarkGH — Discover Every University Programme You Qualify For in Ghana",
    description:
      "Stop wasting money on blind university applications. Enter your WASSCE grades to instantly calculate your official Best 6 aggregate and see all qualifying degree programmes across Ghana.",
    url: "https://passmarkgh.site",
    siteName: "PassMarkGH",
    locale: "en_GH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PassMarkGH — Ghana University Admission Eligibility Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PassMarkGH — Ghana University Admission Eligibility Checker",
    description:
      "Stop wasting money on blind university applications. Check your exact eligibility across all Ghanaian universities.",
    images: ["/og-image.png"],
    creator: "@passmarkgh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "rjGHzxvr4j0wbMgL86glnaypVNwofeMI9uNxWEFBmT4",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://passmarkgh.site/#webapp",
      "name": "PassMarkGH",
      "url": "https://passmarkgh.site",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "inLanguage": "en-GH",
      "description":
        "Ghana's #1 WASSCE Admission Eligibility Matcher and Best 6 Aggregate Calculator. Discover every university programme you qualify for across UG, KNUST, UCC, and more.",
      "offers": {
        "@type": "Offer",
        "price": "15.00",
        "priceCurrency": "GHS",
        "availability": "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://passmarkgh.site/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does PassMarkGH calculate my aggregate score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "We follow official WAEC and Ghanaian university admission rules: Best 6 subjects comprising your top 3 Core subjects (English, Core Maths, Integrated Science / Social Studies) plus your top 3 Electives based on standard numeric values (A1=1 to F9=9).",
          },
        },
        {
          "@type": "Question",
          "name": "Where do your university cutoff points come from?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Our database indexes official university admissions brochures, academic boards, and verified historical admissions registers from institutions across Ghana including UG Legon, KNUST, UCC, UDS, UEW, UPSA, and UMaT.",
          },
        },
        {
          "@type": "Question",
          "name": "Does PassMarkGH check all Ghanaian universities at once?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes! PassMarkGH checks your subject profile against all participating public and private Ghanaian universities simultaneously in a single click.",
          },
        },
        {
          "@type": "Question",
          "name": "How much does it cost and what payment methods are accepted?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "A full results unlock is just GH₵15 per check. Payments are processed securely via Paystack, supporting MTN Mobile Money, Telecel Cash, AT Money, and all local debit/credit cards.",
          },
        },
        {
          "@type": "Question",
          "name": "Can both regular school candidates and Nov/Dec private candidates use PassMarkGH?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes! PassMarkGH supports all WASSCE candidates, whether you wrote the school exam (May/June) or private exams (Nov/Dec).",
          },
        },
      ],
    },
    {
      "@type": "HowTo",
      "@id": "https://passmarkgh.site/#howto",
      "name": "How to Find Qualifying Ghanaian University Programmes with Your WASSCE Grades",
      "description":
        "Follow these 3 simple steps to find every university course you qualify for in Ghana without buying rejected application forms.",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Enter your grades",
          "text": "Select your WASSCE subjects and choose your grades from A1 to F9 in under 30 seconds.",
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "We calculate & match",
          "text": "We calculate your official Best 6 aggregate and check cutoff points for every university in Ghana.",
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "See all qualifying courses",
          "text": "Instantly see every degree programme you qualify for across all Ghanaian universities.",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${sora.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-white text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
        <Analytics />
        <AdminVisitTracker />
      </body>
    </html>
  );
}
