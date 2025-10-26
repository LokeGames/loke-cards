# @loke/ui

This package contains generic, reusable Svelte components that form the building blocks of the Loke application's user interface.

## Role & Responsibility

The primary role of this package is to provide a library of "dumb" or "presentational" components that are completely agnostic of any application-specific business logic.

### Shell Primitives

- `AppShell` wraps the global header, top navigation, and the active module view. It owns layout only—data and effects stay in the host app.
- `TopNavBar` renders module entries and shell actions using props (`modules`, `actions`, `activeModuleId`) and emits `select`/`action` events so the host can react.
- `AppSidebar` is a purely presentational list renderer. Pass `sections` (grouped items with `{ id, label, href?, onClick?, icon?, disabled?, badge? }`) and optionally `activeItemId`. The component never imports feature code; it simply emits `select` when users interact with an item.

Pass icons as Svelte components (from `lucide-svelte` or local wrappers) and keep label strings short so they fit inside the compact top bar.

## Guiding Principles

Components in this package follow a **"Presentational" (or "Dumb") Component** pattern. Their sole responsibility is to render UI based on the data they are given.

-   **Presentational Only**: Components focus on look and feel. They **do not** fetch their own data or contain application-specific business logic.
-   **Data via Props**: All data, such as user information, lists of items, or menu structures, **must** be passed in as props. For example, the `AppSidebar` component receives a fully constructed menu object to render; it does not build the menu itself.
-   **Events for Interaction**: Components emit events (using `createEventDispatcher`) to inform the "smart" container component about user interactions. They do not trigger navigation or API calls directly.
-   **Application Agnostic**: These components **must not** have any knowledge of the `apps/*` that consume them. They must never import from `@loke/cards`, `@loke/graph`, or `@loke/front`.

## Theming

Components must be themeable by the host application. They should use the semantic theme classes provided by `apps/front` (e.g., `bg-surface`, `text-primary`) instead of hardcoded Tailwind classes (e.g., `bg-white`). This allows the host application to control the final look and feel.

When building new shell-aware components, prefer the neutral palette used by `AppShell` (`bg-gray-50`/`dark:bg-gray-950`, `text-gray-900`/`dark:text-gray-100`). Module authors should stick to the same tokens to maintain a cohesive top-level experience.
