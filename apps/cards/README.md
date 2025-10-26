# @loke/apps-cards

This package is a **Feature Library** that provides all the necessary components and logic for the "Cards Editor" functionality.

## Role & Responsibility

The primary role of this package is to encapsulate everything related to creating, viewing, and managing scenes, chapters, and states. It is designed to be consumed by the main application shell (`@loke/front`).

## Contents

This package should contain:

-   **Domain-Specific Svelte Components**: All components required to build the cards editor UI, such as `SceneEditorView.svelte`, `ChapterForm.svelte`, `ChoicesList.svelte`, etc. These live in `src/components`.
-   **Feature-Specific Logic**: Business logic that is tightly coupled to the cards feature, such as the C-code generation logic in `src/lib/codegen.ts`.
-   **Front Module Contract**: The module definition that plugs into the shell is declared in `src/front-module.ts` (exported as `cardsFrontModule`). The module view, plus all internal workspace pages, live under `src/module/`. This view is responsible for rendering the cards experience whenever `/cards/*` is active.
-   **Navigation Data**: `src/menu.ts` still hosts the cards navigation model. The module view consumes it to render the internal navigation ribbon.
-   **Public API Definition**: The `src/index.ts` file exports the components, module definition, and helpers that the `@loke/front` application needs to use.

## Boundaries (What NOT to include)

-   **No Application Routes**: This package **must not** contain a `src/routes` directory or any SvelteKit page files (`+page.svelte`, `+layout.svelte`). It is a library, not a runnable application. All routing is handled by `@loke/front`.
-   **No Hardcoded Styles**: Components in this package **must not** define their own colors or styles. They must use the semantic theme classes and CSS variables provided by the `@loke/front` application (e.g., use `class="bg-surface"` instead of `class="bg-white dark:bg-gray-800"`). This ensures the components can be themed correctly by the host application.
-   **Shared Logic**: Any logic, types, or data access that could be useful for other features (e.g., the Graph editor) should be moved to `@loke/shared`.

---

**NOTE:** This package currently contains a `src/routes` directory, which conflicts with its role as a library. As per the evaluation in `doc/MODULARITY-EVALUATION.md`, this directory should be **deleted** to enforce a clean modular architecture.
