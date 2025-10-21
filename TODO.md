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
    *   [x] Define the initial RPC API structure with Comlink and expose it from the worker.
    *   [x] Define data contracts in `/packages/schemas` using Zod.
*   [ ] **Database Integration (TDD):**
    *   [x] Write tests for basic CRUD (`cards.create/get/list/update/delete`, `chapters.create/get/list/update/delete`).
    *   [x] Implement `wa-sqlite` (ESM + WASM) behind a DB interface with graceful fallback to memory.
    *   [x] Implement in-memory stubs for CRUD to pass tests.
    *   [ ] Continue with `get`, `list`, `update`, `delete` for scenes and chapters, writing tests first for each.

### Phase 3: The PWA Shell (`/apps/front`)

*   [ ] **Build the Shell UI (TDD):**
    *   [x] Implement the layout according to the **"UI/UX Design & Layout Specification"** above.
    *   [x] Create the main `+layout.svelte` with the `AppHeader` and `AppSidebar` components.
    *   [x] Implement the theme toggle and ensure Tailwind CSS dark mode works and persists.
*   [ ] **Worker Integration:**
    *   [x] Write code to connect to the `SharedWorker` on startup.
    *   [x] Create a Svelte store to hold the Comlink RPC proxy, making it available to child apps.
*   [ ] **Routing & Lazy Loading:**
    *   [x] Set up routes for `/cards` and `/graph`.
    *   [x] Implement dynamic `import()` to lazy-load the respective micro-apps when their route is activated.

### Phase 4: Porting `/apps/cards`

This phase ports the Vue components from the original `cards-vue` application to a new, stateless Svelte micro-app in `/apps/cards`. All data access will be refactored to use the RPC API provided by the `/workers/data` layer.

*   **Sub-Phase 4.1: Port Core UI Components**
    *   [x] **Port `AppLayout.vue` -> `+layout.svelte`:**
        *   Create the root layout for the `cards` app.
        *   [x] *TDD:* Test that the layout renders its slot and contains the main UI shell components.
    *   [x] **Port `AppHeader.vue` -> `CardsHeader.svelte`:**
        *   Port child components (`StatusPill`, `NetworkToggle`, etc.) first.
        *   Connect UI elements to the data worker (e.g., sync status).
        *   [x] *TDD:* Test that breadcrumbs are correct and UI buttons dispatch correct events/calls.
    *   [x] **Port `AppSidebar.vue` -> `CardsSidebar.svelte`:**
        *   Implement the drawer menu concept.
        *   Connect navigation links to the SvelteKit router.
        *   [x] *TDD:* Test visibility toggle and correct link rendering.
    *   [x] **Port `AppModal.vue` -> `AppModal.svelte`:**
        *   Create as a generic, reusable modal in a new `/packages/ui` library.
        *   [x] *TDD:* Test open/close state and event dispatching.

*   **Sub-Phase 4.2: Port Editor Form Components**
    *   [x] **Port `SceneIdInput.vue`:**
        *   [x] *TDD:* Test C identifier validation logic.
    *   [x] **Port `ChapterSelect.vue`:**
        *   Refactor to fetch chapters from the data worker: `await data.chapters.list()`.
        *   [x] *TDD:* Test that chapters are listed correctly.
    *   [x] **Port `SceneTextEditor.vue`:**
        *   [x] *TDD:* Test character counter and limits.
    *   [x] **Port `ChoicesList.vue` & `StateChangesList.vue`:**
        *   Port the dynamic list management logic.
        *   [x] *TDD:* Test adding/removing items from the lists.
    *   [x] **Port `CodePreview.vue`:**
        *   Refactor C code generation to be a pure function that takes scene data as input.
        *   The data will be fetched from the worker by the parent editor component.
        *   [x] *TDD:* Test that given a scene object, the correct C code is generated.
        *   [x] Implemented as `generateC()` in `/apps/cards/src/lib/codegen.ts` with `CodePreview.svelte` component and unit tests.

