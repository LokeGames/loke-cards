# Agent Working Guide for apps-vue

## Build & Test Commands

- `npm run dev` - Start dev server (port 8081)
- `npm run build` - Production build
- `npm run check:types` - TypeScript type checking
- `npx playwright test tests/base-button.spec.js` - Run single test
- `npx playwright test` - Run all Playwright tests

## Code Style Guidelines

- Vue 3 + TypeScript + Tailwind CSS
- Components: PascalCase.vue (e.g., BaseButton.vue)
- Imports: External libs → workspace packages → local modules
- Use `<script setup lang="ts">` syntax
- 2-space indentation, semicolons, single quotes
- Explicit return types, interfaces for data shapes
- Error handling: try/catch with proper typing, avoid any

## Project Structure

- `cards/` - Main Vue app (port 8081)
- `graph/` - Graph visualization app
- `shared/` - Shared components and utilities
- `server/` - C++ backend (do not modify unless requested)

## Testing

- Playwright E2E tests in `tests/*.spec.js`
- Reports in `playwright-report/`
- Use `page.goto()` for navigation, `getBy*` selectors

## Development Notes

- API proxy: `/api` → `http://localhost:3000`
- PWA enabled with service worker
- Use aliases: `@shared`, `@cards`, `@graph`
