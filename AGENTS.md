# Agent Working Guide

This file provides instructions and tips for agents working in this repository. It applies to the entire repo unless a more deeply nested `AGENTS.md` overrides it.

## Scope & Principles

- Work primarily in the frontend under `src/`. Avoid modifying `server/` unless explicitly requested.
- Keep changes minimal, focused, and aligned with existing patterns and file layout.
- Do not introduce new dependencies unless absolutely necessary (NodeView packages are already present).
- Follow TODOs in `TODO-CARDS.md`. Update `CHANGELOG.md` (repo root) for notable changes.
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...).

## Tech Stack

- SvelteKit + TypeScript + Tailwind CSS for new app under `cards/`.
- Legacy: Vue 3 in `*-vue` folders (read-only during migration).
- E2E testing: Playwright (`cards/tests-e2e`), unit tests with Vitest + Svelte Testing Library.

## Language Policy

- New frontend code is pure TypeScript: use `.ts` files and `<script lang="ts">` in Svelte components. Avoid `.js` in new code to prevent JS/TS confusion.
- `shared/` library exports TypeScript modules only.
- `server/` is pure C/C++ only; do not introduce TS/JS there.

## CI Rules

- TypeScript strict mode is enabled for `cards/` and `shared/`.
- CI script `npm run ci` runs: ESLint, TS type checks for both packages, `svelte-check`, and a purity check that fails if `.js` files exist in `cards/` or `shared/`.

## Changelog Discipline

- Update `CHANGELOG.md` (repo root) whenever changes are substantial enough to alter API usage, shared library contracts, or integrations between packages (e.g., updates in `shared/` consumed by `cards/`). Include brief, user-oriented notes under the appropriate date/section.

## Project Layout

- `src/` — app code: `components/`, `views/`, `stores/`, `lib/`, `styles/`, `router/`.
- `public/` — static assets and PWA icons.
- `tests/` — Playwright E2E specs (`*.spec.js`).
- `server/` — C++ reference server/docs (not linted by ESLint).
- `doc/` — proofs and docs (changelog lives at repo root: `CHANGELOG.md`).
- External graph app: `apps/graph` (see “External Graph App”).

## Scripts