*   **Sub-Phase 4.3: Port Views and Integrate**
    *   [x] **Port `SceneEditorView.vue`:**
        *   Rebuild the editor view using the newly ported Svelte form components.
        *   **Crucially, all data loading and saving must go through the worker's RPC API.**
        *   `loadScene()` will call `await data.scenes.get(id)`.
        *   `saveScene()` will call `await data.scenes.update(sceneObject)`.
        *   [x] *TDD:* E2E: create + save + verify in list (`/apps/front/tests-e2e/cards-editor.spec.ts`).
    *   [x] **Port List Views (`SceneListView.vue`, `ChapterListView.vue`):**
        *   Refactor to fetch all data from the worker.
        *   [x] *TDD:* Verify created scene appears in list (`/apps/front/src/routes/cards/scenes`).
    *   [x] **Integrate with Shell:**
        *   Ensure the completed `/cards` app correctly lazy-loads within the `/front` shell.
        *   Verify that all data flows correctly from the worker to the UI and back.

### Phase 5: Porting `/apps/graph` (from Vue Flow to LiteGraph.js)

This phase ports the graph visualization to a new Svelte-based micro-app, replacing the Vue Flow engine with the more performant LiteGraph.js. It will follow a strict TDD workflow and aims to replicate and enhance the functionality described in the original Vue graph plan.

*   **Sub-Phase 5.1: Core Architecture & Setup**
    *   [x] **Setup LiteGraph.js:**
        *   [x] Install `litegraph.js` in the `/apps/graph` workspace.
        *   [x] Create a Svelte component to host the `LGraphCanvas` (GraphCanvas.svelte) with dynamic import and test harness.
        *   [x] Initialize the canvas in `onMount` with a background grid (CSS grid baseline) and default zoom.
        *   [x] *TDD:* Unit test for GraphCanvas rendering and init stub (mocked).
    *   [x] **Data Model & Worker Integration:**
        *   [x] Define the `GraphJSON` data structures in `/packages/schemas`.
        *   [x] Implement the `data.graph.getProjectGraph()` method in the data worker.
        *   [x] Implement a read-only loader in the `/apps/graph` UI.
        *   [x] *TDD:* Test that the loader correctly fetches and displays graph data from the worker.
    *   [x] **Implement Core Node Types:**
        *   [x] Create `LGraphNode` classes for `SceneNode` and `ChapterNode`.
        *   [x] *TDD:* Vitest unit tests verify creation, titles, and IO slots.
        *   [x] Register the custom nodes with LiteGraph.js.

*   **Sub-Phase 5.2: Global Graph View**
    *   [x] **Implement Global Graph Rendering (baseline):**
        *   [x] Render counts from worker data (nodes; edges pending link derivation).
        *   [x] Render all links/edges between scenes.
        *   [x] *TDD:* Playwright test verifies node count appears after creating a scene.
    *   [ ] **Implement Basic Interactions:**
        *   [ ] Enable pan and zoom on the canvas.
        *   [ ] Enable dragging/moving of scene and chapter nodes.
        *   [ ] On drag-stop, persist the new `position` to the database via the data worker.
        *   [ ] *TDD:* Write Playwright tests for pan, zoom, and drag-and-drop, verifying that positions are updated in the worker.
    *   [ ] **Implement Navigation:**
        *   [ ] On double-click of a `ChapterNode`, navigate to the focused Chapter Graph view.
        *   [ ] *TDD:* Write a Playwright test to verify double-click navigation.
    *   [ ] **Implement UI Controls:**
        *   [ ] Add a minimap, zoom controls, and fit-to-view controls.
        *   [ ] *TDD:* Write Playwright tests to verify the functionality of each UI control.

*   **Sub-Phase 5.3: Chapter Graph View (Focused)**
    *   [x] **Implement Chapter Graph Rendering (baseline):**
        *   [x] Create a new route/view that accepts a chapter ID.
        *   [x] Display counts for scenes in the selected chapter (links pending).
        *   [x] *TDD:* Playwright test verifies node count appears for chapter view.
    *   [ ] **Implement Editing Interactions:**
        *   [ ] **Link Creation:** Enable creating new links between scenes by dragging between slots.
        *   [ ] *TDD:* Write a Playwright test for creating a link and verifying its persistence in the worker.
        *   [ ] **Node/Link Deletion:** Enable deleting nodes and links via keyboard or context menu.
        *   [ ] *TDD:* Write a Playwright test for deleting a node/link and verifying its removal from the worker.
        *   [ ] **Node Editor:** On click, open a properties panel to edit scene details.
        *   [ ] *TDD:* Write a test to verify that opening the editor and saving changes updates the node's data in the worker.
        *   [ ] **Context Menu:** Implement a right-click context menu to create new scenes.
        *   [ ] *TDD:* Write a test for creating a new scene via the context menu and verifying its existence in the worker.

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

