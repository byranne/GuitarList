# MALguitar

"MyAnimeList / Beli for guitarists." Users keep a personal library of songs (want to learn / learning / learned / shelved) and log practice sessions against each song. It's a solo 4–6 week MVP that ships to real users as a web PWA. The same codebase has to go to the App Store later without a rewrite.

Full architecture + sprint plan: `~/.claude/plans/i-am-building-a-agile-hopper.md`

## Hard constraints
- **$0 budget.** Free tiers only. Don't add paid services or anything that needs the Apple $99 fee (no EAS/App Store builds yet).
- **Polish matters.** Aim for a Beli / Spotify / Instagram level: dark-first, one accent color, smooth sheets and animations, skeleton loaders, empty states.
- **Cross-platform.** Code must run on web *and* iOS/Android via Expo Go. Don't use web-only APIs or DOM code in shared components. Guard with `Platform.OS` when needed.
- **TypeScript everywhere**, strict mode. No `any` without a comment explaining why.

## Stack
- **App:** Expo (latest SDK) + React Native + TypeScript + Expo Router
- **UI:** NativeWind (Tailwind), `expo-image`, `react-native-reanimated`, `@gorhom/bottom-sheet`, `lucide-react-native`
- **Data:** TanStack Query (use optimistic updates for library/status/progress mutations)
- **Forms:** `react-hook-form` + `zod` (share schemas between forms and data mapping)
- **Backend:** Supabase: Postgres, Auth (email OTP / magic link), RLS, Edge Functions, Storage. There is no custom server.
- **Song data:** MusicBrainz + Cover Art Archive, **only** through the `search-songs` edge function
- **Hosting:** `npx expo export -p web` → Vercel / Cloudflare Pages (static SPA + PWA manifest)
- **Errors:** Sentry free tier (`@sentry/react-native`)

## Layout
```
app/                      Expo Router screens
  (auth)/sign-in.tsx
  (tabs)/index.tsx        Library
  (tabs)/search.tsx       MusicBrainz search → add-to-library sheet
  (tabs)/practice.tsx     recent sessions, streak, quick log
  (tabs)/profile.tsx      stats
  song/[id].tsx           song detail
src/
  lib/supabase.ts         Supabase client + secure session storage
  lib/queries/            TanStack Query hooks (useLibrary, useSongSearch, useLogSession…)
  components/ui/          design-system primitives (Button, Card, Sheet, Chip, CoverArt, ProgressBar)
  theme/                  color tokens, typography, spacing
supabase/
  migrations/*.sql        schema + RLS (numbered: 0001_init.sql, 0002_…)
  functions/search-songs/ MusicBrainz proxy + cache
```

## Conventions
- Screens don't call Supabase directly. All reads and writes go through hooks in `src/lib/queries/`.
- Colors, spacing, and type come from `src/theme/` tokens. No hard-coded hex values in components.
- Build screens from `src/components/ui/` primitives. Extend a primitive rather than one-off styling it.
- Pure logic (status transitions, streak calculation, MusicBrainz response mapping) lives in plain TS modules with Jest unit tests.
- Schema changes are **always** a new migration file. Never edit an applied migration.

## Data model
- `profiles`: `id` → `auth.users`, unique `username`, `display_name`, `avatar_url`
- `songs`: shared catalog cache. `mbid` is unique and nullable. `source` is `musicbrainz` | `custom`. `created_by` is set for custom songs.
- `user_songs`: one row per user per song (`unique(user_id, song_id)`). Columns: `status` enum (`want_to_learn`, `learning`, `learned`, `shelved`), `progress` 0–100, `difficulty` 1–5, `tuning`, `capo`, `notes`, `tab_url`, `video_url`, `started_at`, `learned_at`, `updated_at`.
- `practice_sessions`: `user_song_id`, `practiced_at`, `duration_min`, `focus` (riff/solo/rhythm/full song), `notes`, `progress_after`.
- `learned_at` is set automatically when status becomes `learned`.
- Design tables so public profiles, follows, and ratings can be added later **without migrating existing data**.

