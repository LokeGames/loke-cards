# @loke/front

This package is the **Main Application Shell** for the Loke platform. It is the primary, user-facing SvelteKit application that hosts and integrates all features.

## Role & Responsibility

The primary role of this package is to handle application-level concerns, such as routing, layout, and the composition of pages. It acts as the "host" for feature modules like `@loke/cards`.

## Theming & Styling

This package is the **owner of the application's visual theme**.

-   The theme is defined in `src/app.css` using global CSS variables (e.g., `--bg-surface`, `--text-primary`) and semantic utility classes (e.g., `.bg-surface`).
-   The root `tailwind.config.js` is located here and is configured to scan all consumed packages for Tailwind classes.
-   All other packages (`@loke/cards`, `@loke/ui`, etc.) **must** use the theme variables and classes provided by `front`. They should not define their own colors or hardcode styles that would prevent the theme from being applied consistently.

## Contents

This package is responsible for:

-   **Routing**: The entire application's routing structure is defined in `src/routes`. All pages and URL endpoints are managed here.
-   **Menu Composition (Smart Container)**: This application acts as the **"smart" container**. It is responsible for building the application's main menu. It dynamically imports menu definitions from all active feature packages (e.g., `cardsMenu` from `@loke/cards`), assembles them into a single, complete menu structure, and then passes that structure as a prop to the "dumb" `AppSidebar` UI component from `@loke/ui`.
-   **Top-Level Layout**: The main application layout, including the header, sidebar, and project dashboard, is defined in `src/routes/+layout.svelte`.
-   **Page Composition**: Pages are constructed here by importing and arranging components from feature libraries (`@loke/cards`, `@loke/graph`) and the UI library (`@loke/ui`).
-   **Application-Specific Features**: High-level features like the main project dashboard (`src/lib/components/dashboard/`) and the settings page (`src/routes/settings/`) belong here.

## Boundaries (What NOT to include)

-   **Domain-Specific Components**: Avoid implementing complex, domain-specific components directly within this package. For example, the scene editor form belongs in `@loke/cards`, not here. This package should *consume* feature components, not define them.
-   **Shared Business Logic**: Any logic or type that could be used by another application should be placed in `@loke/shared`.
