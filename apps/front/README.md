# @loke/front

This package is the **Main Application Shell** for the Loke platform. It is the primary, user-facing SvelteKit application that hosts and integrates all features.

## Role & Responsibility

The primary role of this package is to handle application-level concerns, such as routing, layout, and the composition of pages. It acts as the "host" for feature modules like `@loke/cards`.

## Contents

This package is responsible for:

-   **Routing**: The entire application's routing structure is defined in `src/routes`. All pages and URL endpoints are managed here.
-   **Top-Level Layout**: The main application layout, including the header, sidebar, and project dashboard, is defined in `src/routes/+layout.svelte`.
-   **Page Composition**: Pages are constructed here by importing and arranging components from feature libraries (`@loke/cards`, `@loke/graph`) and the UI library (`@loke/ui`).
-   **Application-Specific Features**: High-level features like the main project dashboard (`src/lib/components/dashboard/`) and the settings page (`src/routes/settings/`) belong here.

## Boundaries (What NOT to include)

-   **Domain-Specific Components**: Avoid implementing complex, domain-specific components directly within this package. For example, the scene editor form belongs in `@loke/cards`, not here. This package should *consume* feature components, not define them.
-   **Shared Business Logic**: Any logic or type that could be used by another application should be placed in `@loke/shared`.
