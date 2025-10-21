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

*   [X] Create `cards-vue` directory.
*   [X] Create `graph-vue` directory.
*   [X] Create `shared-vue` directory.

### 2. Relocate Existing Code

*   **`/cards-vue` (Main App):**
    *   [X] Move the contents of `src/` into `cards-vue/src/`.
    *   [X] Move `index.html` to `cards-vue/index.html`.
    *   [X] Move relevant tests from `tests/` to `cards-vue/tests/`.
    *   [ ] Move `cards-vue/package.json` and `cards-vue/vite.config.js`.

*   **`/graph-vue` (Graph App):**
    *   [X] Move the contents of `apps/graph/` into `graph-vue/`.
    *   [X] Move relevant tests from `tests/graph/` to `graph-vue/tests/`.


*   **`/shared-vue` (Shared Code):**
    *   [X] Identify and move shared components from `src/components/` to `shared-vue/src/components/`.
    *   [X] Identify and move shared composables/libs from `src/lib/`, `src/composables/` etc. to `shared-vue/src/`.
    *

### 3. Update Build and Configuration

*   [X] Modify the root `package.json` to use workspaces (e.g., with npm, yarn, or pnpm) to manage the sub-projects.
*
*   [X] Adjust Vite configurations (`vite.config.js`) in each sub-project to handle the new paths and dependencies.
*   [X] Update Playwright test configurations (`playwright.config.js`) to find tests in their new locations.### 4. Clean Up Root Directory

*   [X] After moving all relevant files, remove the old `src/`, `apps/`, `tests/` (except for root-level tests if any), and other now-empty or redundant directories from the project root.
*   [ ] Verify that the `server/` and `doc/` directories are untouched as requested.

### 5. Verification



# Part 2: Port Vue projects to Svelte

After the initial file relocation is complete, the next phase is to port the Vue-based applications to Svelte. `cards-vue` will be the source for a new Svelte application, and `graph-vue` will be ported later.

## Svelte Porting Steps

**Svelte Zoe - SvelteKit based TDD porting project.**

### 1. Svelte Tooling and Testing Strategy

This project will adopt a modern, robust tooling and testing strategy based on SvelteKit defaults and industry best practices to ensure a high-quality, maintainable codebase. The entire porting process will follow a **Test-Driven Development (TDD)** paradigm. For each piece of functionality or component ported, tests will be written *first* to define the requirements, and the code will then be written to make the tests pass.

**Core Tooling:**
*   **Framework:** SvelteKit (using Vite)
*   **Unit & Component Testing:** Vitest + Svelte Testing Library
*   **E2E Testing:** Playwright
*   **API Mocking:** Mock Service Worker (MSW) for testing without the C++ backend.
*   **PWA:** `vite-plugin-pwa` for a reliable offline experience.
*   **Linting & Formatting:** Biome (or ESLint + Prettier)

**TDD Workflow for LLM Coders:**
1.  **Select a component** to port from the "Component Porting Plan".
2.  **Write a component test** (`.test.js`) using Vitest and Svelte Testing Library that asserts the component renders correctly based on its props.
3.  **Run the test** and watch it fail.
4.  **Write the Svelte component code** until the test passes.
5.  **Write Playwright E2E tests** for critical user flows involving the component.
6.  Refactor and clean up the code, ensuring all tests continue to pass.

**Testing Pyramid:**
*   **Unit/Component Tests (70%):** Fast, isolated tests for components and business logic using Vitest.
*   **Integration Tests (25%):** Tests for interactions between components, stores, and mocked APIs.
*   **E2E Tests (5%):** High-level user flow tests using Playwright to verify the application works from end to end.

### 2. Setup New Svelte Project Structure

*   [X] Create a new `/cards` directory for the Svelte main application.
*   [X] Create a new `/shared` directory for shared Svelte components and logic.
*   [X] Initialize a Svelte + Zoe project inside `/cards`.
*   [X] Set up `/shared` as a library/package that can be consumed by `/cards`.

### 3. Port `shared-vue` to `shared` (Svelte)

*   [ ] Systematically port shared components, composables, and libraries from `shared-vue` to Svelte equivalents in `/shared`.
    *   [ ] Convert Vue components to Svelte components.
    *   [ ] Adapt Vue composables to Svelte stores or modules.
    *   [ ] Ensure all business logic is preserved.

### 4. Port `cards-vue` to `cards` (Svelte)

*   [ ] Port the application structure, routing, and views from `cards-vue` to the new Svelte project in `/cards`.
*   [ ] Replace Vue components with their new Svelte counterparts from `/shared` and `/cards`.
*   [ ] Ensure the new Svelte application (`/cards`) correctly communicates with the existing C++ server backend.
*   [ ] **New Drawer Menu:** Implement a new responsive drawer menu system, replacing the old side panel.
    *   [ ] **Core Principle:** Use a single, unified menu component that adapts its behavior based on screen size (responsive).
    *   [ ] **Desktop:** The menu appears as a permanently visible side panel. It can be collapsed into a smaller icon bar.
    *   [ ] **Mobile/Tablet:** The menu is hidden by default and toggled by a burger/close icon. When opened, it slides in as an overlay.
    *   [ ] **Unified State:** Use a single set of components and state for all views to ensure consistency. The burger icon is a toggle for the menu's visibility, not a separate menu.

