# Dev Summary (Current Svelte Migration Status)

Last updated: 2025-10-21

## Shell / Front (`apps/front`)
- Layout, sidebar, header, theme toggle and toast infrastructure are in place.
- SharedWorker bootstrap (`dataStore`) runs correctly and lazily loads cards/graph micro-apps.
- Placeholder views exist for `/chapters`, `/chapter/new`, `/toc`, `/settings`, and `/scenes` (the latter redirects to the cards editor until full flows are ported).
- Tailwind styling is active and wired through a local `app.css`.

## Cards Micro-App (`apps/cards`)
- Scene editor ports from Vue are functional: Scene ID input, chapter select, text editor, choices/state lists, save button.
- SharedWorker CRUD endpoints for scenes/chapters are exercised; in-memory/wa-sqlite fallback stores entries for the session.
- Basic unit tests cover header, theme toggle, and layout components.

## Graph Micro-App (`apps/graph`)
- Graph canvas renders with mocked LiteGraph, component tests confirm canvas init and node/edge wiring.
- Shared store fetches graph JSON via the worker; chapter/scene counts display correctly.
- Graph controls component can create scenes/links through worker API (no persistence of drag/zoom yet).

## Shared Worker (`workers/data`)
- Exposes CRUD for scenes/chapters and graph helpers (link creation, position storage) with Zod validation.
- wa-sqlite loads in-memory database, falling back gracefully if WASM import fails.

## Testing & Tooling
- Vitest runs green across cards, front, and graph packages; last run recorded in `TEST-PROOF.md`.
- Tailwind root config scans all Svelte packages; shell has local Tailwind config for tree-shaking.
- Vite dev server serves worker assets (`wa-sqlite.wasm`) thanks to `fs.allow` and explicit WASM import.

## What’s Still TODO (Highlights)
- Remaining Vue-to-Svelte ports (especially advanced graph interactions, full chapter flows, backend syncing).
- Real backend integration and API routing (currently only SharedWorker + local SQLite).
- Expanded test coverage for new flows as they get implemented.

