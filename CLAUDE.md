# MALguitar

"MyAnimeList / Beli for guitarists." A **personal tool first**: I keep a library of songs (want to learn / learning / learned / shelved) and log practice sessions against each one. I use it daily as a home-screen PWA on my iPhone and in a laptop browser. A small group of friends may join later (invite-only), and maybe more people after that.

**Guiding rule: build for one user, keep the multi-user seams.**
- Every row keeps a `user_id` with owner-only RLS.
- All data access goes through `src/lib/queries/`.
- Each external service sits behind one module.
- Never hard-code a user id, and never loosen RLS "because it's just me."

Plans:
- Stack decisions + staged roadmap: `~/.claude/plans/can-you-look-at-wild-feather.md`
- Feature slices: `~/.claude/plans/i-am-building-a-agile-hopper.md`

## Hard constraints
- **$0 budget.** Free tiers only. No paid services, no Apple $99 fee.
- **Pleasant to use daily on iPhone.** Dark-first, one accent color, smooth sheets, empty states. It must feel right as an installed PWA: safe areas, no zoom on input focus, 44px tap targets.
- **TypeScript everywhere**, strict mode. No `any` without a comment explaining why.
- **Keep it small.** Pick the simplest thing that works, unless it would force a data migration or a rewrite when friends join.

## Stack
- **App:** Vite + React 19 + TypeScript, React Router (`createBrowserRouter`), a static SPA.
- **PWA:** `vite-plugin-pwa` (manifest, service worker, auto-update). iOS meta tags are in `index.html`.
- **UI:** Tailwind CSS v4 (tokens in `src/theme/tokens.css`), `lucide-react`, `vaul` for bottom sheets.
- **Data:** TanStack Query, with optimistic updates for library/status/progress mutations.
- **Forms:** `react-hook-form` (`register`) + `zod`.
- **Backend:** Supabase: Postgres, Auth, RLS. There is no custom server.
- **Auth:** invite-only email + 6-digit code (`signInWithOtp({ shouldCreateUser: false })` then `verifyOtp`).
  - Use a code, not a magic link: on iOS a link opens Safari, which doesn't share storage with the home-screen app.
  - Accounts are created from the Supabase dashboard, and sign-ups are disabled.
- **Song data:** MusicBrainz + Cover Art Archive, called **from the browser** (both send CORS `*`). New catalog songs go through the `add_musicbrainz_song` RPC.
- **Tests:** Vitest for pure logic. pgTAP for schema/RLS.
- **Hosting:** `npm run build` → Cloudflare Pages (free, SPA fallback is automatic).

## Layout
```
index.html                 iOS PWA meta, viewport-fit=cover
vite.config.ts             React, Tailwind, PWA manifest, @ alias, Vitest
src/
  main.tsx                 QueryClientProvider → AuthProvider → RouterProvider
  router.tsx               route table
  routes/                  guards (RequireSession/GuestOnly), TabsLayout, pages
  lib/supabase.ts          Supabase client (localStorage session)
  lib/database.types.ts    hand-written DB types (regenerate once linked)
  lib/queries/             TanStack Query hooks (useSession, useSendCode, useVerifyCode, useSignOut…)
  lib/schemas/             zod schemas
  components/ui/           primitives (Button, Screen, TextField, then Card, Sheet, Chip, CoverArt, ProgressBar)
  theme/                   tokens.css (Tailwind @theme) + colors.ts (for non-CSS consumers); keep them in sync
public/                    icons, favicon
supabase/
  migrations/*.sql         0001_init (squashed baseline: tables, RLS, triggers, add_musicbrainz_song)
  tests/*.test.sql         pgTAP
  templates/verify-code.html  magic_link template that renders {{ .Token }}
```

## Conventions
- Pages don't call Supabase directly. All reads and writes go through hooks in `src/lib/queries/`.
- Colors come from theme tokens (`bg-accent`, `text-muted`…). No hex values in components.
- Build pages from `src/components/ui/` primitives. Extend a primitive rather than styling one page ad hoc.
- Pure logic (status transitions, streaks, stats, MusicBrainz mapping) goes in plain TS modules with a `*.test.ts` next to it.
- Data is small per user. Load a user's whole library and sessions once, then filter, sort, and compute stats on the client.
- Schema changes are **always** a new migration file. Never edit a migration once it has been pushed to the hosted project.
- Env vars are `VITE_*`, and everything with that prefix ships in the bundle.

