# CHANGELOG - Loke Cards

All notable changes to this project will be documented in this file.

## [Unreleased]

### Phase 0.3 - C++ Backend with Loke-Engine Integration (2025-10-16)

#### Added
- **C++ REST API Server** (port 3000)
  - Built with cpp-httplib (header-only HTTP library)
  - OpenSSL support for HTTPS
  - CORS enabled for Tailscale network
  - CMake build system in `server/`
  - Executable: `server/build/loke-cards-server`

- **Loke-Engine Compatible C Code Generator** (`server/src/code_generator.cpp`)
  - Generates **perfect loke-engine C files** directly from card JSON
  - Follows loke-engine scene API exactly (as documented in `~/loke-engine/include/loke/scene.h`)
  - Implements all patterns from `doc/LOKE-FORMAT-REFERENCE.md`:
    - Proper `#include <loke/scene.h>` headers
    - Correct `void scene_NAME(GameState* state)` function signatures
    - `SceneContext* ctx = get_current_context()` pattern
    - `scene_set_text()`, `scene_add_option()` API calls
    - State modifications (health, gold, karma, flags)
    - Conditional choices with if/else logic
  - String escaping for C string literals (quotes, newlines, backslashes)
  - Forward declarations for cross-chapter scenes
  - **NO DATABASE** - Generated C files are the source of truth

- **File Manager** (`server/src/file_manager.cpp`)
  - Writes to loke-engine project structure:
    ```
    projects/
    └── project_name/
        ├── chapter01/
        │   ├── chapter01.h       (auto-generated header)
        │   ├── scene01.c
        │   └── scene02.c
        └── metadata.json
    ```
  - Auto-generates chapter headers with forward declarations
  - Directory management (creates folders as needed)
  - CRUD operations: write, read, delete, list scenes

- **REST API Endpoints** (`server/src/main.cpp`)
  - `POST /api/projects/:project/chapters/:chapter/scenes` - Create/update scene
    - Accepts JSON with: scene_id, chapter, scene_text, choices[], state_changes[]
    - Generates C code instantly
    - Writes `.c` file to correct location
    - Updates chapter header automatically
  - `GET /api/projects/:project/chapters/:chapter/scenes` - List scenes in chapter
  - `GET /api/projects/:project/chapters/:chapter/scenes/:scene` - Get scene source code
  - `DELETE /api/projects/:project/chapters/:chapter/scenes/:scene` - Delete scene
  - `GET /api/projects/:project/chapters` - List all chapters in project
  - `GET /api/projects/:project` - Get project metadata
  - `POST /api/projects` - Create new project
  - `GET /api/health` - Health check endpoint

- **Build System**
  - CMakeLists.txt with proper dependency linking
  - Dependencies: Threads, OpenSSL (libssl-dev)
  - Include paths: cpp-httplib, nlohmann/json
  - Build directory: `server/build/`

#### Verified Working
- **Test Scene Generation** (2025-10-16)
  - Created test scene via API: `forest_entrance`
  - Generated file: `projects/test-adventure/chapter01/forest_entrance.c`
  - **VERIFIED**: C code is 100% loke-engine compatible:
    ```c
    #include <loke/scene.h>
    #include "chapter01.h"

    void scene_forest_entrance(GameState* state) {
        SceneContext* ctx = get_current_context();
        scene_set_text(ctx, "You stand at the entrance to a dark forest.\nA narrow path leads deeper into the trees.\n");

        // Choices
        scene_add_option(ctx, "Enter the forest", scene_forest_path, true);
        scene_add_option(ctx, "Return to village", scene_village, true);
    }
    ```
  - Chapter header auto-generated: `projects/test-adventure/chapter01/chapter01.h`
  - **Ready to compile with loke-engine!**

