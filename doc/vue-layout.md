# Loke Cards – Application Layout & Theme Spec

**Goal:** Convert Loke Cards from a centered, website‑like page to a **full‑viewport application** with an app shell (header + sidebar + main), resizable panels, and a persistent **light/dark** theme. Works across mobile, tablet, desktop and ultrawide without max‑width constraints.

---

## 1) Design principles

* **Full screen**: Always occupy `100vw × 100vh`. No `max-w` containers.
* **App shell**: Stable frame (header + sidebar) with scroll **inside content**, not on the page.
* **Responsive app, not responsive page**: Layout adapts, but content does **not** narrow to a centered column.
* **Themeable**: Tailwind `dark` variant with user toggle + `localStorage` persistence.
* **Keyboard‑friendly**: Skip links, focus rings, ARIA landmarks.
* **Panel‑first**: Editor/Inspector/Preview panels as flexible/resizable regions.

---

## 2) Layout structure

```
<AppShell>
 ├─ <AppHeader/>     // sticky topbar, commands, sync, theme toggle
 ├─ <ShellBody>
 │    ├─ <AppSidebar/>    // navigation: Scenes, Chapters, Assets, Settings
 │    └─ <AppMain/>       // router area: Dashboard, Editors, etc.
 └─ <Toaster/Dialogs/Shortcuts/>
</AppShell>
```

### AppShell (root)

```html
<div class="flex flex-col h-screen w-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <AppHeader />
  <div class="flex flex-1 overflow-hidden">
    <AppSidebar class="hidden md:flex w-64 shrink-0 border-r border-gray-200 dark:border-gray-800" />
    <main class="flex-1 overflow-auto p-4 md:p-6">
      <RouterView />
    </main>
  </div>
</div>
```

**Notes**

* `h-screen w-screen` ensures full viewport in all modes, incl. ultrawide.
* `overflow-hidden` on shell body + `overflow-auto` on `<main>`
  → page itself doesn’t scroll; content does.
* On mobile, sidebar becomes a drawer.

### Header

* Height: `56–64px`, sticky, subtle shadow.
* Left: app icon + title; Center: breadcrumbs/search; Right: status pills, theme toggle, user menu.

```html
<header class="h-14 md:h-16 sticky top-0 z-30 flex items-center gap-2 px-3 md:px-4
  border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur">
  <button class="md:hidden" aria-label="Open navigation"><!-- hamburger --></button>
  <div class="font-semibold">Loke Cards</div>
  <nav aria-label="Breadcrumb" class="ml-2 hidden sm:block">...</nav>
  <div class="ml-auto flex items-center gap-2">
    <StatusPill state="synced"/>
    <ThemeToggle/>
  </div>
</header>
```

### Sidebar

* Width `w-64`, collapsible.
* Groups: **Project**, **Scenes**, **Chapters**, **Codegen**, **Settings**.
* On mobile: hidden, open via drawer.

```html
<aside class="h-full overflow-auto p-3 bg-gray-50 dark:bg-gray-950">
  <ul class="space-y-1 text-sm">
    <li><RouterLink to="/dashboard" class="nav-item">Dashboard</RouterLink></li>
    <li><RouterLink to="/scenes" class="nav-item">Scenes</RouterLink></li>
    <li><RouterLink to="/chapters" class="nav-item">Chapters</RouterLink></li>
    <li><RouterLink to="/code" class="nav-item">C code</RouterLink></li>
    <li><RouterLink to="/settings" class="nav-item">Settings</RouterLink></li>
  </ul>
</aside>
```

**Tailwind helper**

```css
/* nav item utility (add via @layer components) */
.nav-item{@apply flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 aria-[current=page]:bg-gray-200 dark:aria-[current=page]:bg-gray-700}
```

### Main content & grid

* Use fluid grids, not fixed cards.
* Example dashboard grid that grows on ultrawide:

```html
<section class="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-min">
  <!-- cards -->
</section>
```

* Avoid center max‑width. If a view benefits from max width (e.g., prose), limit that **inside** the view, not globally.

---

## 3) Resizable panels (editor views)

Use CSS grid or a small splitter lib. Example with CSS grid areas:

```html
<div class="grid h-full grid-rows-[auto,1fr] grid-cols-[280px_1fr_360px] md:grid-cols-[320px_1fr_420px]">
  <Toolbar class="row-start-1 col-span-3"/>
  <Outline class="row-start-2 col-start-1 overflow-auto border-r"/>
  <Editor  class="row-start-2 col-start-2 overflow-auto"/>
  <Inspector class="row-start-2 col-start-3 overflow-auto border-l"/>
</div>
```