### Phase 7: End-to-End User Acceptance Testing (UAT)

This phase focuses on manual, real-world testing of the complete, integrated application to ensure it meets user requirements and provides a cohesive experience. This replaces the original deployment phase.

*   [ ] **Define Core User Scenarios:**
    *   [ ] Document 5-10 critical user journeys. Examples:
        *   "As a writer, I want to create a new chapter, add three scenes to it, and link them together in the graph view."
        *   "As a writer, I want to edit the text of a scene and see the C-code preview update in real-time."
        *   "As a writer, I want to work offline, make changes to two scenes, and have them sync correctly when I go back online."
        *   "As a writer, I want to switch between light and dark mode and have my preference saved."
*   [ ] **Prepare a Test Build:**
    *   [ ] Create a stable, production-like build of the entire PWA.
    *   [ ] Deploy this build to a temporary, accessible environment (e.g., Netlify Drop, Vercel preview).
*   [ ] **Execute Test Scenarios:**
    *   [ ] Perform manual testing based on the defined user scenarios.
    *   [ ] Test on multiple devices and browsers (e.g., Chrome Desktop, Safari on iOS, Chrome on Android).
    *   [ ] Specifically test the PWA offline capabilities.
*   [ ] **Feedback & Iteration:**
    *   [ ] Document all bugs, UI/UX issues, and feedback in a structured format.
    *   [ ] Create new work items or bug reports for any issues discovered during testing.
    *   [ ] Plan for a follow-up UAT round after critical issues are addressed.

### Phase 8: Cross-Cutting Concerns

This phase addresses important non-functional requirements that apply across the entire application.

*   [ ] **Error Handling & Logging:**
    *   [ ] Implement a consistent error handling strategy for RPC calls between the UI and the data worker.
    *   [ ] Add error boundaries in the Svelte UI to prevent component crashes from affecting the entire app.
    *   [ ] Integrate a remote logging service (e.g., Sentry, LogRocket) to capture errors and performance metrics from production builds.
*   [ ] **Accessibility (A11y) Audit:**
    *   [ ] Go beyond keyboard navigation and conduct a full accessibility review.
    *   [ ] Test with screen readers (e.g., VoiceOver, NVDA).
    *   [ ] Ensure all components meet WCAG 2.1 AA standards for color contrast and ARIA attributes.
    *   [ ] Add automated accessibility checks to the E2E test suite using `axe-playwright`.
*   [ ] **UI State Management:**
    *   [ ] Formalize the state management strategy within UI apps.
    *   [ ] Use Svelte stores for ephemeral UI state (e.g., form inputs, modal visibility).
    *   [ ] Document the distinction between persistent data state (in the worker) and local UI state (in components/stores).

### Phase 9: Editor Upgrade (from doc/FUTURE/codemirror.md)

# Loke-Cards CodeMirror Editor Design

## Formål

Loke-Cards skal bruge en let, PWA-venlig editor til tekst- og kodebaseret indhold. Formålet er at kunne skrive og redigere **kort (cards)**, der kan indeholde:

* **Ren tekst** (scenebeskrivelser, dialoger, metadata)
* **Kodeblokke** (C, C++, Markdown, evt. Loke-script)

Dette sker i et samlet editorfelt, hvor CodeMirror bruges til at give **syntaksfremhævelse, inputstruktur og farvekodet output**.

---

## Arkitektur

### 1. Editor Component

Et `LokeCardEditor.svelte`-komponent bygges på **CodeMirror 6** med Svelte wrapperen `@replit/codemirror-svelte`.

**Hovedfunktioner:**

* Lazy-loading af editor (hurtig PWA load)
* Dynamic mode (tekst eller kode)
* Tailwind-baseret tema
* Markdown + C/C++ syntax
* Auto-save event via Svelte store

---

### 2. Datamodel for Cards

Hvert card har en struktur som:

