import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://passmarkgh.site"),
  title: "PassMarkGH — Discover Every University Programme You Qualify For in Ghana",
  description:
    "Enter your WASSCE grades and instantly see every university programme you qualify for across all Ghanaian universities before buying expensive admission forms.",
  keywords: [
    "WASSCE aggregate calculator",
    "Ghana university cutoff points",
    "UG cut off points",
    "KNUST cut off points",
    "UCC cutoff points",
    "Ghana admission checker",
    "PassMarkGH",
  ],
  authors: [{ name: "PassMarkGH Team" }],
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
      "Enter your WASSCE grades, calculate aggregate automatically, and match across UG, KNUST, UCC, and all Ghanaian universities.",
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
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${sora.variable}`}>
      <body className="font-sans bg-white text-slate-900 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}

