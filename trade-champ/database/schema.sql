-- Trade Champ Supabase schema
create extension if not exists "uuid-ossp";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists public.mt5_accounts (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  login bigint not null,
  server text not null,
  encrypted_password text not null,
  created_at timestamptz default now()
);

create table if not exists public.strategies (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now(),
  unique (user_id, name)
);

create table if not exists public.trades (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  ticket bigint not null,
  symbol text not null,
  volume numeric(12,2) not null,
  entry_price numeric(16,6) not null,
  exit_price numeric(16,6),
  stop_loss numeric(16,6),
  take_profit numeric(16,6),
  open_time timestamptz not null,
  close_time timestamptz,
  profit numeric(12,2) not null,
  commission numeric(12,2) default 0,
  swap numeric(12,2) default 0,
  trade_duration_minutes integer,
  strategy_tag text,
  notes text,
  screenshot_url text,
  created_at timestamptz default now(),
  unique (user_id, ticket)
);

create table if not exists public.prop_settings (
  id bigserial primary key,
  user_id uuid unique not null references public.users(id) on delete cascade,
  max_daily_loss numeric(12,2) not null,
  max_drawdown numeric(12,2) not null,
  profit_target numeric(12,2) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.mt5_accounts enable row level security;
alter table public.strategies enable row level security;
alter table public.trades enable row level security;
alter table public.prop_settings enable row level security;

create policy "users own row" on public.users
for all using (auth.uid() = id);

create policy "mt5 own rows" on public.mt5_accounts
for all using (auth.uid() = user_id);

create policy "strategies own rows" on public.strategies
for all using (auth.uid() = user_id);

create policy "trades own rows" on public.trades
for all using (auth.uid() = user_id);

create policy "prop settings own rows" on public.prop_settings
for all using (auth.uid() = user_id);

insert into public.strategies(user_id, name)
select id, strategy_name
from public.users
cross join (values ('breakout'), ('scalping'), ('liquidity sweep'), ('trend continuation')) as defaults(strategy_name)
on conflict do nothing;