```json
{
  "id": "card_001",
  "type": "scene",        // eller "code"
  "lang": "markdown",      // eller "cpp", "c"
  "title": "Scene 1 - The Forge",
  "content": "# Welcome to the forge\n\nYou see sparks...",
  "tags": ["intro", "dialog"]
}
```

Denne model bruges direkte i Svelte-komponenten som `bind:value`.

---

### 3. CodeMirror Setup

**Imports:**

```ts
import CodeMirror from "@replit/codemirror-svelte";
import { markdown } from "@codemirror/lang-markdown";
import { cpp } from "@codemirror/lang-cpp";
import { EditorView } from "@codemirror/view";
```

**Extensions:**

```ts
const extensions = {
  markdown: [markdown()],
  cpp: [cpp()],
  c: [cpp()],
};

const lokeTheme = EditorView.theme({
  "&": { backgroundColor: "transparent", color: "theme(colors.gray.200)" },
  ".cm-content": { fontFamily: "monospace", fontSize: "0.875rem" },
  "&.cm-focused": { outline: "none" }
});
```

---

### 4. UI Struktur i Svelte

```svelte
<script lang="ts">
  import CodeMirror from "@replit/codemirror-svelte";
  import { markdown, cpp } from "@codemirror/lang-markdown";

  export let card;

  const extensions = card.lang === "cpp" ? [cpp()] : [markdown()];
</script>

<div class="rounded-xl border border-gray-700 bg-gray-900 p-2">
  <h2 class="text-gray-300 font-bold mb-2">{card.title}</h2>
  <CodeMirror bind:value={card.content} {extensions} class="min-h-[300px]" />
</div>
```

---

### 5. Funktionelle Mål

* **Teksttilstand:** Markdown syntaks til kapitel/scene tekst, let formattering.
* **Kode-tilstand:** C/C++ syntax highlight til script/logic.
* **Auto skift:** editor skifter syntax baseret på card.lang.
* **Tailwind integration:** alt tema og spacing kommer fra Tailwind klasser.
* **Event hooks:**

  * `on:change` -> gem til IndexedDB / SQLite
  * `on:blur` -> trig test eller Loke-engine preview

---

### 6. Fremtidige Udvidelser

* Sprogsupport: JSON, Lua, LokeScript
* Split-view: tekst til venstre, kode til højre
* AI assistent: automatisk syntaksforklaring og highlight af funktioner
* Live preview af Markdown som kortlayout

---

## Konklusion

CodeMirror giver en **robust, let og fleksibel editor** der kan integreres direkte i Svelte + Tailwind. Den tillader at Loke-cards arbejder med **tekst og kode i samme system**, med farvekodning og enkel udvidelse til flere sprog og tilstande.

### Phase 10: Cast-to-TV Feature (from doc/FUTURE/cast-graph.md)

# Loke-Graph Cast System

## A. Cast-første arkitektur (Primær løsning)

**Formål:** Gør det muligt at vise og styre Loke-graph på et stort TV via Chromecast eller "Chromecast built-in" TV’er. Denne model giver fuld kontrol, høj performance og kan senere udvides til Android TV med Cast Connect.

### Komponenter

1. **Sender (PWA):**

   * Loke-graph PWA inkluderer **Google Cast Web Sender SDK**.
   * En Cast-knap vises, når der registreres Cast-understøttelse.
   * Brugeren kan vælge et tilgængeligt TV og starte en Cast-session.
   * PWA’en sender enten:

     * JSON-data om grafen, eller
     * en signerede URL med en “TV-view” af grafen.

2. **Receiver (TV-app):**

   * En **Cast Application Framework (CAF) Receiver** app kører på Chromecast eller TV’et.
   * Den loader en letvægts “TV-layout” af Loke-graph (kun visning, ingen fuld redigering).
   * Modtager realtidsdata via Cast-beskeder.
   * Renderer grafen i et fullscreen canvas/WebGL-view, optimeret til TV.

3. **Synkronisering:**

   * Sender og receiver kommunikerer via JSON-beskeder.
   * Eksempel: `{ type: 'update', nodes: [...], edges: [...] }`.
   * Data kan også hentes direkte fra en delt backend ved brug af session-ID’er.

