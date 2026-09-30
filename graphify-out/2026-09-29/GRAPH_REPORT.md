# Graph Report - MALguitar  (2026-09-28)

## Corpus Check
- 43 files · ~35,771 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 2, .example 1, .css 1)

## Summary
- 255 nodes · 319 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3c1f108`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- expo
- What You Must Do When Invoked
- package.json
- dependencies
- app/_layout.tsx
- ui/index.ts
- MALguitar
- sign-in.tsx
- colors
- graphify reference: extra exports and benchmark
- database.types.ts
- scripts
- tsconfig.json
- graphify reference: query, path, explain
- devDependencies
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .claude/CLAUDE.md
- extraction-spec.md
- nativewind-env.d.ts

## God Nodes (most connected - your core abstractions)
1. `expo` - 13 edges
2. `What You Must Do When Invoked` - 12 edges
3. `MALguitar` - 12 edges
4. `/graphify` - 10 edges
5. `react-native` - 9 edges
6. `scripts` - 8 edges
7. `Screen()` - 8 edges
8. `colors` - 8 edges
9. `graphify reference: extra exports and benchmark` - 8 edges
10. `useSession()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `EmailStep()` --calls--> `useSendOtp()`  [EXTRACTED]
  app/(auth)/sign-in.tsx → src/lib/queries/useAuth.ts
- `OtpStep()` --calls--> `useVerifyOtp()`  [EXTRACTED]
  app/(auth)/sign-in.tsx → src/lib/queries/useAuth.ts
- `RootStack()` --calls--> `useSession()`  [EXTRACTED]
  app/_layout.tsx → src/lib/queries/useSession.tsx
- `OtpStep()` --calls--> `useSendOtp()`  [EXTRACTED]
  app/(auth)/sign-in.tsx → src/lib/queries/useAuth.ts
- `ProfileScreen()` --calls--> `useSignOut()`  [EXTRACTED]
  app/(tabs)/profile.tsx → src/lib/queries/useAuth.ts

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "expo"
Cohesion: 0.08
Nodes (24): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, typedRoutes, expo (+16 more)

### Community 1 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 2 - "package.json"
Cohesion: 0.08
Nodes (23): config, { getDefaultConfig }, { withNativeWind }, main, name, private, version, babel-preset-expo (+15 more)

### Community 3 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, expo, expo-asset, expo-constants, expo-font, expo-linking, expo-router, expo-secure-store (+17 more)

### Community 4 - "app/_layout.tsx"
Cohesion: 0.14
Nodes (17): RootStack(), ProfileScreen(), global, expo-secure-store, expo-status-bar, @supabase/supabase-js, @tanstack/react-query, Database (+9 more)

### Community 5 - "ui/index.ts"
Cohesion: 0.15
Nodes (9): react, react-native, react-native-safe-area-context, Button(), ButtonProps, Screen(), ScreenProps, TextField (+1 more)

### Community 6 - "MALguitar"
Cohesion: 0.14
Nodes (13): Commands, Conventions, Data model, graphify, Hard constraints, How each constraint is tested, Layout, MALguitar (+5 more)

### Community 7 - "sign-in.tsx"
Cohesion: 0.23
Nodes (10): EmailStep(), OtpStep(), @hookform/resolvers, react-hook-form, zod, useSendOtp(), EmailForm, emailFormSchema (+2 more)

### Community 8 - "colors"
Cohesion: 0.26
Nodes (5): expo-router, lucide-react-native, tailwindcss, colors, ColorToken

### Community 9 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 10 - "database.types.ts"
Cohesion: 0.22
Nodes (8): Json, PracticeFocus, PublicTables, SongSource, SongStatus, Tables, TablesInsert, TablesUpdate

### Community 11 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, android, build:web, ios, lint, start, typecheck, web

### Community 12 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): expo/tsconfig.base, compilerOptions, paths, strict, extends, include

### Community 13 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 14 - "devDependencies"
Cohesion: 0.33
Nodes (6): devDependencies, babel-preset-expo, prettier-plugin-tailwindcss, tailwindcss, @types/react, typescript

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
- **148 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+143 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 171 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `react-native` connect `ui/index.ts` to `package.json`, `app/_layout.tsx`, `sign-in.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _148 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `expo` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._