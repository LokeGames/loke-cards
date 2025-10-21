# Master Plan: PWA Shell & Micro-App Architecture

This document outlines the definitive plan for restructuring the Loke project into a modern, performant, and scalable PWA. It is based on the architecture defined in `doc/FUTURE/pwa-setup.md` and supersedes all previous TODO files.

The core concept is a central PWA "shell" that lazy-loads independent UI applications (`cards` and `graph`), with all data managed by a dedicated, non-blocking web worker.

## Architectural Roles

- **`/apps/front` (The PWA Shell):** A SvelteKit application that acts as the main entry point. Its responsibilities are:
    - Rendering the main app layout (header, app switcher, etc.).
    - Handling routing and lazy-loading the micro-apps.
    - Managing the overall theme (Tailwind CSS, dark/light mode).
    - Initializing the Service Worker and managing the PWA lifecycle.
    - **It does NOT handle data logic directly.**

- **`/apps/cards` & `/apps/graph` (Micro-Apps):** Independent Svelte libraries containing only UI components for their specific domain. They are completely stateless and receive all data by making RPC calls to the data worker.

- **`/workers/data` (The Data Layer):** A `SharedWorker` that is the single source of truth for all application data. Its responsibilities are:
    - Running a WASM-powered SQLite database (e.g., `wa-sqlite`).
    - Exposing a clear, typed RPC API (using Comlink) for the UI apps to consume (e.g., `data.cards.list()`, `data.scenes.update()`).
    - Handling all synchronization logic with the backend server.
    - Managing offline capabilities and data conflicts.

- **`/packages/schemas`:** A shared package containing Zod schemas for all data types, ensuring type safety between the worker and the UI apps.

---

## UI/UX Design & Layout Specification

This section, derived from `doc/doc-vue/vue-layout.md`, defines the core UI/UX principles for the Svelte-based PWA shell (`/apps/front`).

**Core Design Principles:**
*   **Full Screen:** The application must always occupy the full `100vw` and `100vh` of the viewport. No `max-w-` containers at the root level.
*   **App Shell:** The layout must consist of a stable header and sidebar. Only the main content area should scroll, not the entire page.
*   **Responsive App, Not Page:** The layout adapts to different screen sizes, but content should fill the available space rather than narrowing to a single centered column on wide screens.
*   **Themeable:** A light/dark mode must be implemented using Tailwind's `class` strategy. The user's choice must be persisted in `localStorage`.
*   **Keyboard-Friendly:** All interactive elements must be accessible via keyboard, with clear focus rings and proper ARIA landmarks.

**Layout Structure (`/apps/front`):**
*   **`AppShell` (root `+layout.svelte`):**
    *   A `flex flex-col` container at `h-screen w-screen`.
    *   Contains the `AppHeader` and a body `div`.
*   **`AppHeader`:**
    *   A sticky top bar containing the app switcher, breadcrumbs, status indicators, and the theme toggle.
*   **`ShellBody`:**
    *   A `flex flex-1 overflow-hidden` container.
    *   Contains the `AppSidebar` and the `AppMain` content area.
*   **`AppSidebar`:**
    *   A fixed-width sidebar on desktop (`w-64`).
    *   A slide-in drawer on mobile, controlled by a store.
*   **`AppMain` (`<slot />`):**
    *   The main content area, which must be `flex-1 overflow-auto` to enable internal scrolling.

---

## Development Plan (TDD Approach)

The entire process will follow a Test-Driven Development (TDD) paradigm.

### Phase 1: Project Scaffolding

*   [x] **Setup:**
    *   [x] Initialize a new `pnpm` workspace in the root.
    *   [x] Create the new directory structure: `/apps/front`, `/apps/cards`, `/apps/graph`, `/workers/data`, `/packages/schemas`.
*   [x] **Create `package.json` for each workspace:**
    *   [x] `/apps/front`: SvelteKit application.
    *   [x] `/apps/cards`: Svelte library.
    *   [x] `/apps/graph`: Svelte library.
    *   [x] `/workers/data`: Generic TypeScript project.
    *   [x] `/packages/schemas`: Generic TypeScript project.
    *   [x] `/packages/ui`: Svelte UI library (placeholder).

### Phase 2: The Data Worker (`/workers/data`)

*   [ ] **Setup Worker & RPC:**
    *   [x] Set up a basic `SharedWorker`.
    *   [x] Define an initial RPC API structure (custom, no deps) and expose it from the worker.
    *   [x] Define data contracts in `/packages/schemas` using TypeScript (Zod pending).
