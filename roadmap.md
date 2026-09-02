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

- [ ] **P2.1** — Design and create core tables:

  **`universities`**
  | Column | Type | Description |
  | ------ | ---- | ----------- |
  | id | uuid (PK) | |
  | name | text | e.g. "University of Ghana" |
  | short_name | text | e.g. "UG" |
  | location | text | e.g. "Accra" |
  | logo_url | text | |
  | website | text | |

  **`programmes`**
  | Column | Type | Description |
  | ------ | ---- | ----------- |
  | id | uuid (PK) | |
  | university_id | uuid (FK) | |
  | name | text | e.g. "BSc Computer Science" |
  | faculty | text | e.g. "Faculty of Computing" |
  | duration_years | int | e.g. 4 |
  | campus | text | nullable |

  **`programme_requirements`**
  | Column | Type | Description |
  | ------ | ---- | ----------- |
  | id | uuid (PK) | |
  | programme_id | uuid (FK) | |
  | cutoff_aggregate | int | e.g. 24 |
  | required_subjects | jsonb | e.g. `["Core Maths", "English", "Elective Maths"]` |
  | required_grades | jsonb | Subject-specific min grade, e.g. `{"Core Maths": "C6"}` |
  | elective_group | text | e.g. "Science", "General Arts" |
  | year | int | Academic year the cutoff applies to |
  | notes | text | Any special conditions |

  **`subjects`** (reference table)
  | Column | Type | Description |
  | ------ | ---- | ----------- |
  | id | uuid (PK) | |
  | name | text | e.g. "Core Mathematics" |
  | category | text | `core` or `elective` |
  | exam_type | text | `WASSCE` or `BECE` |

- [ ] **P2.2** — Create Supabase RLS (Row Level Security) policies
  - `universities`, `programmes`, `subjects` → public read
  - `programme_requirements` → public read
  - Admin write access via service role key only

### 2B — Aggregate Calculator

- [ ] **P2.3** — Implement WAEC grading scale:

  **WASSCE Grading:**
  | Grade | Value | Interpretation |
  | ----- | ----- | -------------- |
  | A1 | 1 | Excellent |
  | B2 | 2 | Very Good |
  | B3 | 3 | Good |
  | C4 | 4 | Credit |
  | C5 | 5 | Credit |
  | C6 | 6 | Credit |
  | D7 | 7 | Pass |
  | E8 | 8 | Pass |
  | F9 | 9 | Fail |

  **Aggregate calculation:**
  - Take the **best 6 subjects** (3 core + 3 best electives)
  - Core subjects: English Language, Core Mathematics, Integrated Science / Social Studies
  - Sum the grade values → aggregate score
  - Lower aggregate = better (best possible = 6, worst qualifying ≈ 24–36 depending on university)

- [ ] **P2.4** — Create `src/lib/grading/calculator.ts`:
  ```typescript
  interface SubjectGrade {
    subject: string;
    grade: string; // A1, B2, ..., F9
    category: 'core' | 'elective';
  }

  interface AggregateResult {
    aggregate: number;
    bestSix: SubjectGrade[];
    isValid: boolean;
    errors: string[];
  }

  function calculateAggregate(grades: SubjectGrade[]): AggregateResult
  ```

- [ ] **P2.5** — Create `src/lib/grading/matcher.ts`:
  ```typescript
  interface MatchResult {
    programme: Programme;
    university: University;
    meetsAggregate: boolean;
    meetsSubjects: boolean;
    qualified: boolean;
    matchScore: number; // 0-100 confidence
  }

  function matchProgrammes(
    grades: SubjectGrade[],
    aggregate: number
  ): Promise<MatchResult[]>
  ```

- [ ] **P2.6** — Write unit tests for calculator + matcher
- [ ] **P2.7** — Create seed script for initial data (start with top 5 universities)

### 2C — Data Collection Plan

- [ ] **P2.8** — Collect cutoff points and requirements for priority universities:
  1. University of Ghana (UG)
  2. KNUST
  3. University of Cape Coast (UCC)
  4. University for Development Studies (UDS)
  5. University of Education, Winneba (UEW)
  6. Ashesi University
  7. Ghana Institute of Management and Public Administration (GIMPA)
  8. University of Professional Studies, Accra (UPSA)
  9. University of Mines and Technology (UMaT)
  10. All other public + private universities

> **⚠️ IMPORTANT: Data is the moat.** The accuracy and completeness of cutoff data is the #1 factor for product quality. This data must be sourced from official university admission brochures, verified, and updated annually.

