# @loke/ui

This package contains generic, reusable Svelte components that form the building blocks of the Loke application's user interface.

## Role & Responsibility

The primary role of this package is to provide a library of "dumb" or "presentational" components that are completely agnostic of any application-specific business logic.

### Shell Primitives

The Loke platform uses a **dual-topbar navigation system** with two distinct levels:

#### Level 1: AppHeader
Global application header providing app-wide context:
- App title/branding
- Global theme toggle
- Optional project picker (when applicable)

#### Level 2: TopNavBar (Module Navigation)
Secondary navigation bar for modules and actions:
- **Left section**: Dashboard icon + module tabs
- **Right section**: Shell actions (project switcher, theme, settings)

#### Components

##### `AppShell`
Wraps the global header, top navigation, and the active module view. It owns layout only—data and effects stay in the host app.

**Props:**
- `modules: FrontModuleNavItem[]` - Module navigation items
- `actions: ShellAction[]` - Shell actions (right side)
- `activeModuleId: string | null` - Current active module ID
- `navHidden?: boolean` - Hide navigation (e.g., when no project selected)

**Slots:**
- `header` - For `AppHeader` component
- Default slot - For module view content

**Usage Example:**
```svelte
<AppShell
  modules={moduleNavItems}
  actions={shellActions}
  activeModuleId={activeModuleId}
  navHidden={!hasProject}
>
  <svelte:fragment slot="header">
    <AppHeader title="Loke Cards" showThemeToggle={true} />
  </svelte:fragment>

  {#if hasProject && ActiveModuleComponent}
    <ActiveModuleComponent />
  {:else}
    <ProjectDashboard />
  {/if}
</AppShell>
```

##### `TopNavBar`
Renders module entries and shell actions using props. Fully presentational—emits events for the host to handle.

**Props:**
- `modules: FrontModuleNavItem[]` - Module navigation items
  - `{ id: string, label: string, icon: ComponentType, href: string }`
- `actions: ShellAction[]` - Shell actions (settings, theme toggle, etc.)
  - `{ id: string, label: string, icon: ComponentType, href?: string, onClick?: () => void }`
- `activeModuleId: string | null` - Highlight active module

**Usage:**
TopNavBar is rendered inside AppShell. Pass icons as Svelte components (from `lucide-svelte` or local wrappers) and keep label strings short so they fit inside the compact top bar.

##### `AppSidebar`
A purely presentational list renderer for internal module navigation. Pass `sections` (grouped items with `{ id, label, href?, onClick?, icon?, disabled?, badge? }`) and optionally `activeItemId`. The component never imports feature code; it simply emits `select` when users interact with an item.

**Note:** With the dual-topbar system, AppSidebar is used for internal module navigation, not top-level navigation.

## Guiding Principles

Components in this package follow a **"Presentational" (or "Dumb") Component** pattern. Their sole responsibility is to render UI based on the data they are given.

-   **Presentational Only**: Components focus on look and feel. They **do not** fetch their own data or contain application-specific business logic.
-   **Data via Props**: All data, such as user information, lists of items, or menu structures, **must** be passed in as props. For example, the `AppSidebar` component receives a fully constructed menu object to render; it does not build the menu itself.
-   **Events for Interaction**: Components emit events (using `createEventDispatcher`) to inform the "smart" container component about user interactions. They do not trigger navigation or API calls directly.
-   **Application Agnostic**: These components **must not** have any knowledge of the `apps/*` that consume them. They must never import from `@loke/cards`, `@loke/graph`, or `@loke/front`.

## Theming

Components must be themeable by the host application. They should use the semantic theme classes provided by `apps/front` (e.g., `bg-surface`, `text-primary`) instead of hardcoded Tailwind classes (e.g., `bg-white`). This allows the host application to control the final look and feel.

When building new shell-aware components, prefer the neutral palette used by `AppShell` (`bg-gray-50`/`dark:bg-gray-950`, `text-gray-900`/`dark:text-gray-100`). Module authors should stick to the same tokens to maintain a cohesive top-level experience.
