-- MALguitar initial schema: profiles, songs catalog, user library, practice log.
-- RLS is the security boundary: every table has it enabled.

create extension if not exists citext with schema extensions;

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.song_source as enum ('musicbrainz', 'custom');
create type public.song_status as enum ('want_to_learn', 'learning', 'learned', 'shelved');
create type public.practice_focus as enum ('riff', 'solo', 'rhythm', 'full_song');

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username extensions.citext unique
    check (username is null or username ~ '^[A-Za-z0-9_]{3,24}$'),
  display_name text check (char_length(display_name) <= 60),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Owners may edit only these columns. A table-level UPDATE grant would override
-- a column-level revoke, so re-grant column by column.
revoke update on public.profiles from anon, authenticated;
grant update (username, display_name, avatar_url) on public.profiles to authenticated;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- songs (shared catalog cache)
-- ---------------------------------------------------------------------------
create table public.songs (
  id uuid primary key default gen_random_uuid(),
  mbid uuid unique,
  title text not null check (char_length(title) between 1 and 300),
  artist text not null check (char_length(artist) between 1 and 300),
  album text,
  cover_url text,
  duration_ms integer check (duration_ms is null or duration_ms > 0),
  source public.song_source not null,
  -- Custom songs are private to their creator and are deleted with the account.
  created_by uuid references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  check (
    (source = 'musicbrainz' and mbid is not null and created_by is null)
    or (source = 'custom' and mbid is null and created_by is not null)
  )
);

create index songs_created_by_idx on public.songs (created_by);

-- ---------------------------------------------------------------------------
-- user_songs (one library entry per user per song)
-- ---------------------------------------------------------------------------
create table public.user_songs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  song_id uuid not null references public.songs (id) on delete cascade,
  status public.song_status not null default 'want_to_learn',
  progress smallint not null default 0 check (progress between 0 and 100),
  difficulty smallint check (difficulty between 1 and 5),
  tuning text check (char_length(tuning) <= 40),
  capo smallint check (capo between 0 and 12),
  notes text check (char_length(notes) <= 5000),
  tab_url text,
  video_url text,
  started_at timestamptz,
  learned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, song_id)
);

create index user_songs_user_status_updated_idx
  on public.user_songs (user_id, status, updated_at desc);
create index user_songs_song_id_idx on public.user_songs (song_id);

create function public.user_songs_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
  end if;

  if new.status = 'learned' and new.learned_at is null then
    new.learned_at := now();
  end if;

  if new.status in ('learning', 'learned') and new.started_at is null then
    new.started_at := now();
  end if;

  return new;
end;
$$;

create trigger user_songs_before_write
  before insert or update on public.user_songs
  for each row execute function public.user_songs_before_write();

-- ---------------------------------------------------------------------------
-- practice_sessions
-- ---------------------------------------------------------------------------
create table public.practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  user_song_id uuid not null references public.user_songs (id) on delete cascade,
  practiced_at timestamptz not null default now(),
  duration_min smallint not null check (duration_min between 1 and 1440),
  focus public.practice_focus,
  notes text check (char_length(notes) <= 5000),
  progress_after smallint check (progress_after between 0 and 100),
  created_at timestamptz not null default now()
);

create index practice_sessions_user_practiced_idx
  on public.practice_sessions (user_id, practiced_at desc);
create index practice_sessions_user_song_idx
  on public.practice_sessions (user_song_id, practiced_at desc);

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.user_songs enable row level security;
alter table public.practice_sessions enable row level security;

-- profiles: public read, owner write (rows are created by the signup trigger).
create policy "profiles are publicly readable"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "users update own profile"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- songs: the MusicBrainz catalog is shared; custom songs are private to their creator.
-- Clients can't insert MusicBrainz rows directly; they go through add_musicbrainz_song() below.
create policy "users read catalog and own custom songs"
  on public.songs for select
  to authenticated
  using (source = 'musicbrainz' or created_by = (select auth.uid()));

create policy "users insert own custom songs"
  on public.songs for insert
  to authenticated
  with check (source = 'custom' and created_by = (select auth.uid()) and mbid is null);

create policy "users update own custom songs"
  on public.songs for update
  to authenticated
  using (source = 'custom' and created_by = (select auth.uid()))
  with check (source = 'custom' and created_by = (select auth.uid()) and mbid is null);

create policy "users delete own custom songs"
  on public.songs for delete
  to authenticated
  using (source = 'custom' and created_by = (select auth.uid()));

-- user_songs: owner-only CRUD.
create policy "users read own library"
  on public.user_songs for select
  to authenticated
  using (user_id = (select auth.uid()));

-- The songs subquery is itself filtered by songs RLS, so nobody can add another user's custom song.
create policy "users insert into own library"
  on public.user_songs for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.songs s where s.id = song_id)
  );

create policy "users update own library"
  on public.user_songs for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.songs s where s.id = song_id)
  );

create policy "users delete from own library"
  on public.user_songs for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- practice_sessions: owner-only CRUD, and the session must belong to one of the owner's songs.
create policy "users read own sessions"
  on public.practice_sessions for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "users insert own sessions"
  on public.practice_sessions for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.user_songs us
      where us.id = user_song_id and us.user_id = (select auth.uid())
    )
  );

create policy "users update own sessions"
  on public.practice_sessions for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.user_songs us
      where us.id = user_song_id and us.user_id = (select auth.uid())
    )
  );

create policy "users delete own sessions"
  on public.practice_sessions for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- add_musicbrainz_song: the only client path into the shared catalog
-- ---------------------------------------------------------------------------
-- The app calls MusicBrainz from the browser. This validates input, upserts by
-- mbid, never creates custom rows, and only fills metadata that is missing, so
-- one client can't rewrite another's rows. If the app grows, a search-songs
-- edge function can take this over.
create function public.add_musicbrainz_song(
  p_mbid uuid,
  p_title text,
  p_artist text,
  p_album text default null,
  p_cover_url text default null,
  p_duration_ms integer default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  song_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  if p_mbid is null then
    raise exception 'mbid is required' using errcode = '22023';
  end if;

  if char_length(p_album) > 300 then
    raise exception 'album is too long' using errcode = '22023';
  end if;

  -- Only Cover Art Archive images, so the catalog can't point friends at arbitrary URLs.
  if p_cover_url is not null and p_cover_url not like 'https://coverartarchive.org/%' then
    raise exception 'cover_url must be a Cover Art Archive URL' using errcode = '22023';
  end if;

  insert into public.songs as s (mbid, title, artist, album, cover_url, duration_ms, source)
  values (p_mbid, p_title, p_artist, p_album, p_cover_url, p_duration_ms, 'musicbrainz')
  on conflict (mbid) do update
    set album = coalesce(s.album, excluded.album),
        cover_url = coalesce(s.cover_url, excluded.cover_url),
        duration_ms = coalesce(s.duration_ms, excluded.duration_ms)
  returning s.id into song_id;

  return song_id;
end;
$$;

revoke execute on function public.add_musicbrainz_song(uuid, text, text, text, text, integer)
  from public, anon;
grant execute on function public.add_musicbrainz_song(uuid, text, text, text, text, integer)
  to authenticated;
