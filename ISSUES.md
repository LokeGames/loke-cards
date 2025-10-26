# Architectural Issues & Technical Debt

This document tracks known architectural issues in the `loke-cards` project that should be addressed to improve modularity, maintainability, and scalability.

## 1. Confused Identity of `apps/cards`

-   **Problem**: The `apps/cards` package is structured as both a Svelte component library and a standalone SvelteKit application. It contains a `src/routes` directory which is redundant with the routing in `apps/front`.
-   **Impact**: This creates ambiguity about the canonical routes and blurs the architectural lines. It makes the project harder to understand for new developers.
-   **Recommendation**: Refactor `apps/cards` to be a pure feature library. This involves **deleting the `apps/cards/src/routes` directory** and ensuring all routing is handled exclusively by `apps/front`.

## 2. Improperly Centralized Styling & Theming

-   **Problem**: Although `apps/front` defines a central theme system (`src/app.css`), components in other packages (like `apps/cards`) do not adhere to it. They use hardcoded Tailwind utility classes (e.g., `bg-white dark:bg-gray-700`) instead of the provided semantic theme classes (e.g., `bg-surface`).
-   **Impact**: The application is not consistently themeable. Changes to the central theme in `apps/front` do not propagate correctly, and the visual consistency is brittle.
-   **Recommendation**: Refactor all components in feature packages (`cards`, `graph`, `ui`) to exclusively use the semantic CSS classes and variables defined in the `apps/front` theme system.

## 3. Broken Modularity in UI Components (Sidebar Menu)

-   **Problem**: The generic `AppSidebar` component (located in `packages/ui`) contains hardcoded logic to dynamically import menus from specific feature packages (`@loke/apps-cards`, `@loke/apps-graph`). A generic UI component should have no knowledge of the applications that consume it.
-   **Impact**: This breaks the "dumb component" principle. The UI library is no longer generic, and adding new features with menu items requires modifying the shared `AppSidebar` component, which is not scalable.
-   **Recommendation**: Refactor `AppSidebar` to be a purely presentational component that accepts a menu structure as a prop. The responsibility for assembling this menu structure by importing from feature packages should be moved to the application shell (`apps/front/src/routes/+layout.svelte`).
-   **Status**: Addressed by the navigation refactor—`AppShell` + `TopNavBar` now source module definitions via the Front Module API, and `AppSidebar` is no longer used in the shell. Follow-up cleanup: remove legacy sidebar usage once other apps migrate.
