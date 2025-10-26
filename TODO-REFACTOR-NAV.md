# TODO: Refactor Navigation to a Module-Driven System

This document captures the new plan for decoupling navigation so that each feature module owns its internal layout while `apps/front` remains the host shell.

## 1. The Goal

We want a navigation model where:

-   `apps/front` supplies the global chrome (header, toasts, theming) and an icon-based top navigation bar.
-   Feature modules opt into the top navigation by exporting a **module definition** (id, label, icon, loader).
-   When a module becomes active, `front` simply mounts its exported **view component**, and that component renders its own internal navigation using shared UI primitives and the global theme.

This keeps the shell lightweight, reduces cross-app wiring, and lets each module evolve its internal UX independently while still feeling cohesive.

## 2. Refactoring Plan

### Phase 1: Shared UI & Front Module API

-   [ ] **Create `TopNavBar.svelte`** in `packages/ui`: renders a list of modules + shell actions (e.g. Settings, theme toggle) using props only.
-   [ ] **Create `AppShell.svelte`** in `packages/ui`: hosts header, top nav, and a `<slot>` (or `<svelte:component>`) for the active module view. No module-specific knowledge.
-   [ ] **Introduce a Front Module API** (new `packages/front-api` or similar):
    -   Define `FrontModuleDefinition` type: `{ id, label, icon, loadView, defaultPath?, order? }`.
    -   Provide helpers for feature packages to register definitions while enforcing shell theme usage.
-   [ ] Ensure docs in UI/API packages explain required theme classes/tokens so feature modules stay on-brand.

### Phase 2: Refactor `apps/front`

-   [ ] **Update `apps/front/src/routes/+layout.svelte`**:
    -   Import the new `AppShell`.
    -   Load available module definitions (static import list for now; future: discovery/registry).
    -   Append shell-only actions (Settings, Theme Switcher) to the top bar.
    -   Determine the active module from the current route segment (e.g. `/cards/...` -> module `cards`).
    -   Lazy-load the module’s view via `loadView()` and render it inside `AppShell`.
    -   Keep responsibility for global header, project picker, toasts, and theme state.
-   [ ] Simplify/retire the old `AppSidebar` usage once modules own their internal nav.

### Phase 3: Update Feature Modules

-   [ ] **`apps/cards`** (pilot implementation):
    -   Export a `cardsFrontModule: FrontModuleDefinition`.
    -   Supply an icon/label used by the top nav.
    -   Provide a `CardsModuleView.svelte` (or similar) that orchestrates the cards-specific pages and internal navigation.
    -   Consume shared theme tokens/components instead of local styling overrides.
-   [ ] Document the expected folder structure & naming for module views so new modules follow the same contract.
-   [ ] (Later) Apply the same pattern to additional feature apps (`graph`, etc.).

### Phase 4: Documentation & Housekeeping

-   [ ] **Update `packages/ui/README.md`** with the new shell/top-nav components and usage examples.
-   [ ] **Update `apps/front/README.md`** to clarify that it is the host shell, not a menu composer.
-   [ ] **Update `apps/cards/README.md`** (and other feature READMEs) to describe exporting `FrontModuleDefinition` and owning internal navigation.
-   [ ] **Update `ISSUES.md`** to reference this refactor and track completion.

### Phase 5: Validation & Feedback

-   [ ] **TDD Guardrails**: Add unit tests for the FrontModule API, `TopNavBar`, and module activation logic.
-   [ ] **End-to-End Navigation Test**: Extend Playwright/Vitest coverage to exercise switching modules and the Cards internal sidebar flow.
-   [ ] **Iterative Reviews**: Schedule checkpoints with product/UX (and you) after (a) shell nav is in place and (b) Cards module view is integrated, to confirm UX direction.
-   [ ] **Telemetry/Logging (optional)**: Add lightweight logging or feature flags so we can dogfood the new nav before fully flipping over (if needed).

### Phase 6: Documentation & Housekeeping

-   [ ] **Update `packages/ui/README.md`** with the new shell/top-nav components and usage examples.
-   [ ] **Update `apps/front/README.md`** with the new shell/top-nav components and usage examples.
-   [ ] **Update `apps/cards/README.md`** with the new shell/top-nav components and usage examples.
-   [ ] **Update CHANGELOG.md** with the new shell/top-nav components and usage examples.
## 3. Architectural Outcome

-   `apps/front` = host shell: owns theme, layout chrome, top-level actions, and module activation.
-   `packages/ui` = shared building blocks: top nav, shell layout, icons, toasts, etc.
-   Each feature app exports a single `FrontModuleDefinition` powering its top-nav entry and delivers a view component that manages its own navigation and routes.
-   Adding a new module means adding one definition + view component—no shell rewiring. The shell remains stable while feature teams iterate freely inside their modules.
