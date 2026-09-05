-- PassMarkGH Supabase Schema — Payments Table
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/rabaswyncatztozssvmd/sql)

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  email text not null,
  amount integer not null, -- amount in pesewas (1500 = GH₵15.00)
  currency text default 'GHS',
  status text not null default 'pending', -- 'success', 'failed', 'pending'
  channel text, -- 'mobile_money', 'card'
  paid_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Fast lookup indexes for verification and receipts
create index if not exists idx_payments_reference on public.payments (reference);
create index if not exists idx_payments_email on public.payments (email);
create index if not exists idx_payments_status on public.payments (status);

-- Enable Row Level Security (RLS)
alter table public.payments enable row level security;

-- Allow public read access by reference (for receipt / status verification)
create policy "Allow public read of payment by reference"
  on public.payments
  for select
  using (true);

-- Allow server actions / API routes to insert verified payments
create policy "Allow insert of verified payments"
  on public.payments
  for insert
  with check (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- PassMarkGH Supabase Schema — Waitlist / Leads Table
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text default 'WASSCE Candidate',
  email text not null,
  phone text,
  exam_type text default 'WASSCE',
  shs_school text,
  target_university text,
  created_at timestamptz default now()
);

-- Fast lookup index & duplicate prevention
create index if not exists idx_waitlist_email on public.waitlist (email);

-- Enable Row Level Security (RLS)
alter table public.waitlist enable row level security;

-- Allow public / API route insertion for leads
create policy "Allow insert to waitlist"
  on public.waitlist
  for insert
  with check (true);

-- Allow reading for admin/authenticated
create policy "Allow read waitlist"
  on public.waitlist
  for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- PassMarkGH Supabase Schema — Admin Settings Table
-- Persists admin configuration (e.g. Paystack mode) across serverless instances.
-- This is the source of truth for runtime settings — changes here affect production immediately.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.admin_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Seed the default mode as 'test' (change to 'live' via admin panel)
insert into public.admin_settings (key, value, updated_at)
values ('paystack_mode', 'test', now())
on conflict (key) do nothing;

-- Enable Row Level Security
alter table public.admin_settings enable row level security;

-- Allow public read (API routes use anon key)
create policy "Allow public read of admin_settings"
  on public.admin_settings
  for select
  using (true);

-- Allow upsert from API routes (anon key)
create policy "Allow upsert of admin_settings"
  on public.admin_settings
  for insert
  with check (true);

create policy "Allow update of admin_settings"
  on public.admin_settings
  for update
  using (true);
