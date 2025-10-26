# @loke/apps-cards

This package is a **Feature Library** that provides all the necessary components and logic for the "Cards Editor" functionality.

## Role & Responsibility

The primary role of this package is to encapsulate everything related to creating, viewing, and managing scenes, chapters, and states. It is designed to be consumed by the main application shell (`@loke/front`).

## Contents

This package should contain:

-   **Domain-Specific Svelte Components**: All components required to build the cards editor UI, such as `SceneEditorView.svelte`, `ChapterForm.svelte`, `ChoicesList.svelte`, etc. These are located in `src/components`.
-   **Feature-Specific Logic**: Business logic that is tightly coupled to the cards feature, such as the C-code generation logic in `src/lib/codegen.ts`.
-   **Public API Definition**: The `src/index.ts` file should export all components and functions that the `@loke/front` application needs to use.

## Boundaries (What NOT to include)

-   **No Application Routes**: This package **must not** contain a `src/routes` directory or any SvelteKit page files (`+page.svelte`, `+layout.svelte`). It is a library, not a runnable application. All routing is handled by `@loke/front`.
-   **Shared Logic**: Any logic, types, or data access that could be useful for other features (e.g., the Graph editor) should be moved to `@loke/shared`.

---

**NOTE:** This package currently contains a `src/routes` directory, which conflicts with its role as a library. As per the evaluation in `doc/MODULARITY-EVALUATION.md`, this directory should be **deleted** to enforce a clean modular architecture.