### Deliverable
A working grade calculator, programme matcher, and seeded database for at least 5 universities and 100+ programmes.

---

## Phase 3 — Core Product (MVP-1)

> **Goal:** Build the main user-facing product — enter grades, see results.

### Pages & Components

| Route | Purpose |
| ----- | ------- |
| `/check` | Grade entry form |
| `/results` | Results page (blurred/locked by default) |

### 3A — Grade Entry Page (`/check`)

- [ ] **P3.1** — Exam type selector (WASSCE / BECE toggle)
- [ ] **P3.2** — Subject picker
  - Core subjects auto-filled (English, Core Maths, Int. Science, Social Studies)
  - Elective subject dropdown (searchable, grouped by programme stream)
  - Min 3 electives, max 4
- [ ] **P3.3** — Grade selector per subject (A1–F9 dropdown or pill selector)
- [ ] **P3.4** — Real-time aggregate display (updates as grades are entered)
- [ ] **P3.5** — "Check My Results" CTA button
- [ ] **P3.6** — Client-side validation with error messages
- [ ] **P3.7** — Mobile-first responsive layout (single column on mobile)

### 3B — Results Page (`/results`)

- [ ] **P3.8** — Results summary card:
  - Your aggregate score
  - Total qualifying programmes
  - Total universities matched
- [ ] **P3.9** — Programme cards (list view):
  - University name + logo
  - Programme name
  - Cutoff aggregate vs your aggregate (visual bar)
  - Required subjects (checkmarks for matched)
  - "Qualified" / "Not Qualified" badge
- [ ] **P3.10** — Filters sidebar/drawer:
  - University (multi-select)
  - Region / Location
  - Programme category (Science, Arts, Business, etc.)
  - Show only qualified (toggle)
- [ ] **P3.11** — Sort options: Best match, University name, Programme name, Cutoff
- [ ] **P3.12** — **Paywall gate:**
  - Show first 3 results for free (teaser)
  - Blur remaining results
  - "Unlock All Results — ₵20" CTA
- [ ] **P3.13** — Empty state: "No qualifying programmes found" with suggestions
- [ ] **P3.14** — Share results (generate shareable link or image)

### Deliverable
A working end-to-end flow: enter grades → see aggregate → see matching programmes (first 3 free, rest locked).

---

## Phase 4 — Payments & Paywall

> **Goal:** Integrate Paystack to collect ₵20 per result unlock.

### Tasks

- [ ] **P4.1** — Set up Paystack account (GHS currency)
- [ ] **P4.2** — Install Paystack inline JS SDK
- [ ] **P4.3** — Create payment flow:
  1. User clicks "Unlock All Results"
  2. Collect email (or use stored email)
  3. Initialize Paystack popup (`amount: 2000` — Paystack uses pesewas)
  4. On success → unlock results
  5. On failure → show retry
- [ ] **P4.4** — Create `payments` table:
  ```sql
  create table payments (
    id uuid default gen_random_uuid() primary key,
    email text not null,
    phone text,
    amount int not null, -- in pesewas
    reference text unique not null,
    status text default 'pending', -- pending, success, failed
    paystack_response jsonb,
    check_id uuid, -- links to the specific check/session
    created_at timestamptz default now()
  );
  ```
- [ ] **P4.5** — Create `checks` table (stores each grade check session):
  ```sql
  create table checks (
    id uuid default gen_random_uuid() primary key,
    email text,
    grades jsonb not null,
    aggregate int not null,
    results_count int,
    is_paid boolean default false,
    payment_id uuid references payments(id),
    created_at timestamptz default now()
  );
  ```
- [ ] **P4.6** — Paystack webhook handler: `POST /api/webhooks/paystack`
  - Verify webhook signature
  - Update payment status
  - Mark check as paid
- [ ] **P4.7** — Result unlock logic:
  - On successful payment, store `check_id` as paid
  - Return full results for that check
  - Allow re-access via email + reference
- [ ] **P4.8** — Payment receipt / confirmation screen
- [ ] **P4.9** — Test with Paystack test keys end-to-end

### Deliverable
Working payment flow: user pays ₵20 via Paystack → full results unlocked.

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

- [ ] **P6.7** — Dynamic meta tags per page
- [ ] **P6.8** — Blog/content pages: `/blog/how-to-calculate-wassce-aggregate`
- [ ] **P6.9** — Sitemap.xml + robots.txt
- [ ] **P6.10** — Structured data (JSON-LD) for FAQ and HowTo
- [ ] **P6.11** — Open Graph images (auto-generated or static)

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
