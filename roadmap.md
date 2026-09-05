# PassMarkGH — Project Roadmap

> **Mission:** Help every Ghanaian WASSCE/BECE student discover every university programme they qualify for — before wasting money on blind applications.

---

## Table of Contents

1. [Tech Stack & Architecture](#1-tech-stack--architecture)
2. [Phase 0 — Project Scaffolding & Brand Foundation](#phase-0--project-scaffolding--brand-foundation)
3. [Phase 1 — Waitlist Landing Page (MVP-0)](#phase-1--waitlist-landing-page-mvp-0)
4. [Phase 2 — Data Layer & Grade Engine](#phase-2--data-layer--grade-engine)
5. [Phase 3 — Core Product (MVP-1)](#phase-3--core-product-mvp-1)
6. [Phase 4 — Payments & Paywall](#phase-4--payments--paywall)
7. [Phase 5 — User Accounts & History](#phase-5--user-accounts--history)
8. [Phase 6 — Polish, SEO & Analytics](#phase-6--polish-seo--analytics)
9. [Phase 7 — Go-to-Market & Launch](#phase-7--go-to-market--launch)
10. [Phase 8 — Post-Launch & Future Features](#phase-8--post-launch--future-features)
11. [Data Requirements](#data-requirements)
12. [Risk Register](#risk-register)

---

## 1. Tech Stack & Architecture

| Layer | Technology |
| ------------ | ------------------------------------------- |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Font | Sora (Google Fonts) |
| Backend/DB | Supabase (PostgreSQL, Auth, Edge Functions) |
| Payments | Paystack (GHS — Ghana Cedis) |
| Deployment | Vercel |
| Domain | passmarkgh.site |
| Analytics | Vercel Analytics + PostHog (free tier) |
| Email/SMS | Brevo (free tier) or Arkesel (Ghana SMS) |

### High-Level Architecture

```
┌──────────────────────────────────────────────────┐
│                   Vercel (CDN)                   │
│  ┌────────────────────────────────────────────┐  │
│  │         Next.js 14 (App Router)            │  │
│  │  ┌──────────┐  ┌───────────┐  ┌────────┐  │  │
│  │  │  Pages   │  │    API    │  │ Server │  │  │
│  │  │ (React)  │  │  Routes   │  │Actions │  │  │
│  │  └──────────┘  └─────┬─────┘  └───┬────┘  │  │
│  └───────────────────────┼────────────┼───────┘  │
└──────────────────────────┼────────────┼──────────┘
                           │            │
              ┌────────────▼────────────▼──────────┐
              │          Supabase                   │
              │  ┌──────────┐  ┌────────────────┐  │
              │  │ Postgres │  │  Auth (magic    │  │
              │  │   (DB)   │  │  link / OTP)   │  │
              │  └──────────┘  └────────────────┘  │
              │  ┌──────────┐  ┌────────────────┐  │
              │  │  Edge    │  │    Storage      │  │
              │  │Functions │  │  (result slips) │  │
              │  └──────────┘  └────────────────┘  │
              └────────────────────────────────────┘
                           │
              ┌────────────▼───────────────────────┐
              │        Paystack (Payments)          │
              │   Inline Popup → Webhook → DB      │
              └────────────────────────────────────┘
```

---

## Phase 0 — Project Scaffolding & Brand Foundation

> **Goal:** Set up the codebase, tooling, and design tokens so every future phase builds on a solid base.

### Tasks

- [x] **P0.1** — Initialize Next.js 14 project with TypeScript
  ```bash
  npx create-next-app@14 passmarkgh --typescript --tailwind --eslint --app --src-dir
  ```
- [x] **P0.2** — Configure Tailwind with brand design tokens
  - Primary blue `#3B82F6`, dark blue `#2563EB`
  - Black `#000000`, white `#FFFFFF`
  - Light grey `#F1F5F9`, muted text `#64748B`, border `#E2E8F0`
  - Font: `Sora` via `next/font/google`
- [x] **P0.3** — Set up folder structure
- [x] **P0.4** — Add logo assets and visual branding
- [x] **P0.5** — Configure ESLint + Prettier + TypeScript strict types
- [x] **P0.6** — Set up Supabase project helpers + `.env.example`
- [x] **P0.7** — Create shared UI primitives: `Button`, `Input`, `Card`, `Badge`, `Modal`, `Select`, `Accordion`
- [x] **P0.8** — Build responsive `Navbar` + `Footer` + `FloatingNavbar` components
- [x] **P0.9** — Add `<meta>` / Open Graph tags template for SEO

### Deliverable
A clean, runnable Next.js app with brand styling, shared components, and Supabase connected — ready to build pages on.

---

## Phase 1 — Waitlist Landing Page (MVP-0)

> **Goal:** Ship a public landing page that collects emails/phone numbers for launch-day marketing blasts.

### Pages & Components

| Route | Purpose |
| ----- | ------- |
| `/` | Marketing landing page |

### Landing Page Sections

- [x] **P1.1** — **Hero Section**
  - Headline: *"Know every university you qualify for before buying a single form"*
  - Subheadline: *"Stop wasting ₵150+ on blind applications. Enter your WASSCE or BECE grades to instantly calculate your official WAEC aggregate and match with every eligible programme across all Ghanaian universities."*
  - Floating pill navigation bar & inline hero quick CTA input bar
  - High-fidelity 3-panel visual product flow mockup (Grades Slip -> Matcher Engine -> Instant Matches)
- [x] **P1.2** — **Problem & Cost Section**
  - "The Blind Application Trap" (₵600+ wasted on rejected forms vs ₵20 with PassMarkGH)
  - Stats: "300,000+ candidates, 10+ universities, 400+ programmes, ₵580+ savings"
- [x] **P1.3** — **How It Works & Live Interactive Teaser**
  - Real-time interactive WASSCE aggregate calculator teaser widget right on the landing page
- [x] **P1.4** — **Universities Grid & Social Proof**
  - UG Legon, KNUST, UCC, UDS, UEW, UPSA, UMaT, UHAS, GIMPA, Ashesi
- [x] **P1.5** — **Waitlist Form & WhatsApp Viral Referral**
  - Fields: Name, Email, Phone, Exam Type (WASSCE / BECE), Dream University
  - Instant WhatsApp status sharing trigger for viral campus loops
- [x] **P1.6** — **FAQ Accordion**
  - Official WAEC grading logic, cutoff sources, multi-university scanning, pricing, BECE support
- [x] **P1.7** — **Footer & Legal Disclaimers**

### Technical Tasks

- [x] **P1.8** — Database schema for `waitlist` table prepared
- [x] **P1.9** — Server action / API route: `POST /api/waitlist`
- [x] **P1.10** — Input validation (Zod schema)
- [x] **P1.11** — Mobile responsive testing across all breakpoints
- [ ] **P1.12** — Deploy to Vercel, connect domain `passmarkgh.site`

### Deliverable
A live, beautiful landing page at `passmarkgh.site` that collects waitlist signups into Supabase.

---

## Phase 2 — Data Layer & Grade Engine

> **Goal:** Build the database schema, seed it with programme data, and implement the aggregate calculation engine. This is the **brain** of the product.

### 2A — Database Schema

- [x] **P2.1** — Design and create core tables (`universities`, `programmes`, `programme_requirements`, `subjects`)
- [x] **P2.2** — Create Supabase RLS (Row Level Security) policies

### 2B — Aggregate Calculator

- [x] **P2.3** — Implement WAEC grading scale (A1=1, B2=2, ..., F9=9, best 6 core + electives)
- [x] **P2.4** — Create `src/lib/grading/calculator.ts` with second-sitting combine & gender affirmative action
- [x] **P2.5** — Create `src/lib/grading/matcher.ts` with prerequisite and cutoff matching
- [x] **P2.6** — Unit test calculator + matcher algorithms
- [x] **P2.7** — Seed data with 140+ official degree programmes across top Ghanaian universities

### 2C — Data Collection Plan

- [x] **P2.8** — Collect cutoff points and requirements for priority universities (UG, KNUST, UCC, UDS, UEW, Ashesi, UPSA, UMaT, GCTU)

### Deliverable
A working grade calculator, programme matcher, and seeded database for Ghanaian universities with 140+ programmes.

---

## Phase 3 — Core Product (MVP-1)

> **Goal:** Build the main user-facing product — enter grades, see results.

### Pages & Components

| Route | Purpose |
| ----- | ------- |
| `/check` | Grade entry form |
| `/results` | Results page (free 2 preview cards, remaining locked/blurred behind GH₵15 paywall) |

### 3A — Grade Entry Page (`/check`)

- [x] **P3.1** — Exam type selector (WASSCE / BECE toggle)
- [x] **P3.2** — Subject picker (Core subjects auto-filled + searchable Electives grouped by stream)
- [x] **P3.3** — Grade selector per subject (A1–F9 dropdown and pill selector)
- [x] **P3.4** — Real-time aggregate display & sidebar breakdown
- [x] **P3.5** — "Check My Results" CTA button
- [x] **P3.6** — Client-side validation with error messages
- [x] **P3.7** — Mobile-first responsive layout

### 3B — Results Page (`/results`)

- [x] **P3.8** — Results summary card: Aggregate score, Core/Elective breakdown, total qualified, total institutions
- [x] **P3.9** — Programme cards (list view): University crest logo, programme name, cutoff vs student score, prerequisite chips, status badge
- [x] **P3.10** — Filters bar for unlocked users: University selector, category filter, qualified status filter
- [x] **P3.11** — Search & sorting: Full keyword search across universities and programmes
- [x] **P3.12** — **Paywall gate:** 2 free preview cards shown, remaining locked/blurred with GH₵15 Paystack unlock CTA
- [x] **P3.13** — Empty state: "No matching programmes found" with filter reset action
- [x] **P3.14** — PDF export / print dossier for paid users

### Deliverable
A working end-to-end flow: enter grades → see aggregate → see matching programmes (2 free preview cards, rest locked).

---

## Phase 4 — Payments & Paywall

> **Goal:** Integrate Paystack to collect GH₵15 per result unlock.

### Tasks

- [x] **P4.1** — Set up Paystack account (GHS currency)
- [x] **P4.2** — Install Paystack SDK / integration utilities
- [x] **P4.3** — Create payment flow:
  1. User clicks "Unlock All Results"
  2. Collect email (or use stored email)
  3. Initialize Paystack checkout (`amount: 1500` pesewas = GH₵15)
  4. On success → unlock results & verify server-side
  5. On failure → show retry
- [x] **P4.4** — Create `payments` table schema & SQL migration
- [x] **P4.5** — Create `checks` table schema & SQL migration
- [x] **P4.6** — Paystack webhook handler: `POST /api/webhooks/paystack` (HMAC SHA512 signature verification)
- [x] **P4.7** — Result unlock logic (localStorage fallback + database persistence)
- [x] **P4.8** — Payment confirmation / success banner on results page
- [x] **P4.9** — Test with Paystack initialization & verification endpoints

### Deliverable
Working payment flow: user pays GH₵15 via Paystack → full results unlocked.

---

## Phase 5 — User Accounts & History

> **Goal:** Optional user accounts so students can save and revisit their results.

### Tasks

- [ ] **P5.1** — Supabase Auth setup (magic link via email or phone OTP)
- [ ] **P5.2** — Auth pages: `/login`, `/signup`
- [ ] **P5.3** — Auth context provider + middleware for protected routes
- [ ] **P5.4** — Dashboard page (`/dashboard`):
  - Past checks with dates
  - Click to re-view paid results
  - Account settings
- [ ] **P5.5** — Link payments and checks to user accounts (optional — guest checkout still works)
- [ ] **P5.6** — "Save My Results" prompt after payment (encourages signup)

### Deliverable
Students can create accounts, view history, and revisit paid results without re-paying.

---

## Phase 6 — Polish, SEO & Analytics

> **Goal:** Production-grade quality, discoverability, and data-driven insights.

### Performance & Polish

- [ ] **P6.1** — Lighthouse audit: target 90+ on all metrics
- [ ] **P6.2** — Image optimization (next/image, WebP, lazy loading)
- [ ] **P6.3** — Loading skeletons for all data-dependent components
- [ ] **P6.4** — Error boundaries + user-friendly error pages (404, 500)
- [ ] **P6.5** — Toast notifications for all user actions
- [ ] **P6.6** — Accessibility audit (ARIA labels, keyboard nav, contrast)

### SEO

- [x] **P6.7** — Dynamic meta tags per page (titles, descriptions, OpenGraph, Twitter cards)
- [ ] **P6.8** — Blog/content pages: `/blog/how-to-calculate-wassce-aggregate`
- [x] **P6.9** — Sitemap.xml (`src/app/sitemap.ts`) + robots.txt (`src/app/robots.ts`)
- [x] **P6.10** — Structured data (JSON-LD) for WebApplication, FAQPage, and HowTo
- [x] **P6.11** — Open Graph images, favicons, apple touch icons & web manifest

### Analytics

- [ ] **P6.12** — Vercel Analytics (Web Vitals)
- [ ] **P6.13** — PostHog or Mixpanel (free tier):
  - Track: page views, form starts, form completions, payment initiations, payment successes, result views
  - Funnel: Landing → Check → Results → Pay → Unlock
- [ ] **P6.14** — Supabase dashboard for waitlist + payment metrics

### Deliverable
A fast, accessible, SEO-optimized product with full funnel analytics.

---

## Phase 7 — Go-to-Market & Launch

> **Goal:** Coordinated launch timed to WASSCE results release (October/November).

### Pre-Launch (2–4 weeks before results)

- [ ] **P7.1** — Finalize all programme data for current academic year
- [ ] **P7.2** — SMS blast to waitlist: "Results are coming. Check your eligibility first."
- [ ] **P7.3** — Campus influencer kits: shareable graphics, referral links
- [ ] **P7.4** — TikTok/Instagram Reels: "I checked all universities in 30 seconds"
- [ ] **P7.5** — WhatsApp status templates for influencers

### Launch Day (Results Release)

- [ ] **P7.6** — SMS blast: "WASSCE results are out! Check which universities you qualify for → passmarkgh.site"
- [ ] **P7.7** — Social media blitz across all platforms
- [ ] **P7.8** — Monitor server load, scale Vercel if needed
- [ ] **P7.9** — Live customer support (WhatsApp Business)

### Post-Launch

- [ ] **P7.10** — Collect user testimonials
- [ ] **P7.11** — Iterate based on analytics + feedback
- [ ] **P7.12** — BECE launch prep (July cycle)

---

## Phase 8 — Post-Launch & Future Features

> **Goal:** Expand the product moat and increase revenue per user.

| Feature | Priority | Description |
| ------- | -------- | ----------- |
| AI Result Slip Upload | 🔴 High | OCR scan of WASSCE result slip → auto-fill grades (no manual entry) |
| Programme Comparison | 🟡 Medium | Side-by-side comparison of 2–3 programmes |
| Application Tracker | 🟡 Medium | Track which universities student has applied to |
| Scholarship Matcher | 🟡 Medium | Match students to available scholarships |
| Parent/Guardian Mode | 🟢 Low | Simplified view for parents checking for their children |
| BECE Full Support | 🔴 High | Full SHS programme matching for BECE students |
| SMS Results Delivery | 🟡 Medium | Send results via SMS for students without data |
| Bulk School Checks | 🟢 Low | Schools pay to check for all their students |
| Admission Probability | 🟡 Medium | ML model predicting admission likelihood based on historical data |
| University Partnerships | 🟢 Low | Universities pay for featured placement |

---

## Data Requirements

> **⚠️ CRITICAL: The database is the product.** Without accurate, comprehensive cutoff data, the product has zero value. Data collection and verification should be treated as a continuous, high-priority workstream.

### Data Sources
1. **Official university admission brochures** (PDF) — primary source
2. **University websites** — admission pages
3. **WAEC official grading documentation**
4. **Previous year cutoff compilations** (educational forums, guidebooks)
5. **Direct contact with university admissions offices**

### Data Entry Priority
| Priority | Universities | Est. Programmes |
| -------- | ------------ | --------------- |
| P0 | UG, KNUST, UCC | ~300 |
| P1 | UDS, UEW, UPSA, GIMPA | ~200 |
| P2 | Ashesi, UMaT, UHAS, UER | ~100 |
| P3 | All remaining public universities | ~200 |
| P4 | Private universities (top 10) | ~150 |

### Annual Update Cycle
- **August–September:** Collect new cutoff data from university brochures
- **October:** Verify and publish before WASSCE results
- **June:** Update BECE cutoffs before BECE results

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
| ---- | ------ | ---------- | ---------- |
| Inaccurate cutoff data | 🔴 Critical | Medium | Multiple data sources, manual verification, disclaimers |
| Low payment conversion | 🟡 High | Medium | Optimize teaser (show 3 free), A/B test pricing |
| Server overload on results day | 🟡 High | Medium | Vercel auto-scaling, static generation where possible |
| Paystack integration issues | 🟡 High | Low | Test extensively, have manual fallback |
| Competitors copy features | 🟢 Medium | High | Move fast, build brand, focus on data quality |
| Legal/regulatory issues | 🟡 High | Low | Add disclaimers, don't claim "official" status |
| Low waitlist signups | 🟢 Medium | Medium | Campus influencers, social media, SMS blasts |

---

## Build Sequence Summary

```
Phase 0  ██░░░░░░░░░░  Scaffolding & Brand
Phase 1  ████░░░░░░░░  Waitlist Landing Page
Phase 2  ██████░░░░░░  Data Layer & Grade Engine
Phase 3  ████████░░░░  Core Product (MVP-1)
Phase 4  ██████████░░  Payments & Paywall
Phase 5  ███████████░  User Accounts
Phase 6  ████████████  Polish & Launch Prep
Phase 7  ▶▶▶▶▶▶▶▶▶▶  LAUNCH (Results Day)
Phase 8  ∞            Iterate Forever
```

---

## Team Workflow

| Role | Owner | Responsibilities |
| ---- | ----- | ---------------- |
| CEO / Product | Arch Angel | Decisions, design direction, data collection, marketing |
| Frontend UI | Antigravity/Gemini | Pages, components, responsive design, Tailwind |
| Backend / API | Claude Code | Database, API routes, Supabase, Paystack integration |
| Strategy / Planning | Claude | Architecture, prompts, logic, documentation |

### Handoff Protocol
1. **Plan** → Claude drafts spec + architecture
2. **Build** → Antigravity builds UI, Claude Code builds backend
3. **Review** → Arch Angel reviews and approves
4. **Ship** → Deploy to Vercel

---

*Last updated: August 31, 2026*
*Version: 1.0*