*   [ ] **Database Integration (TDD):**
    *   [x] Write tests for basic CRUD (`cards.create/get/list/update/delete`, `chapters.create/get/list/update/delete`).
    *   [ ] Implement `wa-sqlite` or similar WASM SQLite library.
    *   [x] Implement in-memory stubs for CRUD to pass tests.
    *   [ ] Continue with `get`, `list`, `update`, `delete` for scenes and chapters, writing tests first for each.

### Phase 3: The PWA Shell (`/apps/front`)

*   [ ] **Build the Shell UI (TDD):**
    *   [ ] Implement the layout according to the **"UI/UX Design & Layout Specification"** above.
    *   [ ] Create the main `+layout.svelte` with the `AppHeader` and `AppSidebar` components.
    *   [ ] Implement the theme toggle and ensure Tailwind CSS dark mode works and persists.
*   [ ] **Worker Integration:**
    *   [ ] Write code to connect to the `SharedWorker` on startup.
    *   [ ] Create a Svelte store to hold the Comlink RPC proxy, making it available to child apps.
*   [ ] **Routing & Lazy Loading:**
    *   [ ] Set up routes for `/cards` and `/graph`.
    *   [ ] Implement dynamic `import()` to lazy-load the respective micro-apps when their route is activated.

### Phase 4: Porting `/apps/cards`

This phase ports the Vue components from the original `cards-vue` application to a new, stateless Svelte micro-app in `/apps/cards`. All data access will be refactored to use the RPC API provided by the `/workers/data` layer.

*   **Sub-Phase 4.1: Port Core UI Components**
    *   [ ] **Port `AppLayout.vue` -> `+layout.svelte`:**
        *   Create the root layout for the `cards` app.
        *   *TDD:* Test that the layout renders its slot and contains the main UI shell components.
    *   [ ] **Port `AppHeader.vue` -> `CardsHeader.svelte`:**
        *   Port child components (`StatusPill`, `NetworkToggle`, etc.) first.
        *   Connect UI elements to the data worker (e.g., sync status).
        *   *TDD:* Test that breadcrumbs are correct and UI buttons dispatch correct events/calls.
    *   [ ] **Port `AppSidebar.vue` -> `CardsSidebar.svelte`:**
        *   Implement the drawer menu concept.
        *   Connect navigation links to the SvelteKit router.
        *   *TDD:* Test visibility toggle and correct link rendering.
    *   [ ] **Port `AppModal.vue` -> `AppModal.svelte`:**
        *   Create as a generic, reusable modal in a new `/packages/ui` library.
        *   *TDD:* Test open/close state and event dispatching.

*   **Sub-Phase 4.2: Port Editor Form Components**
    *   [ ] **Port `SceneIdInput.vue`:**
        *   *TDD:* Test C identifier validation logic.
    *   [ ] **Port `ChapterSelect.vue`:**
        *   Refactor to fetch chapters from the data worker: `await data.chapters.list()`.
        *   *TDD:* Test that chapters are listed correctly.
    *   [ ] **Port `SceneTextEditor.vue`:**
        *   *TDD:* Test character counter and limits.
    *   [ ] **Port `ChoicesList.vue` & `StateChangesList.vue`:**
        *   Port the dynamic list management logic.
        *   *TDD:* Test adding/removing items from the lists.
    *   [ ] **Port `CodePreview.vue`:**
        *   Refactor C code generation to be a pure function that takes scene data as input.
        *   The data will be fetched from the worker by the parent editor component.
        *   *TDD:* Test that given a scene object, the correct C code is generated.

*   **Sub-Phase 4.3: Port Views and Integrate**
    *   [ ] **Port `SceneEditorView.vue`:**
        *   Rebuild the editor view using the newly ported Svelte form components.
        *   **Crucially, all data loading and saving must go through the worker's RPC API.**
        *   `loadScene()` will call `await data.scenes.get(id)`.
        *   `saveScene()` will call `await data.scenes.update(sceneObject)`.
        *   *TDD:* Write E2E tests to create a new scene, edit it, save it, and verify the data is persisted correctly by querying the worker.
    *   [ ] **Port List Views (`SceneListView.vue`, `ChapterListView.vue`):**
        *   Refactor to fetch all data from the worker.
        *   *TDD:* Test that the lists render the correct number of items returned by the worker.
    *   [ ] **Integrate with Shell:**
        *   Ensure the completed `/cards` app correctly lazy-loads within the `/front` shell.
        *   Verify that all data flows correctly from the worker to the UI and back.

### Phase 5: Porting `/apps/graph` (from Vue Flow to LiteGraph.js)