- `npm run dev` — start full dev stack (cards on 5173, front on 5183).
- `npm run dev:cards` — start cards app only (http://127.0.0.1:5173).
- `npm run dev:front` — start front shell only (http://127.0.0.1:5183).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve built app locally.
- `npm run lint` — ESLint (Vue + JS; `server/` is ignored).
- `npm run check:types` — TypeScript type checking for all packages.
- `npm test` — run Playwright E2E tests.
- `npm run test:unit` — run Vitest unit tests for all packages.
- `npx playwright test cards/tests-e2e/worker-cards.spec.ts` — run single test file.

## Coding Style

- SvelteKit + TypeScript + Tailwind CSS. Indent with 2 spaces.
- Prettier: use semicolons, single quotes, and `trailingComma: es5`.
- Svelte components: `PascalCase.svelte` (e.g., `SceneEditor.svelte`).
- TypeScript files: `.ts` only, no `.js` in new code.
- Imports: group external libs first, then workspace packages, then local modules.
- Error handling: use try/catch with proper typing, avoid `any`.
- Functions: prefer explicit return types, use interfaces for data shapes.

## Data & Configuration

- Copy `.env.example` to `.env` during setup. Key vars:
  - `VITE_API_BASE_URL` — API base for the client (e.g., `http://localhost:3000/api`).
  - `VITE_LOKE_ENGINE_API` — dev proxy target used by Vite.
- Do not commit secrets. Validate CORS and allowed hosts in `vite.config.js`.

## Testing Guidelines

- E2E: Playwright specs in `*/tests-e2e/**/*.spec.ts`. Reports in `playwright-report/`.
- Unit: Vitest specs in `*/tests/**/*.spec.ts` or `*.test.ts`.
- Run single E2E test: `npx playwright test cards/tests-e2e/worker-cards.spec.ts`.
- Run single unit test: `pnpm --filter @loke/cards test worker-cards.spec.ts`.
- Update snapshots: `npx playwright test --update-snapshots`.

## External Graph App

- Standalone app under `apps/graph` (self-contained).
- Scripts:
  - `npm run dev:graph` → http://127.0.0.1:8092
  - `npm run build:graph`, `npm run preview:graph`
- Graph code under `apps/graph/src/graph`:
  - `components/` (GlobalGraph.vue, ChapterGraph.vue, nodes/)
  - `stores/graph.js`, `api/client.js`, `lib/storage.js`, `builders.js`, `layout.js`, `nodeTypes.js`
- Styling uses the main Tailwind/PostCSS config; imports root `src/styles/main.css`.
- Uses same backend via `/api` proxy or `VITE_API_BASE_URL`.

## NodeView (Phase 5 — Extended)

- Reference: `doc/cards-vue-flow.md` for architecture, builders, and ELK layout.
- Packages are preinstalled: `@vue-flow/core`, `@vue-flow/minimap`, `@vue-flow/background`, `elkjs`.
- File layout to use:
  - `src/stores/graph.js` — loads chapters/scenes/links (API with LocalForage fallback).
  - `src/graph/builders.js` — build nodes/edges from domain data.
  - `src/graph/layout.js` — ELK auto‑layout helper (optional).
  - `src/graph/nodeTypes.js` — register `SceneNode` and `ChapterNode`.
  - `src/components/ChapterGraph.vue`, `src/components/GlobalGraph.vue`.
  - Node components live in `src/components/nodes/`.
- Routes:
  - Global: `/nodes` → `GlobalGraph.vue`.
  - Per‑chapter: `/chapter/:id/nodes` → `ChapterGraph.vue`.
- Data access:
  - Prefer `src/api/client.js`; on failure fall back to `src/lib/storage.js` (offline‑first).
  - If links aren’t persisted, derive edges from scene `choices` (`choice.next` → edge target).
- Interactions:
  - Persist positions on drag‑stop; connect to create links; delete to remove nodes/edges.
  - Keep UI responsive; use Minimap and Background.
- Testing (Playwright):
  - Assert node/edge counts, navigation Global ↔ Chapter, drag persistence, and connect/create link.

## Commit & PR Guidelines

- Follow Conventional Commits. Keep PRs focused; include description, linked issue, and before/after screenshots (place images in `screenshots/`).
- Note environments used and attach test evidence when relevant (e.g., `playwright-report`).
- Update `CHANGELOG.md` (repo root) for notable changes.

## Agent Workflow Tips

1. Read `TODO-CARDS.md` and relevant files before changes.
2. Favor surgical edits; do not refactor unrelated parts.
3. Use `src/api/client.js` for data; wrap offline logic via stores and keep `src/lib/storage.js` intact.
4. Validate with Playwright where applicable. If adding UI that affects snapshots, update them intentionally.
5. Align naming, file placement, and style with existing code.
6. Avoid touching `server/` unless the task explicitly scopes it.
7. Keep the app responsive and consistent with Tailwind dark mode variants (`dark:`) and existing palette mapping.
8. When a task in `TODO-CARDS.md` is completed, mark it with `[X]` in `TODO-CARDS.md` (keep the checklist status up to date).

## Legacy Vue Artifacts

- The `cards-vue`, `graph-vue`, and `shared-vue` folders are legacy artifacts kept read‑only during the Svelte migration. Do not modify them unless explicitly requested.
- They are excluded from workspaces, Tailwind scan, ESLint, and Playwright.
- Quick run commands (for reference only):
  - Cards (Vue): `npm install -C cards-vue && npm run dev -C cards-vue`
  - Graph (Vue): `npx vite --config graph-vue/vite.config.js`
  - Shared (Vue): library only; not runnable.
- New active app is under `cards/` (SvelteKit). Use `npm run dev` or `npm run dev:cards` to start it.

## Security

- Do not commit secrets. Ensure `.env` is local. Validate CORS and allowed hosts in `vite.config.js` when configuring proxies.
