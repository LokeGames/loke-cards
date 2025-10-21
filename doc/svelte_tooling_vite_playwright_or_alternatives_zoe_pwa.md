# TL;DR

- **Use SvelteKit (which uses Vite)** for build/dev. It’s the fastest, most supported path, great DX, and first‑class PWA support via service workers or `vite-plugin-pwa`.
- **Use Vitest + @testing-library/svelte** for unit/component tests.
- **Use Playwright** for E2E (cross‑browser, trace viewer, solid in CI).
- Add **MSW** for API mocking, **axe-core** for a11y checks, **Lighthouse CI** for PWA scores.
- If you prefer a visual E2E runner over code‑first, consider **Cypress** (trade‑offs noted below).

You don’t get extra points leaving the SvelteKit+Vite+Playwright “happy path.” It’s the default for a reason.

---

## Why Vite (via SvelteKit)

- **SvelteKit defaults to Vite**: you get HMR, TS, code splitting, SSR/SSG, adapters (static/node), and easy env handling.
- **Plugin ecosystem**: `vite-plugin-pwa`, `vite-tsconfig-paths`, `rollup-plugin-visualizer`, `unplugin-icons`, `unplugin-auto-import`, etc.
- **Performance**: lightning‑fast dev server and incremental builds.

**When to NOT use Vite**

- Rare: You need a corporate Webpack plugin that has no Vite equivalent or a bespoke micro‑frontend setup tightly coupled to Webpack Module Federation. (Most teams still succeed with Vite MF via `@originjs/vite-plugin-federation`.)

---

## Why Playwright for E2E

- **True cross‑browser** (Chromium, Firefox, WebKit) in headless and headed modes.
- **Trace viewer & video** by default: debug flaky tests easily.
- **Auto‑waits** & resilient locators reduce flakiness.
- **Great CI story** with sharding/retries.

**Cypress vs Playwright (quick take)**

- **Cypress**: superb interactive runner & time‑travel UI, great for teams new to E2E; but single‑tab model can limit multi‑page flows/login popups.
- **Playwright**: stronger for multi‑tab, downloads, native dialogs, and cross‑browser parity. Slightly steeper learning curve, but scales better.

Decision: If your team loves a GUI‑first test runner → **Cypress**. If you value breadth/stability/CI‑scale → **Playwright** (recommended).

---

## Unit & Component Testing

- **Vitest**: Fast, Vite‑aware test runner.
- **@testing-library/svelte**: DOM‑facing tests that reflect real user behavior.
- **msw**: Seamless HTTP mocking for both unit and E2E (via service worker in browser; node adapter in Vitest).
- **axe-core / jest-axe**: a11y assertions in tests.

Example testing pyramid:

- **70%** unit/component (Vitest + Testing Library)
- **25%** integration (Vitest + in‑memory router or Playwright component testing)
- **5%** E2E (Playwright full stack)

---

## PWA & Offline

Two good paths:

1. **SvelteKit service worker** (manual control; minimal deps).
2. `` (generate manifest + workbox strategies with minimal config, auto updates, assets injection, `prompt-for-update` pattern).

Pick 2) if you want “PWA done in 15 minutes.” Pick 1) if you want total control or advanced runtime caching logic.

---

## Recommended Stack for Zoe PWA

- **Framework**: SvelteKit (Vite under the hood).
- **TypeScript**: `strict: true`.
- **Styling**: Tailwind or UnoCSS + PostCSS.
- **State**: Svelte stores; consider `@tanstack/svelte-query` for server cache.
- **Forms**: Zod for validation.
- **Testing**: Vitest + @testing-library/svelte + MSW + Playwright.
- **A11y**: `svelte-check`, `eslint-plugin-svelte`, `axe-core` in tests.
- **PWA**: `vite-plugin-pwa` (or custom SW).
- **Lint/Format**: Biome **or** ESLint + Prettier (don’t run both formatters).
- **CI**: GitHub Actions with matrix for OS/Node and a Lighthouse CI job.

---

## Scripts (package.json sketch)

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "biome check .",
    "format": "biome format .",
    "pwa:generate": "vite build && workbox generateSW"
  }
}
```

---

## Quickstart (from scratch)

```bash
# 1) Create project
pnpm create svelte@latest zoe-pwa && cd zoe-pwa

# 2) Install testing deps
pnpm add -D vitest @testing-library/svelte @testing-library/jest-dom jsdom msw

# 3) Install Playwright
pnpm exec playwright install --with-deps

# 4) PWA plugin (optional, easy path)
pnpm add -D vite-plugin-pwa workbox-window

# 5) Linting (choose one)
pnpm add -D @biomejs/biome
# or ESLint+Prettier stack

# 6) A11y
pnpm add -D axe-core jest-axe
```

---

## When to pick alternatives

- **Cypress** if your team values the time‑travel GUI and primarily tests Chromium; accept fewer multi‑tab flows.
- **WebdriverIO** if you already run Selenium‑grid style infra or need mobile (Appium) in the same toolchain.
- **Rollup** for libraries (not apps) if you want slimmer control over artifacts; Vite still fine for libs.
- **Turbopack**: promising with Next.js, but Svelte ecosystem is Vite‑first.

---

## CI outline (GitHub Actions sketch)

- Job 1: **Typecheck + Lint + Unit** (Vitest, headless jsdom)
- Job 2: **E2E** (Playwright with browser matrix)
- Job 3: **Build + Lighthouse CI** (assert PWA, performance budgets)

---

## Bottom line

- Ja: **Playwright og Vite** er det rigtige valg i Svelte‑land i 2025.
- Der findes alternativer, men du får **flest fordele, mindst friktion** og bedst community‑vej med SvelteKit(Vite)+Vitest+Playwright.
- For Zoe PWA: start på hovedsporet, tilføj Cypress kun hvis teamet savner en visuel runner.