### 5. Update Build & Workspace Configuration

*   [X] Modify the root `package.json` to use workspaces (e.g., with npm, yarn, or pnpm) to manage the sub-projects.
*   [ ] Remove the old `cards-vue` and `shared-vue` projects from the build process and workspaces.
*   [ ] Ensure the root build, test, and lint commands are updated for the new Svelte projects.

### 6. Verification

*   [ ] Run `npm install` from the root.
*   [ ] Run `npm run dev` for `/cards` and ensure the Svelte app runs correctly.
*   [ ] Write and run tests for the new Svelte application.
*   [ ] Confirm that all original functionality from `cards-vue` is present and working in the new `/cards` Svelte app.

### Component Porting Plan (Vue to Svelte)

This section outlines the plan for porting individual Vue components to Svelte. Each component will be analyzed for its dependencies and a checklist will be created for its replacement.

#### 1. AppLayout.vue
- **Purpose:** The main application shell. Provides the overall page structure (header, sidebar, main content).
- **Dependencies:**
    - `AppHeader.vue`
    - `AppSidebar.vue`
    - `vue-router` (`router-view`)
- **Svelte Porting Plan:**
    - [ ] Create `+layout.svelte` in the root of the new SvelteKit app (`/cards/src/routes`).
    - [ ] Replicate the flexbox structure using Tailwind CSS classes.
    - [ ] Create Svelte versions of `AppHeader` and `AppSidebar`.
    - [ ] Use a `<slot />` element to render the page content (equivalent to `router-view`).
- **TDD Testing Strategy:**
    - **Component Test (Vitest):**
        - [ ] Write a test to ensure the layout renders its `<slot />`.
        - [ ] Write a test to confirm that `AppHeader` and `AppSidebar` are present in the layout.
    - **E2E Test (Playwright):**
        - [ ] An E2E test that navigates to the home page should implicitly verify this layout, checking for the header and main content area.

#### 2. AppHeader.vue
- **Purpose:** The top navigation bar. Contains the logo, breadcrumbs, and action icons.
- **Dependencies:**
    - Components: `StatusPill.vue`, `NetworkToggle.vue`, `ProjectPicker.vue`, `ThemeToggle.vue`
    - Stores: `useUiStore` (for toggling the sidebar).
    - `vue-router` (for breadcrumbs).
- **Svelte Porting Plan:**
    - [ ] Create `AppHeader.svelte` in `/shared/src/lib/components`.
    - [ ] Port child components (`StatusPill`, `NetworkToggle`, etc.) to Svelte first.
    - [ ] Create a `ui.store.js` in Svelte to manage UI state (e.g., `isSidebarOpen`). This will be a Svelte writable store.
    - [ ] Implement the breadcrumb logic using SvelteKit's `$page.url` and navigation stores.
    - [ ] The sidebar toggle button will call a function in the `ui.store.js`.
- **TDD Testing Strategy:**
    - **Component Test (Vitest):**
        - [ ] Test that the component renders the title.
        - [ ] Test that the breadcrumbs are generated correctly based on a mock navigation path.
        - [ ] Test that clicking the sidebar toggle button calls the correct store function.

#### 3. AppSidebar.vue
- **Purpose:** The main navigation sidebar/drawer.
- **Dependencies:**
    - Components: `NavLink.vue`, `SidebarMenu.vue`
    - Stores: `useUiStore` (to control visibility).
- **Svelte Porting Plan:**
    - [ ] Create `AppSidebar.svelte` in `/shared/src/lib/components`.
    - [ ] This component will implement the new "Drawer Menu" concept.
    - [ ] The visibility will be controlled by the `isSidebarOpen` value from the new Svelte `ui.store.js`.
    - [ ] The mobile view (drawer) and desktop view (fixed panel) will be handled with responsive Tailwind classes (`md:block`, etc.).
    - [ ] Port `SidebarMenu.vue` to Svelte.
- **TDD Testing Strategy:**
    - **Component Test (Vitest):**
        - [ ] Test that the sidebar is hidden by default on small screens.
        - [ ] Test that it becomes visible when the `isSidebarOpen` store value is true.
        - [ ] Test that the correct navigation links are rendered.

#### 4. AppModal.vue
- **Purpose:** A generic modal dialog component.
- **Dependencies:** None (it's a self-contained component).
- **Svelte Porting Plan:**
    - [ ] Create `AppModal.svelte` in `/shared/src/lib/components`.
    - [ ] Replicate the props (`open`, `title`).
    - [ ] Use Svelte's `on:click` for event handling (`close`, `confirm`).
    - [ ] Use a `<slot />` for the modal content.
    - [ ] This is a good candidate for a generic, reusable shared component.
- **TDD Testing Strategy:**
    - **Component Test (Vitest):**
        - [ ] Test that the modal is not in the DOM when `open` is false.
        - [ ] Test that it appears when `open` is true.
        - [ ] Test that clicking the 'Confirm' and 'Cancel' buttons dispatches the correct events.
