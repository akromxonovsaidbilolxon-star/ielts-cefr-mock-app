-- ============================================================================
--  Cambridge listening audio — private Supabase Storage bucket
--
--  Run once in Supabase Dashboard → SQL Editor after `setup.sql` has created
--  public.profiles and public.is_owner(). Safe to re-run.
--
--  The bucket is PRIVATE. Signed-in active members may listen; only the owner
--  may upload, replace, or delete recordings. The app creates short-lived
--  signed playback URLs, so audio is not a public bucket or a static asset.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cambridge-audio',
  'cambridge-audio',
  false,
  52428800,
  array['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm']
)
on conflict (id) do update set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Any active account may stream recordings after the app has authenticated it.
drop policy if exists "active members read Cambridge audio" on storage.objects;
create policy "active members read Cambridge audio"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'cambridge-audio'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.status = 'active'
    )
  );

-- Keep all file management owner-only.
drop policy if exists "owner uploads Cambridge audio" on storage.objects;
create policy "owner uploads Cambridge audio"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'cambridge-audio' and public.is_owner());

drop policy if exists "owner updates Cambridge audio" on storage.objects;
create policy "owner updates Cambridge audio"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'cambridge-audio' and public.is_owner())
  with check (bucket_id = 'cambridge-audio' and public.is_owner());

drop policy if exists "owner deletes Cambridge audio" on storage.objects;
create policy "owner deletes Cambridge audio"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'cambridge-audio' and public.is_owner());
