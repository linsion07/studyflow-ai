create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  space_id uuid not null references public.study_spaces (id) on delete cascade,
  filename text not null check (char_length(filename) between 1 and 255),
  storage_path text not null unique,
  status text not null default 'processing' check (status in ('processing', 'completed', 'failed')),
  analysis jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index documents_owner_space_created_at_idx
  on public.documents (user_id, space_id, created_at desc);

alter table public.documents enable row level security;

revoke all on table public.documents from anon, authenticated;
grant select, insert on table public.documents to authenticated;
grant update (status, analysis, error_message, updated_at) on table public.documents to authenticated;

create policy "Users can read documents in their spaces"
  on public.documents for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add documents to their spaces"
  on public.documents for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.study_spaces
      where id = space_id and user_id = (select auth.uid())
    )
  );

create policy "Users can update documents in their spaces"
  on public.documents for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('study-pdfs', 'study-pdfs', false, 6291456, array['application/pdf'])
on conflict (id) do nothing;

create policy "Users can upload PDFs to their own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'study-pdfs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Users can read PDFs in their own folder"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'study-pdfs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
