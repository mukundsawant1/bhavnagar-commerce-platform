create table if not exists public.otps (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  consumed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_otps_email on public.otps(email);
create index if not exists idx_otps_email_consumed on public.otps(email, consumed);
