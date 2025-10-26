# @loke/front

This package is the **Main Application Shell** for the Loke platform. It is the primary, user-facing SvelteKit application that hosts and integrates all features.

## Role & Responsibility

The primary role of this package is to handle application-level concerns, such as routing, layout, and the composition of pages. It acts as the "host" for feature modules like `@loke/cards`.

## Navigation Architecture

Loke Cards uses a **dual-topbar navigation system** with two distinct levels:

### Level 1: AppHeader (Top Bar)
Located at the very top of the application, providing global app context:
- **App Title**: "Loke Cards" branding
- **Theme Toggle**: Switch between light/dark mode
- Rendered by `@loke/ui/components/AppHeader.svelte`

### Level 2: TopNavBar (Module Navigation)
Located below the header, providing module and action navigation:
- **Left Section**: Navigation
  - Dashboard icon (home) - quick access to project dashboard
  - Module tabs (Cards, etc.) - switch between feature modules
- **Right Section**: Actions
  - Project switcher (folder icon) - change current project
  - Theme toggle - quick theme switching
  - Settings - application settings
- Rendered by `@loke/ui/components/TopNavBar.svelte` within `AppShell`

### Project Switching Workflow
The project switcher provides an elegant solution to state management:
1. User clicks project switcher icon (right side)
2. Current project is cleared via `clearCurrentProject()`
3. Navigation to `/` shows `ProjectDashboard`
4. User selects a new project
5. Automatic navigation to `/cards` provides natural browser refresh
6. This workflow eliminates complex cross-component reactivity tracking

This design provides clear visual hierarchy and predictable user experience.

## Theming & Styling

This package is the **owner of the application's visual theme**.

-   The theme is defined in `src/app.css` using global CSS variables (e.g., `--bg-surface`, `--text-primary`) and semantic utility classes (e.g., `.bg-surface`).
-   The root `tailwind.config.js` is located here and is configured to scan all consumed packages for Tailwind classes.
-   All other packages (`@loke/cards`, `@loke/ui`, etc.) **must** use the theme variables and classes provided by `front`. They should not define their own colors or hardcode styles that would prevent the theme from being applied consistently.

## Contents

This package is responsible for:

-   **Routing**: The root routes live in `src/routes`, but feature-specific navigation is owned by each module. When a path matches a registered module (e.g. `/cards/*`), the shell mounts that module’s exported view component instead of rendering nested SvelteKit pages directly.
-   **Module Activation (Smart Container)**: `front` discovers `FrontModuleDefinition` objects (see `src/lib/front-modules.ts`), renders them in the top navigation, and mounts the active module’s view via the shared `AppShell` component. The legacy sidebar menu has been retired.
-   **Top-Level Layout**: Global chrome—including the header, project dashboard entry point, toasts, and shell actions—is composed in `src/routes/+layout.svelte` using the presentational `@loke/ui` components.
-   **Application-Specific Features**: High-level features like the main project dashboard (`src/lib/components/dashboard/`) and the settings page (`src/routes/settings/`) belong here.

## Boundaries (What NOT to include)

-   **Domain-Specific Components**: Avoid implementing complex, domain-specific components directly within this package. For example, the scene editor form belongs in `@loke/cards`, not here. This package should *consume* feature components, not define them.
-   **Shared Business Logic**: Any logic or type that could be used by another application should be placed in `@loke/shared`.
