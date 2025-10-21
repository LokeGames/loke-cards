# Refactoring Plan: Modularize `loke-cards`

This document outlines the plan to refactor the `loke-cards` project into a more modular, monorepo-like structure. The goal is to improve clarity, separation of concerns, and maintainability.

## Target Directory Structure

The final project structure will be organized as follows:

```
/loke-cards
├── /cards-vue/       # (a) Main Vue application (legacy artifact)
├── /graph-vue/       # (b) Graph visualization Vue application
├── /server/          # (c) C++ backend server (no changes needed)
├── /shared-vue/      # (d) Shared Vue components, composables, and libs (legacy artifact)
├── /doc/             # Documentation
├── /node_modules/    # Root node modules
├── package.json      # Root package.json
└── ...               # Other root config files (vite, tailwind, etc.)
```

## Refactoring Steps

### 1. Create New Directory Structure

*   [ ] Create `cards-vue` directory.
*   [ ] Create `graph-vue` directory.
*   [ ] Create `shared-vue` directory.

### 2. Relocate Existing Code

*   **`/cards-vue` (Main App):**
    *   [ ] Move the contents of `src/` into `cards-vue/src/`.
    *   [ ] Move `index.html` to `cards-vue/index.html`.
    *   [ ] Move relevant tests from `tests/` to `cards-vue/tests/`.
    *   [ ] Create `cards-vue/package.json` and `cards-vue/vite.config.js`.

*   **`/graph-vue` (Graph App):**
    *   [ ] Move the contents of `apps/graph/` into `graph-vue/`.
    *   [ ] Move relevant tests from `tests/graph/` to `graph-vue/tests/`.
    *   [ ] Ensure `graph-vue` has its own `package.json` and `vite.config.js`.

*   **`/shared-vue` (Shared Code):**
    *   [ ] Identify and move shared components from `src/components/` to `shared-vue/src/components/`.
    *   [ ] Identify and move shared composables/libs from `src/lib/`, `src/composables/` etc. to `shared-vue/src/`.
    *   [ ] Set up `shared-vue` as a proper package with its own `package.json`.

### 3. Update Build and Configuration

*   [ ] Modify the root `package.json` to use workspaces (e.g., with npm, yarn, or pnpm) to manage the sub-projects.
*   [ ] Update `cards-vue` and `graph-vue` applications to import dependencies from `shared-vue`.
*   [ ] Adjust Vite configurations (`vite.config.js`) in each sub-project to handle the new paths and dependencies.
*   [ ] Update Playwright test configurations (`playwright.config.js`) to find tests in their new locations.
*   [ ] Update `eslint.config.js`, `prettierrc`, `tsconfig.json` to work across the monorepo.

### 4. Clean Up Root Directory

*   [ ] After moving all relevant files, remove the old `src/`, `apps/`, `tests/` (except for root-level tests if any), and other now-empty or redundant directories from the project root.
*   [ ] Verify that the `server/` and `doc/` directories are untouched as requested.

### 5. Verification

*   [ ] Run `npm install` from the root to install dependencies for all workspaces.
*   [ ] Run `npm run dev` for `graph-vue` and ensure it runs correctly.
*   [ ] Run `graph-vue` tests and confirm they pass.
*   [ ] Run `npm run build` for `graph-vue` and verify the output.

# Part 2: Port Vue projects to Svelte

After the initial file relocation is complete, the next phase is to port the Vue-based applications to Svelte. `cards-vue` will be the source for a new Svelte application, and `graph-vue` will be ported later.

## Svelte Porting Steps

### 1. Setup New Svelte Project Structure

*   [ ] Create a new `/cards` directory for the Svelte main application.
*   [ ] Create a new `/shared` directory for shared Svelte components and logic.
*   [ ] Initialize a Svelte + Zoe project inside `/cards`.
*   [ ] Set up `/shared` as a library/package that can be consumed by `/cards`.

### 2. Port `shared-vue` to `shared` (Svelte)

*   [ ] Systematically port shared components, composables, and libraries from `shared-vue` to Svelte equivalents in `/shared`.
    *   [ ] Convert Vue components to Svelte components.
    *   [ ] Adapt Vue composables to Svelte stores or modules.
    *   [ ] Ensure all business logic is preserved.

### 3. Port `cards-vue` to `cards` (Svelte)

*   [ ] Port the application structure, routing, and views from `cards-vue` to the new Svelte project in `/cards`.
*   [ ] Replace Vue components with their new Svelte counterparts from `/shared` and `/cards`.
*   [ ] Ensure the new Svelte application (`/cards`) correctly communicates with the existing C++ server backend.
*   [ ] **New Drawer Menu:** Implement a new responsive drawer menu system, replacing the old side panel.
    *   [ ] **Core Principle:** Use a single, unified menu component that adapts its behavior based on screen size (responsive).
    *   [ ] **Desktop:** The menu appears as a permanently visible side panel. It can be collapsed into a smaller icon bar.
    *   [ ] **Mobile/Tablet:** The menu is hidden by default and toggled by a burger/close icon. When opened, it slides in as an overlay.
    *   [ ] **Unified State:** Use a single set of components and state for all views to ensure consistency. The burger icon is a toggle for the menu's visibility, not a separate menu.

### 4. Update Build & Workspace Configuration

*   [ ] Add the new `/cards` and `/shared` packages to the root `package.json` workspaces.
*   [ ] Remove the old `cards-vue` and `shared-vue` projects from the build process and workspaces.
*   [ ] Ensure the root build, test, and lint commands are updated for the new Svelte projects.

### 5. Verification

*   [ ] Run `npm install` from the root.
*   [ ] Run `npm run dev` for `/cards` and ensure the Svelte app runs correctly.
*   [ ] Write and run tests for the new Svelte application.
*   [ ] Confirm that all original functionality from `cards-vue` is present and working in the new `/cards` Svelte app.
