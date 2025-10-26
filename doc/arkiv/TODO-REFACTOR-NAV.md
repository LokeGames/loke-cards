# TODO: Refactor Navigation to a Module-Driven System

This document captures the new plan for decoupling navigation so that each feature module owns its internal layout while `apps/front` remains the host shell.

## ⭐ Design Feedback (2025-10-26)

**User loves the dual-level topbar design:**
- Top level (AppHeader): "Loke Cards" title + theme toggle + project picker
- Second level (TopNavBar): Dashboard icon (far left) + module tabs (Cards, Chapters) + actions (Settings)

This two-tier navigation provides clear visual hierarchy and excellent UX. Keep this pattern!

## 1. The Goal

We want a navigation model where:

-   `apps/front` supplies the global chrome (header, toasts, theming) and an icon-based top navigation bar.
-   Feature modules opt into the top navigation by exporting a **module definition** (id, label, icon, loader).
-   When a module becomes active, `front` simply mounts its exported **view component**, and that component renders its own internal navigation using shared UI primitives and the global theme.

This keeps the shell lightweight, reduces cross-app wiring, and lets each module evolve its internal UX independently while still feeling cohesive.

## 2. Refactoring Plan

### Phase 1: Shared UI & Front Module API ✅ COMPLETED

-   [x] **Create `TopNavBar.svelte`** in `packages/ui`: renders a list of modules + shell actions (e.g. Settings, theme toggle) using props only.
-   [x] **Create `AppShell.svelte`** in `packages/ui`: hosts header, top nav, and a `<slot>` (or `<svelte:component>`) for the active module view. No module-specific knowledge.
-   [x] **Introduce a Front Module API** (new `packages/front-api` or similar):
    -   Define `FrontModuleDefinition` type: `{ id, label, icon, loadView, defaultPath?, order? }`.
    -   Provide helpers for feature packages to register definitions while enforcing shell theme usage.
-   [x] **Dashboard icon added** to TopNavBar (far left) linking to ProjectDashboard view.

### Phase 2: Refactor `apps/front` ✅ COMPLETED

-   [x] **Update `apps/front/src/routes/+layout.svelte`**:
    -   Import the new `AppShell`.
    -   Load available module definitions (static import from `$lib/front-modules`).
    -   Append shell-only actions (Settings, Theme Toggle) to the top bar.
    -   Determine the active module from the current route segment using `$derived.by()`.
    -   Lazy-load the module's view via `loadView()` and render it inside `AppShell`.
    -   Keep responsibility for global header, project picker, toasts, and theme state.
    -   **Dual-topbar system**:
      - Top level: `AppHeader` with app title, theme toggle, project picker (when applicable)
      - Second level: `TopNavBar` inside `AppShell` with dashboard icon + module tabs + actions
-   [x] Simplify/retire the old `AppSidebar` usage once modules own their internal nav.
-   [x] Fixed Svelte 5 reactivity with `projectState` object pattern for project switching.

### Phase 3: Update Feature Modules ✅ COMPLETED (Cards pilot)

-   [x] **`apps/cards`** (pilot implementation):
    -   Export a `cardsFrontModule: FrontModuleDefinition` from `apps/cards/src/module/index.ts`.
    -   Supply a Folder icon/label "Cards" used by the top nav.
    -   Provide a `CardsModuleView.svelte` that orchestrates the cards-specific pages and internal navigation.
    -   Uses `$derived.by()` for reactive route segment parsing.
    -   Consume shared theme tokens/components from `packages/ui`.
    -   Fixed Svelte 5 `$derived` syntax issues.
-   [x] Document the expected folder structure & naming for module views so new modules follow the same contract.
-   [ ] (Future) Apply the same pattern to additional feature apps (`graph`, etc.).

### Phase 4: Documentation & Housekeeping ✅ COMPLETED

-   [x] **Update `packages/ui/README.md`** with the new shell/top-nav components and usage examples.
-   [x] **Update `apps/front/README.md`** to clarify that it is the host shell, not a menu composer.
-   [x] **Update `apps/cards/README.md`** (and other feature READMEs) to describe exporting `FrontModuleDefinition` and owning internal navigation.
-   [x] **Update `ISSUES.md`** to reference this refactor and track completion. (ISSUES.md created with refactor tracking)
-   [x] **Document migration notes** so legacy routes know how to hook into the new module shell. (STABILITY-GUIDE.md covers this)

### Phase 5: Validation & Feedback

-   [ ] **TDD Guardrails**: Add unit tests for the FrontModule API, `TopNavBar`, and module activation logic.
-   [ ] **End-to-End Navigation Test**: Extend Playwright/Vitest coverage to exercise switching modules and the Cards internal sidebar flow.
-   [ ] **Iterative Reviews**: Schedule checkpoints with product/UX (and you) after (a) shell nav is in place and (b) Cards module view is integrated, to confirm UX direction.
-   [ ] **Telemetry/Logging (optional)**: Add lightweight logging or feature flags so we can dogfood the new nav before fully flipping over (if needed).

### Phase 6: Rollout & Adoption

-   [ ] **Flagged rollout**: Ship behind an environment flag so the new shell can be flipped per workspace.
-   [ ] **Support playbook**: Share a short guide with customer support outlining the new navigation patterns.
-   [ ] **Measure adoption**: Capture basic telemetry (module switches, fallback hits) to validate UX assumptions.
-   [ ] **Update CHANGELOG.md** once the new shell reaches general availability.
## 3. Architectural Outcome

-   `apps/front` = host shell: owns theme, layout chrome, top-level actions, and module activation.
-   `packages/ui` = shared building blocks: top nav, shell layout, icons, toasts, etc.
-   Each feature app exports a single `FrontModuleDefinition` powering its top-nav entry and delivers a view component that manages its own navigation and routes.
-   Adding a new module means adding one definition + view component—no shell rewiring. The shell remains stable while feature teams iterate freely inside their modules.
