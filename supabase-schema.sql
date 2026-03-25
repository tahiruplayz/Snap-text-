-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Profiles table (premium status)
create table if not exists public.profiles (
  id         uuid references auth.users(id) on delete cascade primary key,
  email      text,
  is_premium boolean default false,
  premium_activated_at timestamptz,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow service role to update (used by admin activation)
create policy "Service role can update profiles"
  on public.profiles for update
  using (true);

create policy "Service role can insert profiles"
  on public.profiles for insert
  with check (true);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

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