## Data model
- `profiles`: `id` → `auth.users`, `username`, `display_name`, `avatar_url`. Created by a signup trigger and public-read. Unused by the UI until the friends stage.
- `songs`: a **shared catalog**, so the same song is the same row for everyone.
  - `source` is `musicbrainz` | `custom`.
  - MusicBrainz rows: unique `mbid`, no `created_by`. Written only by `add_musicbrainz_song()`. The RPC validates input, only accepts coverartarchive.org cover URLs, and only fills missing metadata.
  - Custom rows: `created_by`, private to their creator.
- `user_songs`: one row per user per song (`unique(user_id, song_id)`).
  - `status` enum: `want_to_learn`, `learning`, `learned`, `shelved`.
  - Other columns: `progress` 0–100, `difficulty` 1–5, `tuning`, `capo`, `notes`, `tab_url`, `video_url`, `started_at`, `learned_at`, `updated_at`.
- `practice_sessions`: `user_song_id`, `practiced_at`, `duration_min`, `focus` (riff/solo/rhythm/full_song), `notes`, `progress_after`.
- A trigger sets `learned_at` when status becomes `learned`, and `started_at` when status becomes `learning` or `learned`.
- Social features later (follows, ratings, friend libraries) are **additive** tables and policies, with no data migration.

## Security (RLS is the boundary; the anon key is public)
- Every table has RLS enabled.
- `user_songs`, `practice_sessions`: owner-only CRUD (`user_id = auth.uid()`).
- `songs`:
  - `musicbrainz` rows are readable by every authenticated user. Clients can't insert them directly, only through the RPC.
  - `custom` rows are CRUD for their creator only.
  - `user_songs` can only reference songs the user can see.
- `profiles`: public read, owner write.
- Sign-ups and anonymous sign-ins are off: `[auth] enable_signup = false` locally, and the same toggles in the hosted dashboard.
  - Don't set `[auth.email] enable_signup = false`: that disables email login entirely.
- The service-role/secret key never goes in the app or in `VITE_*`.

## MusicBrainz rules
- Call it only through `src/lib/musicbrainz.ts`. That module is the swap point for a `search-songs` edge function if the app grows.
- Debounce search input (≥400 ms) and never fire requests in a loop. The limit is 1 req/s per IP.
- Cover art: Cover Art Archive `front-250` URLs, with a placeholder when missing.
- If MusicBrainz has no match, fall back to the custom-song form.

## Commands
- `npm run dev`: dev server (http://localhost:5173)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Vitest (`vitest run`)
- `npm run build`: typecheck + production build to `dist/` (includes the service worker)
- `npm run preview`: serve the production build
- `supabase start` / `supabase migration up --local`: local stack + apply new migrations. `supabase db reset` wipes local data.
- `supabase test db`: pgTAP
- `supabase db push`: apply migrations to the hosted project (confirm first)
- Local sign-in: create a user in local Studio (http://127.0.0.1:54323), then read the code in Mailpit (http://127.0.0.1:54324).

## Testing
- Test-first is **not** required.
- Write Vitest tests for pure logic.
- Update pgTAP with every migration.
- Don't weaken or delete a test to make it pass. If a test's premise is wrong, say so and ask first.

## Verifying changes
- Always: `npm run build` (typecheck + build) and `npm test`.
- Schema/RLS changes: `supabase migration up --local` + `supabase test db`.
- UI changes: check in a desktop browser at phone width, and on the iPhone home-screen PWA when layout, safe areas, or storage are involved.
- Manual smoke flow:
  1. Sign in with a code inside the PWA.
  2. Search "Wonderwall" and add it as Learning.
  3. Set progress and links.
  4. Log a session.
  5. Mark it Learned.
  6. Check that the stats update.
  7. Force-quit, reopen, and confirm you're still signed in with the data intact.

## Out of scope (don't build unless asked)
- Open sign-ups
- Social/follows/feed
- Beli-style ranking
- App Store/Capacitor builds
- Push notifications
- Sentry/analytics

Friends-stage items (custom SMTP, invites, Sentry) are listed in the plan.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
