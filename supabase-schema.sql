-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Scans table
create table if not exists public.scans (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  image_name       text,
  language         text default 'eng',
  raw_text         text,
  cleaned_text     text,
  notes            text,
  translated_text  text,
  translation_lang text,
  created_at       timestamptz default now()
);

-- Row Level Security: users can only see/edit their own scans
alter table public.scans enable row level security;

create policy "Users can view own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own scans"
  on public.scans for delete
  using (auth.uid() = user_id);