This phase ports the graph visualization to a new Svelte-based micro-app, replacing the Vue Flow engine with the more performant LiteGraph.js. It will follow a strict TDD workflow and aims to replicate and enhance the functionality described in the original Vue graph plan.

*   **Sub-Phase 5.1: Core Architecture & Setup**
    *   [ ] **Setup LiteGraph.js:**
        *   [ ] Install `litegraph.js` in the `/apps/graph` workspace.
        *   [ ] Create a Svelte component to host the `LGraphCanvas`.
        *   [ ] Initialize the canvas in `onMount` with a background grid.
    *   [ ] **Data Model & Worker Integration:**
        *   [ ] Define the `GraphJSON` data structures in `/packages/schemas`.
        *   [ ] Implement the `data.graph.getProjectGraph()` method in the data worker, which respects the currently active project ID.
        *   [ ] Implement a read-only loader in the `/apps/graph` UI that fetches data from the worker and displays it.
    *   [ ] **Implement Core Node Types (TDD):**
        *   [ ] Write Vitest unit tests for `SceneNode` and `ChapterNode` classes.
        *   [ ] Create `LGraphNode` classes for these concepts. `ChapterNode` should function as a container/group.
        *   [ ] Register the custom nodes with LiteGraph.js.

*   **Sub-Phase 5.2: Global Graph View**
    *   [ ] **Implement Global Graph Rendering:**
        *   [ ] Render all chapters as large container nodes.
        *   [ ] Render all scenes as smaller nodes within their respective chapter containers.
        *   [ ] Render all links/edges between scenes, both within and between chapters.
    *   [ ] **Implement Basic Interactions (TDD):**
        *   [ ] Write Playwright tests for core interactions.
        *   [ ] Enable pan and zoom on the canvas.
        *   [ ] Enable dragging/moving of scene and chapter nodes.
        *   [ ] On drag-stop, persist the new `position` to the database via the data worker.
    *   [ ] **Implement Navigation:**
        *   [ ] On double-click of a `ChapterNode`, navigate to the focused Chapter Graph view.
    *   [ ] **Implement UI Controls:**
        *   [ ] Add a minimap for quick navigation.
        *   [ ] Add zoom and fit-to-view controls.
        *   [ ] Add a (currently disabled) "Auto-Layout" button.

*   **Sub-Phase 5.3: Chapter Graph View (Focused)**
    *   [ ] **Implement Chapter Graph Rendering:**
        *   [ ] Create a new route/view that accepts a chapter ID.
        *   [ ] Display *only* the scenes belonging to the selected chapter.
        *   [ ] Render only the links between scenes *within* that chapter.
    *   [ ] **Implement Editing Interactions (TDD):**
        *   [ ] **Link Creation:** Enable creating new links between scenes by dragging from a node's output slot to another's input slot. Persist the new link via the data worker.
        *   [ ] **Node/Link Deletion:** Enable deleting nodes and links using the `delete` key or a context menu action. Persist changes via the worker.
        *   [ ] **Node Editor:** On click of a scene node, open a properties panel (or modal) to edit its details (title, text, etc.).
        *   [ ] **Context Menu:** Implement a right-click context menu on the canvas to create new scenes.

*   **Sub-Phase 5.4: Data Sync & Finalization**
    *   [ ] **Project Syncing:**
        *   [ ] Ensure the graph app listens for project change events from the `/front` shell.
        *   [ ] On project change, reload the graph with data for the new project ID from the worker.
    *   [ ] **Testing & Verification:**
        *   [ ] Write E2E tests (Playwright) for the key user stories:
            *   Global graph renders correctly.
            *   Navigation to chapter view works.
            *   Creating/deleting a scene and a link in the chapter view persists after a reload.
    *   [ ] **Cleanup:**
        *   [ ] Remove all `vue-flow` dependencies and the old `/graph-vue` directory.
        *   [ ] Update `CHANGELOG.md` with the successful migration of the graph module.

### Phase 6: PWA Features & Finalization

*   [ ] **Implement Service Worker:**
    *   [ ] Use `vite-plugin-pwa` to set up caching for the application shell and assets.
    *   [ ] Define a network-first or stale-while-revalidate strategy for data.
*   [ ] **E2E Testing (Playwright):**
    *   [ ] Write end-to-end tests that cover user flows across both `cards` and `graph` apps.
    *   [ ] Create tests specifically for offline functionality, verifying that the app works without a network connection.
*   [ ] **Cleanup:**
    *   [ ] Remove the old `TODO-FRONT.md` and `TODO-CARDS.md` files, as this file is now the master plan.