Optional: add a splitter (e.g., `vue-split-panel`) for drag resize.

---

## 4) Theme system (Tailwind + Vue)

### Tailwind config

```js
// tailwind.config.js
export default {
  darkMode: 'class',
  content: ['./index.html','./src/**/*.{vue,js,ts}'],
  theme: { extend: {}} ,
  plugins: [
    // optional: tailwind-typography, tailwindcss-animate
  ]
}
```

### Minimal ThemeToggle component

```vue
<script setup>
import { ref, watchEffect } from 'vue'
const dark = ref(
  localStorage.theme === 'dark' || (
    !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
)
watchEffect(() => {
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.theme = dark.value ? 'dark' : 'light'
})
</script>
<template>
  <button @click="dark=!dark" class="px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
    <span v-if="dark">🌙</span><span v-else>☀️</span>
  </button>
</template>
```

**Semantic tokens (optional)**: create CSS variables for colors so runtime theming is easier.

```css
:root{--surface:255 255 255; --surface-2:249 250 251; --text:17 24 39}
.dark{--surface:17 24 39; --surface-2:15 23 42; --text:243 244 246}
.card{@apply bg-[rgb(var(--surface))] text-[rgb(var(--text))]}
```

---

## 5) Remove website constraints

* Delete site‑wide `.container` / `max-w-*` wrappers.
* Use `h-screen w-screen` at root; children fill with `flex` + `overflow-*`.
* Replace page‑level margins with internal padding in `<main>`.
* Cards should use `h-full` when appropriate so rows align on ultrawide.

---

## 6) Mobile & tablet behavior

* Header remains; sidebar becomes drawer (modal sheet) with focus trap.
* Main gets `p-3` mobile, `p-6` desktop.
* Panels stack vertically; inspector collapses behind a tab bar.
* Critical actions available from header kebab menu.

---

## 7) Accessibility & shortcuts

* Landmarks: `header`, `aside`, `main`.
* Skip link: `a[href="#main"]` visible on focus.
* Visible focus rings: `focus:outline-none focus:ring-2 focus:ring-indigo-500`.
* Keyboard: `/` to focus search, `Ctrl/Cmd+K` command palette (optional), `[` `]` navigate chapters.

---

## 8) Example: Dashboard cards (app‑style)

```html
<section aria-label="Stats" class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
    <div class="text-sm text-gray-500 dark:text-gray-400">Scenes</div>
    <div class="text-3xl font-semibold">0</div>
  </div>
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
    <div class="text-sm text-gray-500 dark:text-gray-400">Chapters</div>
    <div class="text-3xl font-semibold">2</div>
  </div>
  <div class="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
    <div class="text-sm text-gray-500 dark:text-gray-400">Status</div>
    <div class="text-xl">Online</div>
  </div>
</section>
```

---

## 9) Migration steps (quick wins)

1. **Root container**: Replace current centered container with AppShell scaffold above.
2. **Kill max‑widths**: Remove `container max-w-...` from top‑level views.
3. **Introduce ThemeToggle** and `darkMode:'class'` in Tailwind.
4. **Sidebar**: Move nav out of header; add drawer on mobile.
5. **Dashboard grid**: Swap to fluid grid with `xl/2xl` extensions.
6. **Scroll strategy**: Ensure only `<main>` scrolls; test on mobile/desktop.
7. **QA**: ultrawide (≥1920), 1440p, 1280, 768, 375; light/dark; keyboard.

---

## 10) Done‑definition checklist

* [ ] No page‑level max‑width; app fills ultrawide.
* [ ] Header sticky; sidebar collapsible; main scrolls.
* [ ] Theme toggle persists; respects system preference on first load.
* [ ] Grids scale up to 2xl/3xl without awkward whitespace.
* [ ] Mobile drawer for sidebar; focus trapped; ESC closes.
* [ ] A11y landmarks + skip link + focus styles.
* [ ] Lint: no horizontal overflow; no double scrollbars.

---

## 11) Optional enhancements

* Command palette (Fuse.js) on `Ctrl/Cmd+K`.
* Toasts for save/sync.
* Floating panel layout presets (Editor‑Left, Editor‑Right, Focus).
* Persisted layout (panel widths, open tabs) via `localStorage` or store.

---

**Summary**: Adopt the app‑shell layout and dark mode above to transform Loke Cards into a full‑screen, desktop‑class web app that scales cleanly from mobile to ultrawide without the website‑style constraints.
