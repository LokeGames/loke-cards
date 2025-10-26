# Modularity Evaluation: `apps/front`, `apps/cards`, `apps/shared`

This document evaluates the current state of the modular design within the `apps/` directory, focusing on the roles of `front`, `cards`, and `shared`.

## Summary

The project aims for a modular architecture where `apps/front` is the main application shell, `apps/cards` provides a specific feature set (the "Cards" editor), and `apps/shared` provides common logic and types.

While the separation of `apps/shared` is clean and effective, the distinction between `apps/front` and `apps/cards` is unclear and problematic. **`apps/cards` is currently implemented as both a component library and a standalone SvelteKit application**, which creates redundancy and confusion.

**Conclusion:** The modular design is **not being maintained correctly** and requires refactoring to enforce clear boundaries.

## Analysis

### 1. `apps/shared` (✅ Well-designed)

This package correctly serves as a "shared kernel."

-   **Contents:** It contains only TypeScript files for shared business logic, data types, and data access (`api-client.ts`, `database.ts`, `stores/`, `types.ts`).
-   **Boundaries:** It has no UI components and is framework-agnostic (besides the Svelte-specific store, which is acceptable).
-   **Role:** It successfully provides a single source of truth for data structures and logic, consumed by other applications.

### 2. `apps/front` (✅ Mostly Correct Role)

This package acts as the main SvelteKit application shell and router.

-   **Contents:** It contains the primary `src/routes` directory that defines the application's page structure.
-   **Dependencies:** It correctly depends on `@loke/cards`, `@loke/shared`, and `@loke/ui` to compose pages.
-   **Role:** It fulfills its role as the integrator and host for the various features. For example, `apps/front/src/routes/cards/scenes/edit/[id]/+page.svelte` correctly imports and uses the `SceneEditorView` component from `@loke/apps-cards`.

### 3. `apps/cards` (❌ Confused Identity)

This package is the source of the architectural confusion. Its `package.json` describes it as a "Cards micro-app (Svelte library)," and its contents reflect this duality.

-   **As a Library (Good):**
    -   `src/components/`: Contains domain-specific Svelte components (`SceneEditorView`, `ChapterForm`, etc.) that encapsulate the "Cards" feature's UI.
    -   `src/index.ts`: Exports these components for consumption by other apps, like `apps/front`.

-   **As an App (Bad):**
    -   `src/routes/`: Contains its own SvelteKit routing structure (`+page.svelte`, `+layout.svelte`, etc.). This makes it a second, parallel web application.
    -   **Redundancy:** These routes are redundant with the routes defined in `apps/front`. For example, `apps/cards/src/routes/editor/+page.svelte` conflicts with the purpose of `apps/front/src/routes/cards/scenes/edit/[id]/+page.svelte`.
    -   **Ambiguity:** It's unclear which set of routes is canonical. This can lead to confusion during development and maintenance.

## Recommendations for Refactoring

To restore a clean modular architecture, `apps/cards` must be simplified to a **pure component and feature library**. All application-level routing should be centralized in `apps/front`.

1.  **Remove Routing from `apps/cards`:**
    -   **Delete the entire `apps/cards/src/routes` directory.** The `apps/cards` package should not be a runnable application; it should only provide the building blocks for one.
    -   Remove any tests in `apps/cards/tests/` that are specific to the now-deleted routes (e.g., `CardsRouteLayout.test.ts`). Tests should focus on individual components.

2.  **Centralize Routing in `apps/front`:**
    -   Ensure `apps/front` contains all routes related to the "Cards" feature. It already does this, so this step is mostly about making it the *exclusive* owner of this responsibility.
    -   Pages within `apps/front` will continue to import and use components from `@loke/apps-cards`, which is the correct pattern.

3.  **Update Configuration:**
    -   Review `apps/cards/package.json` and `vitest.config.js` to remove any configuration related to it being a SvelteKit application. Its configuration should reflect that of a Svelte component library.

By implementing these changes, the roles will be clarified:
-   `apps/front`: The one and only SvelteKit application shell.
-   `apps/cards`: A library providing Svelte components and logic for the "Cards" feature.
-   `apps/shared`: A UI-agnostic library for shared data and logic.