4. **Udvidelser:**

   * **Cast Connect:** Muliggør, at Android TV-brugere åbner direkte i en Loke-graph TV-app.
   * **WebSocket bridge:** Kan supplere Cast-beskeder for hurtigere UI-opdateringer.

### Fordele

* Fuld visuel oplevelse på TV’et.
* Real-time opdateringer af graphens tilstand.
* PWA’en bevarer kontrollen (zoom, pan, fokus osv.).
* Skalerbar til multi-display og multi-user scenarier.

### Krav

* HTTPS hosting.
* `cast_sender.js` SDK importeret i PWA.
* Registreret Cast Receiver ID i Google Cast Developer Console.

---

## B. Fallbacks (Sekundær løsning)

**Formål:** Sikre at Loke-graph stadig kan vises på et TV, hvis Chromecast ikke er tilgængelig.

### 1. Presentation API

* Browseren åbner en **sekundær browserkontekst** (ekstern skærm via HDMI/Miracast/AirPlay).
* PWA’en sender en URL til denne kontekst med et “TV-view” af grafen.
* Grafen vises uden aktiv session, men opdateres periodisk eller via WebSocket.

### 2. OS-spejling

* Brugeren kan benytte OS’ens egen funktion til skærmdeling:

  * AirPlay (Apple)
  * Chromecast skærmspejling (Android/Chrome)
  * HDMI-udgang (desktop/laptop)
* Grafen vises i realtime, men uden dedikeret interaktionslag.

### 3. Remote Playback API (kun video)

* Hvis Loke-graph genererer video eller animationer, kan disse afspilles via Remote Playback API.
* Ikke egnet til interaktive grafer, men kan bruges til demo/visualiseringsoptagelser.

### Fordele

* Kræver ingen ekstra setup eller SDK.
* Virker på næsten alle platforme.
* Brugeren kan stadig se resultaterne på storskærm.

### Ulemper

* Ingen direkte data-synkronisering mellem enheder.
* Begrænset til “visning”, ikke styring.

---

## Anbefalet strategi

1. **Implementér Cast-først (A) som hovedløsning.**
   Det giver bedst UX, kontrol og performance.

2. **Tilføj Fallback (B) for bred kompatibilitet.**
   Hvis Cast ikke findes, tilbyd:

   * Presentation API (hvis browser understøtter det)
   * Ellers en “Vis på TV”-vejledning for AirPlay/Chromecast spejling.

3. **Langsigtet:**

   * Udbyg Cast Receiver til Cast Connect.
   * Tilføj en dedikeret “TV Dashboard Mode” i Loke-graph (auto fullscreen, minimal UI).

### Phase 11: Documentation & Final Cleanup

This final phase ensures the project is left in a clean, maintainable state for future development.

*   [ ] **Update Project Documentation:**
    *   [ ] Update the main `README.md` to reflect the new architecture, build process, and development workflow.
    *   [ ] Create a new architectural diagram showing the shell, micro-apps, and data worker.
    *   [ ] Write documentation for the data worker's RPC API.
*   [ ] **Final Code Cleanup:**
    *   [ ] Remove all remaining code and configuration files from the old Vue applications (`cards-vue`, `graph-vue`).
    *   [ ] Remove any feature flags or temporary code used during the migration.
    *   [ ] Run a final check for any dead code.
*   [ ] **Update `CHANGELOG.md`:**
    *   [ ] Add a comprehensive entry detailing the successful migration to the new PWA architecture.


### Phase 12: Documentation & Final Cleanup

This final phase ensures the project is left in a clean, maintainable state for future development.

*   [ ] **Update Project Documentation:**
    *   [ ] Update the main `README.md` to reflect the new architecture, build process, and development workflow.
    *   [ ] Create a new architectural diagram showing the shell, micro-apps, and data worker.
    *   [ ] Write documentation for the data worker's RPC API.
*   [ ] **Final Code Cleanup:**
    *   [ ] Remove all remaining code and configuration files from the old Vue applications (`cards-vue`, `graph-vue`).
    *   [ ] Remove any feature flags or temporary code used during the migration.
    *   [ ] Run a final check for any dead code.
*   [ ] **Update `CHANGELOG.md`:**
    *   [ ] Add a comprehensive entry detailing the successful migration to the new PWA architecture.
