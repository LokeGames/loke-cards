# @loke/ui

This package contains generic, reusable Svelte components that form the building blocks of the Loke application's user interface.

## Role & Responsibility

The primary role of this package is to provide a library of "dumb" or "presentational" components that are completely agnostic of any application-specific business logic.

## Guiding Principles

Components in this package follow a **"Presentational" (or "Dumb") Component** pattern. Their sole responsibility is to render UI based on the data they are given.

-   **Presentational Only**: Components focus on look and feel. They **do not** fetch their own data or contain application-specific business logic.
-   **Data via Props**: All data, such as user information, lists of items, or menu structures, **must** be passed in as props. For example, the `AppSidebar` component receives a fully constructed menu object to render; it does not build the menu itself.
-   **Events for Interaction**: Components emit events (using `createEventDispatcher`) to inform the "smart" container component about user interactions. They do not trigger navigation or API calls directly.
-   **Application Agnostic**: These components **must not** have any knowledge of the `apps/*` that consume them. They must never import from `@loke/cards`, `@loke/graph`, or `@loke/front`.

## Theming

Components must be themeable by the host application. They should use the semantic theme classes provided by `apps/front` (e.g., `bg-surface`, `text-primary`) instead of hardcoded Tailwind classes (e.g., `bg-white`). This allows the host application to control the final look and feel.