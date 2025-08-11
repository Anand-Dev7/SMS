-- Supabase SQL for SMS starter
-- Run this in Supabase SQL editor

-- months table
create table if not exists public.months (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  year int not null,
  month int not null,
  salary numeric(12,2) not null default 0,
  planned jsonb default '{}'::jsonb,
  savings_start numeric(12,2) not null default 0,
  created_at timestamptz default now(),
  unique (user_id, year, month)
);

-- expenses table
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  month_id uuid not null references public.months(id) on delete cascade,
  category text not null,
  amount numeric(12,2) not null,
  spent_at timestamptz not null default now(),
  notes text
);

-- view for month totals
create or replace view public.month_totals as
select
  m.id as month_id,
  m.user_id,
  m.year,
  m.month,
  m.salary,
  m.savings_start,
  coalesce(sum(e.amount),0)::numeric(12,2) as total_expenses,
  (m.salary + m.savings_start - coalesce(sum(e.amount),0))::numeric(12,2) as savings_end
from public.months m
left join public.expenses e on e.month_id = m.id
group by m.id, m.user_id, m.year, m.month, m.salary, m.savings_start;

-- enable RLS
alter table public.months enable row level security;
alter table public.expenses enable row level security;

-- policies: allow authenticated users to access own rows
create policy if not exists "months_owner" on public.months
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "expenses_owner" on public.expenses
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
