# Graph Report - MALguitar  (2026-09-30)

## Corpus Check
- 41 files · ~40,530 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 228 nodes · 293 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8b107730`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- router.tsx
- What You Must Do When Invoked
- package.json
- dependencies
- queries/index.ts
- SignInPage.tsx
- MALguitar
- Find Skills
- devDependencies
- graphify reference: extra exports and benchmark
- database.types.ts
- scripts
- compilerOptions
- graphify reference: query, path, explain
- vite-env.d.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .claude/CLAUDE.md
- extraction-spec.md
- global

## God Nodes (most connected - your core abstractions)
1. `MALguitar` - 13 edges
2. `compilerOptions` - 12 edges
3. `What You Must Do When Invoked` - 12 edges
4. `/graphify` - 10 edges
5. `graphify reference: extra exports and benchmark` - 8 edges
6. `react` - 7 edges
7. `useSession()` - 7 edges
8. `Find Skills` - 7 edges
9. `How to Help Users Find Skills` - 7 edges
10. `react-router` - 6 edges

## Surprising Connections (you probably didn't know these)
- `EmailStep()` --calls--> `useSendCode()`  [EXTRACTED]
  src/routes/SignInPage.tsx → src/lib/queries/useAuth.ts
- `CodeStep()` --calls--> `useSendCode()`  [EXTRACTED]
  src/routes/SignInPage.tsx → src/lib/queries/useAuth.ts
- `CodeStep()` --calls--> `useVerifyCode()`  [EXTRACTED]
  src/routes/SignInPage.tsx → src/lib/queries/useAuth.ts
- `StatsPage()` --calls--> `useSignOut()`  [EXTRACTED]
  src/routes/StatsPage.tsx → src/lib/queries/useAuth.ts
- `GuestOnly()` --calls--> `useSession()`  [EXTRACTED]
  src/routes/guards.tsx → src/lib/queries/useSession.tsx

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "router.tsx"
Cohesion: 0.20
Nodes (13): lucide-react, react-router, useSignOut(), useSession(), GuestOnly(), RequireSession(), LibraryPage(), PracticePage() (+5 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 2 - "package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, @hookform/resolvers, ref_node_url, tailwindcss, @tailwindcss/vite (+11 more)

### Community 3 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form, react-router, @supabase/supabase-js (+3 more)

### Community 4 - "queries/index.ts"
Cohesion: 0.17
Nodes (14): react-dom, @supabase/supabase-js, @tanstack/react-query, src_index, queryClient, useSendCode(), useVerifyCode(), AuthProvider() (+6 more)

### Community 5 - "SignInPage.tsx"
Cohesion: 0.17
Nodes (14): react, react-hook-form, zod, Button(), ButtonProps, Screen(), ScreenProps, TextField() (+6 more)

### Community 6 - "MALguitar"
Cohesion: 0.14
Nodes (13): Commands, Conventions, Data model, graphify, Hard constraints, Layout, MALguitar, MusicBrainz rules (+5 more)

### Community 7 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 8 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, tailwindcss, @tailwindcss/vite, @types/node, @types/react, @types/react-dom, typescript, vite (+3 more)

### Community 9 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 10 - "database.types.ts"
Cohesion: 0.20
Nodes (9): Database, Json, PracticeFocus, PublicTables, SongSource, SongStatus, Tables, TablesInsert (+1 more)

### Community 11 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, preview, test, typecheck

### Community 12 - "compilerOptions"
Cohesion: 0.14
Nodes (13): compilerOptions, isolatedModules, jsx, lib, module, moduleResolution, noEmit, paths (+5 more)

### Community 13 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 15 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 16 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 17 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **129 isolated node(s):** `name`, `version`, `@hookform/resolvers`, `@supabase/supabase-js`, `@tanstack/react-query` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `react` connect `SignInPage.tsx` to `package.json`, `queries/index.ts`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **What connects `name`, `version`, `@hookform/resolvers` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11067193675889328 - nodes in this community are weakly interconnected._
- **Should `MALguitar` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._