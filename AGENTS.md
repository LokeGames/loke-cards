# Agent Working Guide

**Build/Lint/Test Commands:**

- `npm run dev` - Full dev stack (cards:5173, front:5183)
- `npm run dev:cards` - Cards app only
- `npm run lint` - ESLint (ignores server/)
- `npm run check:types` - TypeScript type checking
- `npm test` - Playwright E2E tests
- `npm run test:unit` - Vitest unit tests
- Single E2E: `npx playwright test cards/tests-e2e/worker-cards.spec.ts`
- Single unit: `pnpm --filter @loke/cards test worker-cards.spec.ts`

**Code Style:**

- SvelteKit + TypeScript + Tailwind CSS, 2-space indent
- Pure TypeScript: `.ts` files only, no `.js` in new code
- Svelte components: `PascalCase.svelte`
- Imports: external libs → workspace packages → local modules
- Error handling: try/catch with proper typing, avoid `any`
- Functions: explicit return types, interfaces for data shapes

**Scope:** Work in frontend `src/`, avoid `server/` unless requested. Legacy Vue folders (`*-vue`) are read-only. Use Conventional Commits. Update `CHANGELOG.md` for notable changes.