## Security (RLS is the security boundary)
- Every table has RLS enabled. No exceptions.
- `user_songs`, `practice_sessions`: owner-only CRUD (`user_id = auth.uid()`).
- `songs`: authenticated read. Inserts only via the edge function (service role) or as `source='custom'` with `created_by = auth.uid()`.
- `profiles`: public read, owner write.
- The service-role key is used only inside edge functions. It never goes in the app bundle or in `EXPO_PUBLIC_*` env vars.

## MusicBrainz rules
- Call MusicBrainz only from `supabase/functions/search-songs`, never from the client.
- Always send a descriptive `User-Agent` (app name/version + contact). Stay at or under **1 req/s**.
- Check the `songs` cache first. Upsert results by `mbid`. An identical second search must not hit MusicBrainz.
- Cover art comes from Cover Art Archive. Handle missing art with a placeholder in `CoverArt`.
- If MusicBrainz has no match, fall back to the custom-song form.

## Commands
(Being scaffolded in Week 1. Update this list once they exist.)
- `npx expo start`: dev server (web + Expo Go)
- `npx tsc --noEmit`: typecheck
- `npx eslint .`: lint
- `npx jest`: unit tests
- `npx expo export -p web`: production web build
- `supabase start` / `supabase db reset`: local DB + apply migrations
- `supabase functions serve`: run edge functions locally
- `supabase test db`: pgTAP schema + RLS tests
- `deno test supabase/functions`: edge function tests

CI (GitHub Actions) runs typecheck + lint on every push. A daily cron pings Supabase so the free project doesn't pause.

## Out of scope for MVP (don't build unless asked)
Social/follows/feed, Beli-style pairwise ranking, App Store/EAS builds, push notifications, Apple/Google sign-in. Stretch goals only if time allows: a 1–10 score and a public read-only profile.



Don't write implementation code for anything that has no failing test yet. Don't weaken or delete a test to make it pass. If a test's premise is wrong, say so and ask first.

### How each constraint is tested
| Constraint | Test | Location / tool |
|---|---|---|
| RLS: owner-only `user_songs` / `practice_sessions` | User B can't select/insert/update/delete user A's rows | `supabase/tests/*.sql`, pgTAP via `supabase test db` |
| RLS: `songs` insert rules | Client can insert only `source='custom'` with `created_by = auth.uid()`; `musicbrainz` rows are service-role only | pgTAP |
| RLS: `profiles` | Anyone can read; only the owner can write | pgTAP |
| Schema integrity | `unique(user_id, song_id)`; `progress` 0–100; `difficulty` 1–5; `status` enum; `mbid` unique | pgTAP |
| `learned_at` auto-set | Changing status to `learned` sets `learned_at` | pgTAP (trigger) + Jest (status transition logic) |
| MusicBrainz proxy | Sends a `User-Agent`; ≤1 req/s; an identical second search is served from the cache with no fetch; response mapping; upsert by `mbid` | `supabase/functions/search-songs/*.test.ts`, `deno test`, with `fetch` mocked |
| No service-role key in the client | The web export bundle has no service-role key and no `EXPO_PUBLIC_*SERVICE*` vars | CI script over the `expo export -p web` output |
| Pure logic | Status transitions, streak calculation, zod schemas, MusicBrainz mapping | Jest, `*.test.ts` next to the source |
| Data hooks | Optimistic update applied, then rolled back on error; cache invalidation | Jest + `@testing-library/react-native`, with a mocked Supabase client |
| Cross-platform | Component tests run on iOS, Android, and web | `jest-expo` universal preset |
| Design tokens | No hard-coded hex values in `app/` or `src/components/` | ESLint rule / CI grep |

## Verifying changes
- Run `tsc --noEmit`, lint, Jest, `supabase test db`, and `deno test` for edge functions before calling work done.
- RLS changes: confirm user B can't read or write user A's `user_songs` / `practice_sessions`.
- UI changes: check on web **and** Expo Go.
- Manual smoke flow: sign up → search "Wonderwall" → add as Learning → set progress + links → log a session → mark Learned → stats update.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
