# Gemini Code Assistant Context for `apps-vue`

This document provides context for the Gemini Code Assistant to understand and effectively assist with the `apps-vue` directory within the `loke-cards` project.

## Project Overview

The `apps-vue` directory is part of the larger `loke-cards` project, which is a Progressive Web App (PWA) built with Vanilla JavaScript, Vite, and Tailwind CSS. `loke-cards` serves as a form-based editor for creating and managing interactive fiction content in a specific C-language format for the `loke-engine`. The application is designed to work offline and syncs with a `loke-engine` server via a REST API.

The `apps-vue` directory itself is a monorepo-like structure containing three distinct but related Vue.js sub-projects:

*   **`cards-vue`**: This is the main PWA application, providing the user interface for editing and managing interactive fiction content. It utilizes Vue 3, Pinia for state management, Vue Router for navigation, and `localforage` for offline data persistence. It also includes PWA capabilities via `vite-plugin-pwa`.
*   **`graph-vue`**: A separate Vue.js application, likely intended for visualizing the interactive fiction content (e.g., scene graphs, chapter flows). It uses `vue-flow` for graph rendering.
*   **`shared-vue`**: This acts as a shared library containing common Vue components, utility functions, and Pinia stores that are reused across `cards-vue` and `graph-vue`.

All three sub-projects leverage Vite as their build tool, Vue 3 for their frontend framework, and Tailwind CSS for styling.

## Building and Running the Project

To set up and run the projects within `apps-vue`, follow these steps:

1.  **Install Dependencies:**
    Navigate into each sub-project directory (`cards-vue`, `graph-vue`, `shared-vue`) and run `npm install`.

    ```bash
    # For cards-vue
    cd cards-vue
    npm install
    cd ..

    # For graph-vue
    cd graph-vue
    npm install
    cd ..

    # For shared-vue
    cd shared-vue
    npm install
    cd ..
    ```

2.  **Run Development Servers:**
    Each sub-project can be run independently in development mode.

    *   **`cards-vue` (Main Application):**
        ```bash
        cd cards-vue
        npm run dev
        ```
        The development server typically runs at `http://localhost:5173` (or another port if 5173 is in use).

    *   **`graph-vue` (Graph Visualization):**
        ```bash
        cd graph-vue
        npm run dev
        ```
        The development server typically runs at `http://localhost:5174` (or another port).

    *   **`shared-vue` (Shared Library - for development/testing):**
        ```bash
        cd shared-vue
        npm run dev
        ```
        This is primarily for developing and testing the shared components in isolation.

3.  **Build for Production:**
    To create production-ready assets for each application:

    *   **`cards-vue`:**
        ```bash
        cd cards-vue
        npm run build
        ```
        This creates a `dist` directory within `cards-vue`.

    *   **`graph-vue`:**
        ```bash
        cd graph-vue
        npm run build
        ```
        This creates a `dist` directory within `graph-vue`.

    *   **`shared-vue`:**
        ```bash
        cd shared-vue
        npm run build
        ```
        This creates a `dist` directory for the shared library.

4.  **Preview Production Build:**
    ```bash
    # For cards-vue
    cd cards-vue
    npm run preview

    # For graph-vue
    cd graph-vue
    npm run preview
    ```

## Testing

The projects use Playwright for end-to-end testing.

*   **Run Tests:**
    ```bash
    # For cards-vue
    cd cards-vue
    npm run test

    # For graph-vue
    cd graph-vue
    npm run test
    ```

*   **Run Tests with UI:**
    ```bash
    # For cards-vue
    cd cards-vue
    npm run test:ui

    # For graph-vue
    cd graph-vue
    npm run test:ui
    ```

*   **Show Test Report:**
    ```bash
    # For cards-vue
    cd cards-vue
    npm run test:report

    # For graph-vue
    cd graph-vue
    npm run test:report
    ```

## Development Conventions

*   **Frontend Framework:** Vue 3 (Composition API with `<script setup>`).
*   **Build Tool:** Vite.
*   **Styling:** Tailwind CSS.
*   **State Management:** Pinia.
*   **Routing:** Vue Router.
*   **Language:** Primarily JavaScript (ESM), with some TypeScript (`.ts`) for type definitions (e.g., `src/types/domain.ts`, `src/router/index.ts`).
*   **Code Style:** The `cards-vue` project includes `eslint` and `prettier` scripts for linting and formatting. It's recommended to follow these conventions across all sub-projects.
    *   `npm run lint`
    *   `npm run format`
*   **File Structure:**
    *   `src/main.js` (or `.ts`): Application entry point.
    *   `src/components/`: Reusable Vue components.
    *   `src/views/`: Top-level components representing different pages/routes.
    *   `src/stores/`: Pinia stores for state management.
    *   `src/lib/`: Core logic and utility functions.
    *   `src/api/`: API client configurations.
    *   `src/router/`: Vue Router configuration.
    *   `src/styles/`: Global CSS.
    *   `public/`: Static assets.
*   **Testing:** Test-Driven Development (TDD) with Playwright for automated browser checks.

## Key Files and Directories

*   **`cards-vue/`**:
    *   `index.html`: Main HTML file.
    *   `vite.config.js`: Vite configuration for the main app.
    *   `src/App.vue`: Root Vue component.
    *   `src/main.js`: Main application entry point.
    *   `src/lib/autosave.js`: Autosaving logic.
    *   `src/lib/pwa.js`: PWA related logic.
    *   `src/stores/`: Pinia stores for `cards-vue`.
    *   `src/views/`: Main application views.
    *   `tests/`: Playwright tests for `cards-vue`.
*   **`graph-vue/`**:
    *   `index.html`: Main HTML file.
    *   `vite.config.js`: Vite configuration for the graph app.
    *   `src/App.vue`: Root Vue component.
    *   `src/main.js`: Main application entry point.
    *   `src/graph/`: Graph-specific logic and components.
    *   `tests/`: Playwright tests for `graph-vue`.
*   **`shared-vue/`**:
    *   `vite.config.js`: Vite configuration for the shared library.
    *   `src/components/`: Shared Vue components (e.g., `BaseButton.vue`, `AppHeader.vue`).
    *   `src/lib/`: Shared utility functions (e.g., `events.js`, `storage.js`).
    *   `src/stores/`: Shared Pinia stores (e.g., `toast.js`, `ui.js`).
