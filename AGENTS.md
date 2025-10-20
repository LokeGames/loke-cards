# Repository Guidelines

## Project Structure & Modules
- `src/` — app code: `components/`, `views/`, `stores/`, `lib/`, `styles/`, `router/`.
- `public/` — static assets and PWA icons.
- `tests/` — Playwright E2E specs (`*.spec.js`).
- `server/` — C++ reference server/docs (not linted by ESLint).
- `doc/` — changelog, proofs, and docs. Update when significant changes land.

## Build, Test, and Development
- `npm run dev` — start Vite dev server at `http://127.0.0.1:8081`.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve built app locally.
- `npm test` — run Playwright tests (expects the dev server on 8081). Tip: run `npm run dev` in one terminal and tests in another.
- `npm run lint` — ESLint (Vue + JS, server/ is ignored).

## Coding Style & Naming
- JavaScript + Vue 3, Tailwind CSS. Indent: 2 spaces.
- Prettier: semicolons, single quotes, `trailingComma: es5`.
- Vue components: `PascalCase.vue` (e.g., `SceneEditorView.vue`).
- Composables: `useX.js` (e.g., `useSceneValidation.js`).
- Stores: `stores/*.js` (Pinia). Utilities in `lib/`.
- Keep modules small, colocate tests/UI examples under `views/` or `tests/` as appropriate.

## Testing Guidelines
- Framework: Playwright (`tests/*.spec.js`). Screenshots and reports: `playwright-report/`, `test-results/`.
- Run all tests: `npm test`. Update snapshots when intentional UI changes: `npx playwright test --update-snapshots`.
- Prefer E2E coverage for user flows (scene create/edit, chapter list, dark mode). Add targeted specs for regressions.

## Commit & Pull Request Guidelines
- Use Conventional Commits for clear history and changelog: `feat:`, `fix:`, `docs:`, `chore:`, etc.
- Keep PRs focused; include description, linked issue, and before/after screenshots (place images in `screenshots/`).
- Note envs used and test evidence (attach `playwright-report` if relevant). Update `doc/CHANGELOG.md` for notable changes.

## Security & Configuration
- Copy `.env.example` to `.env`. Key vars:
  - `VITE_API_BASE_URL` — API base used by the client (e.g., `http://localhost:3000/api`).
  - `VITE_LOKE_ENGINE_API` — dev proxy target used by Vite.
- Do not commit secrets. Validate CORS and allowed hosts in `vite.config.js`.

## Agent Notes
- Follow TODOs in `TODO.md`; keep changes minimal and aligned with existing patterns.
- Avoid modifying `server/` unless explicitly scoped; frontend lives in `src/`.

## External NodeView App
- A standalone NodeView app is available under `apps/nodeview`.
- Run it separately from the main app:
  - `npm run dev:nodeview` → http://127.0.0.1:8092
  - `npm run build:nodeview`, `npm run preview:nodeview`
- It reuses graph components and store from the main app (`src/components/GlobalGraph.vue`, `src/components/ChapterGraph.vue`, `src/stores/graph.js`).
- Styling uses the main Tailwind/PostCSS config; Vite config points to the root `postcss.config.js`.
- The external app talks to the same backend via `/api` proxy or `VITE_API_BASE_URL` if set.

## NodeView (Phase 5 — Extended)
- Reference: `doc/cards-vue-flow.md` for architecture, builders, ELK layout.
- Packages are already present: `@vue-flow/core`, `@vue-flow/minimap`, `@vue-flow/background`, `elkjs`.
- File layout to use:
  - `src/stores/graph.js` — loads chapters/scenes/links (API with LocalForage fallback)
  - `src/graph/builders.js` — build nodes/edges from domain data
  - `src/graph/layout.js` — ELK auto‑layout helper (optional)
  - `src/graph/nodeTypes.js` — register `SceneNode` and `ChapterNode`
  - `src/components/ChapterGraph.vue`, `src/components/GlobalGraph.vue`
  - Node components live in `src/components/nodes/`
- Routes:
  - Global: `/nodes` → `GlobalGraph.vue`
  - Per‑chapter: `/chapter/:id/nodes` → `ChapterGraph.vue`
- Data access:
  - Prefer `src/api/client.js`; on failure fall back to `src/lib/storage.js` (offline‑first).
  - If links are not persisted, derive edges from scene `choices` (choice.next → edge target).
- Interactions:
  - Persist positions on drag‑stop; connect to create links; delete to remove nodes/edges.
  - Keep UI responsive; use Minimap and Background.
- Testing (Playwright):
  - Assert node/edge counts, navigation Global ↔ Chapter, drag persistence, and connect/create link.

## UI/Styling
- Use Tailwind with dark mode variants (`dark:`). Follow existing palette mapping.
- Reuse base components (`BaseButton`, `BaseInput`) and patterns in `views/`.
- Keep components small and colocated when helpful.

## Data & Sync
- Use Pinia stores for app state; keep `lib/storage.js` logic intact and wrap via stores.
- Update `.env` locally from `.env.example`; base URL `VITE_API_BASE_URL` must point to backend.

## Testing & Dev
- Dev server runs on `http://127.0.0.1:8081` (`npm run dev`).
- Run E2E tests with `npm test` (expects dev server on 8081).
- When adding UI that affects snapshots, update with `npx playwright test --update-snapshots` deliberately.

## Constraints
- Don’t introduce new dependencies without need; packages for NodeView are already included.
- Don’t change `server/` unless specifically requested.
- Follow Conventional Commits and update `doc/CHANGELOG.md` for notable changes.
