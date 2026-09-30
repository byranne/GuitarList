-- add_musicbrainz_song(): the client path into the shared MusicBrainz catalog.
begin;
create extension if not exists pgtap with schema extensions;

select plan(9);

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@test.dev');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);

select isnt(
  public.add_musicbrainz_song('b1a9c0e9-d987-4042-ae91-78d6a3267d69', 'Wonderwall', 'Oasis'),
  null, 'an authenticated user can add a MusicBrainz song'
);

select is(
  public.add_musicbrainz_song('b1a9c0e9-d987-4042-ae91-78d6a3267d69', 'Wonderwall (edited)', 'Oasis',
    '(What''s the Story) Morning Glory?'),
  (select id from public.songs where mbid = 'b1a9c0e9-d987-4042-ae91-78d6a3267d69'),
  'adding the same mbid again returns the existing row'
);

select is(
  (select count(*)::int from public.songs where mbid = 'b1a9c0e9-d987-4042-ae91-78d6a3267d69'),
  1, 'upsert keeps one row per mbid'
);

select results_eq(
  $$ select title, album, source::text, created_by from public.songs
     where mbid = 'b1a9c0e9-d987-4042-ae91-78d6a3267d69' $$,
  $$ values ('Wonderwall'::text, '(What''s the Story) Morning Glory?'::text, 'musicbrainz'::text, null::uuid) $$,
  'fills missing metadata, keeps the existing title, and stays a musicbrainz row'
);

select throws_ok(
  $$ select public.add_musicbrainz_song('c1a9c0e9-d987-4042-ae91-78d6a3267d69', 'X', 'Y', null,
       'https://evil.example/track.png') $$,
  '22023', null, 'rejects cover art that is not from Cover Art Archive'
);

select throws_ok(
  $$ select public.add_musicbrainz_song('c1a9c0e9-d987-4042-ae91-78d6a3267d69', '', 'Y') $$,
  '23514', null, 'table checks still apply (empty title)'
);

select throws_ok(
  $$ insert into public.songs (mbid, title, artist, source) values
     ('d1a9c0e9-d987-4042-ae91-78d6a3267d69', 'Fake', 'Fake', 'musicbrainz') $$,
  '42501', null, 'direct inserts of musicbrainz rows are still denied'
);

reset role;
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
select throws_ok(
  $$ select public.add_musicbrainz_song('e1a9c0e9-d987-4042-ae91-78d6a3267d69', 'X', 'Y') $$,
  '42501', null, 'anon cannot call add_musicbrainz_song'
);
reset role;

select is(
  (select count(*)::int from public.songs where mbid = 'e1a9c0e9-d987-4042-ae91-78d6a3267d69'),
  0, 'anon call created nothing'
);

select * from finish();
rollback;
