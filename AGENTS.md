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
