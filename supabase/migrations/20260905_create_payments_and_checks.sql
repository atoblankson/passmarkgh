-- ==============================================================================
-- PassMarkGH — Phase 4: Payments & Checks Schema
-- ==============================================================================

-- 1. Payments Table
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  phone text,
  amount int not null, -- stored in pesewas (e.g. 2000 = GH₵20.00)
  reference text unique not null,
  status text default 'pending', -- 'pending', 'success', 'failed', 'abandoned'
  channel text, -- 'mobile_money', 'card'
  paid_at timestamptz,
  paystack_response jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Index on reference and email for fast lookups
create index if not exists idx_payments_reference on public.payments (reference);
create index if not exists idx_payments_email on public.payments (email);

-- 2. Checks Table (Stores individual student grade-calculation sessions)
create table if not exists public.checks (
  id uuid default gen_random_uuid() primary key,
  email text,
  phone text,
  exam_type text default 'WASSCE',
  grades jsonb not null,
  aggregate int not null,
  results_count int default 0,
  is_paid boolean default false,
  payment_id uuid references public.payments(id) on delete set null,
  created_at timestamptz default now()
);

-- Index on email and payment_id
create index if not exists idx_checks_email on public.checks (email);
create index if not exists idx_checks_payment_id on public.checks (payment_id);

-- 3. Row Level Security (RLS) Policies
alter table public.payments enable row level security;
alter table public.checks enable row level security;

-- Payments: Public can insert/read their own verification records; Service role has full access
create policy "Allow insert payment references"
  on public.payments
  for insert
  with check (true);

create policy "Allow read payment by reference"
  on public.payments
  for select
  using (true);

-- Checks: Public can insert grade checks; Service role has full access
create policy "Allow insert grade checks"
  on public.checks
  for insert
  with check (true);

create policy "Allow read checks by id"
  on public.checks
  for select
  using (true);