#### Dependencies Installed
- `libssl-dev` - OpenSSL development headers (for HTTPS)
- `nlohmann-json3-dev` - JSON for Modern C++ (already installed)
- `cpp-httplib` - Cloned from GitHub to `external/cpp-httplib/`
- `cmake` - Build system (already installed)
- `g++` - C++ compiler (already installed)

#### Technical Notes
- **No SQLite used** - We don't need a database!
  - C files generated from cards ARE the source of truth
  - Files can be version controlled (git)
  - Direct integration with loke-engine compilation
  - Simpler architecture than SQL + code generation layer
- **File-based architecture** matches loke-engine philosophy
  - Scenes are `.c` files (loke-engine native format)
  - Chapters are directories with headers
  - Projects are top-level directories
  - Metadata in `metadata.json` (optional)

#### Backend Architecture Decision
After reviewing loke-engine architecture (`~/loke-engine/`), we chose:
- **Direct C file generation** instead of database + export
- **REST API** for frontend communication
- **File system** as storage layer (like loke-engine itself)
- **Stateless server** - no session management needed
- **CORS enabled** for Tailscale network (frontend :8443, backend :3000)

#### Next Steps (Phase 1)
- Integrate backend API with Vue 3 frontend
- Create scene editor form components
- Add API client (`src/api/client.js`)
- Test full workflow: Edit card → API → Generate C → Verify loke-engine compilation

---

## Phase 0.2 - Vue 3 Migration with Tailwind v3 (2025-10-16)

### Added
- Vue 3 with Composition API
- Pinia for state management
- Vue Router for client-side routing
- Tailwind CSS v3.4.0 (downgraded from v4 - critical fix!)
- Vite + @vitejs/plugin-vue
- Playwright for browser CLI testing
- Responsive demo layout in `src/App.vue`

### Fixed
- **CRITICAL: Tailwind CSS v4 incompatibility**
  - Tailwind v4 with `@tailwindcss/postcss` does NOT work with Vite + Vue 3
  - Downgraded to Tailwind v3.4.0 (stable)
  - Changed postcss.config.js from `'@tailwindcss/postcss'` to `'tailwindcss'`
  - Result: Perfect styling across all viewports (mobile, tablet, desktop)

### Verified Working
- Hot Module Replacement (HMR) works perfectly
- Tailwind CSS classes apply correctly on all breakpoints
- Responsive layout tested: 375px (mobile), 768px (tablet), 1920px (desktop)
- 4/4 Playwright tests passed
- Vue DevTools integration confirmed
- Screenshot tests show perfect styling

### Changed
- `package.json` dependencies updated
- `vite.config.js` - Added Vue plugin
- `postcss.config.js` - Fixed Tailwind plugin configuration
- `tailwind.config.js` - Added `.vue` file scanning
- Created `index.html` with Vue mount point
- Created `src/main.js` with Vue app initialization
- Created folder structure: components/, views/, stores/, composables/, utils/

### Technical Lessons
- Tailwind v4 is NOT production-ready for Vite + Vue 3
- Always use Tailwind v3.4.x for Vue projects
- Playwright screenshot tests catch visual issues that DOM tests miss
- TDD approach validated - tests found the CSS compilation bug

---

## Phase 0.1 - Initial Setup (2025-10-16)

### Added
- Project initialized with Vite
- Tailwind CSS v4 (later downgraded)
- LocalForage for client-side storage
- PWA manifest and service worker setup
- Basic folder structure

### Documentation
- `TODO-VUE.md` - Complete migration plan (8 phases, 20-27 hour estimate)
- `CLAUDE.md` - Project overview and architecture
- `doc/LOKE-FORMAT-REFERENCE.md` - C code generation reference
- `doc/vue-layout.md` - Responsive design guidelines
- `doc/TEST-PROOF.md` - Test results documentation

---

## Format
This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) principles.

### Categories
- **Added** - New features
- **Changed** - Changes to existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Vulnerability fixes
- **Verified Working** - Tested and confirmed functionality
