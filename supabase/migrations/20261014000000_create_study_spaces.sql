create table public.study_spaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 80),
  created_at timestamptz not null default now()
);

create index study_spaces_user_id_created_at_idx
  on public.study_spaces (user_id, created_at desc);

alter table public.study_spaces enable row level security;

revoke all on table public.study_spaces from anon, authenticated;
grant select, insert on table public.study_spaces to authenticated;

create policy "Users can view their own study spaces"
  on public.study_spaces for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own study spaces"
  on public.study_spaces for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
