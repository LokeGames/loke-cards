# Gemini Code Assistant Context

This document provides context for the Gemini Code Assistant to understand and effectively assist with the `loke-cards` project.

## Project Overview

`loke-cards` is a Progressive Web App (PWA) built with Vanilla JavaScript, Vite, and Tailwind CSS. It serves as a form-based editor for creating and managing interactive fiction content in a specific C-language format for the `loke-engine`. The application is designed to work offline and syncs with a `loke-engine` server via a REST API.

The core purpose of this application is to abstract away the complexities of writing C code by providing a user-friendly "card" interface for scenes and chapters. It generates C code compliant with the `loke-engine` API, as detailed in `LOKE-FORMAT-REFERENCE.md`.

### UI/UX Design Principles (from `doc/vue-layout.md`)

-   **Full screen**: Always occupy `100vw × 100vh`. No `max-w` containers.
-   **App shell**: Stable frame (header + sidebar) with scroll **inside content**, not on the page.
-   **Responsive app, not responsive page**: Layout adapts, but content does **not** narrow to a centered column.
-   **Themeable**: Tailwind `dark` variant with user toggle + `localStorage` persistence.
-   **Keyboard-friendly**: Skip links, focus rings, ARIA landmarks.
-   **Panel-first**: Editor/Inspector/Preview panels as flexible/resizable regions.

## Technology Stack

- **Build Tool:** Vite
- **Frontend:** Vanilla JavaScript (ESM)
- **Styling:** Tailwind CSS
- **Offline Storage:** `localforage` (IndexedDB/localStorage wrapper)
- **PWA:** `vite-plugin-pwa` with Workbox for service worker management.
- **Testing:** Test-Driven Development (TDD) with Playwright for automated browser checks and layout picture generation.

## Building and Running the Project

- **Install Dependencies:**
  ```bash
  npm install
  ```

- **Run Development Server:**
  The development server runs at `http://localhost:8080`.
  ```bash
  npm run dev
  ```

- **Build for Production:**
  This command creates a `dist` directory with the production-ready assets.
  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

## Development Conventions

- **Code Style:** The project uses standard modern JavaScript (ESM) with no frameworks. Code should be clean, modular, and well-commented where necessary.
- **File Structure:**
    - `src/main.js`: Application entry point.
    - `src/components/`: Reusable UI components.
    - `src/lib/`: Core logic, including state management (`state.js`), storage (`storage.js`), and autosaving (`autosave.js`).
    - `src/styles/`: CSS styles.
    - `public/`: Static assets, including PWA icons.
- **State Management:** A simple custom state management solution is implemented in `src/lib/state.js`. It uses an event-based system to notify different parts of the application about state changes.
- **Data Persistence:** Scene and chapter data is stored locally using `localforage` for offline availability.
- **API Interaction:** The application communicates with a `loke-engine` backend. API endpoints and environment variable configuration are documented in the `README.md`.

## Key Files

- **`LOKE-FORMAT-REFERENCE.md`**: **Crucial document.** This file defines the exact C code format, naming conventions, and data structures that `loke-cards` must generate. All code generation logic must adhere strictly to this reference.
- **`vite.config.js`**: Configures the Vite build process, including PWA settings, server proxy, and HMR.
- **`tailwind.config.js`**: Configuration for the Tailwind CSS framework.
- **`package.json`**: Defines project scripts, dependencies, and metadata.
- **`src/main.js`**: The main entry point where the application is initialized.
- **`src/lib/state.js`**: Handles global application state.
- **`src/lib/storage.js`**: Manages local storage of scenes and chapters.
- **`README.md`**: Provides a general overview of the project, setup instructions, and deployment details.
