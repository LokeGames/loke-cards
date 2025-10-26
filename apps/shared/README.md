# @loke/shared

This package acts as the **Shared Kernel** for the Loke monorepo. It contains UI-agnostic logic, types, and data access utilities that are shared across multiple applications.

## Role & Responsibility

The primary role of this package is to provide a single source of truth for core data structures and business logic.

## Contents

This package should only contain:

-   **TypeScript Types & Interfaces**: Shared data structures like `Scene`, `Chapter`, `StateVariable`, etc. (e.g., in `src/types.ts`).
-   **Data Access Logic**: The API client (`src/api-client.ts`) and the database abstraction layer (`src/database.ts`) responsible for all communication with the backend.
-   **Shared State Management**: Application-wide Svelte stores (using runes) that manage data like the current project (`src/stores/project.svelte.ts`). The logic should remain UI-agnostic.
-   **Generic Utilities**: Helper functions that are not specific to any single feature (e.g., `src/utils.ts`).

## Boundaries (What NOT to include)

-   **No Svelte Components or UI**: This package **must not** contain any `.svelte` files or UI-rendering code.
-   **No Styling or CSS**: This package must not contain any CSS, styling information, or Tailwind classes. Its purpose is to be purely for logic and data.
-   **No App-Specific Dependencies**: It should not depend on other `apps/*` packages like `@loke/front` or `@loke/cards`. It is a foundational package that other packages depend on.
