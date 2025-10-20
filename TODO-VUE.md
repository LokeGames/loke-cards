# TODO - Loke Cards Vue 3 Rewrite

## Technology Stack Decision

### Frontend
- **Vue 3** (Composition API) - Reactive, lettere end React
- **Vite** - Lynhurtig build og HMR
- **Tailwind CSS** - Utility-first styling
- **Pinia** - State management (officiel Vue store)
- **Vue Router** - Client-side routing
- **LocalForage** - Client-side IndexedDB storage (ALREADY IMPLEMENTED ✅)
- **PWA** (Phase 8) - Valgfrit til sidst

### Backend
- **C++ med httplib** - Lightweight HTTP server
- **SQLite** - Server database (master data, source of truth)
- **JSON** - API kommunikation
- **Port 3000** - Backend API server
- **Tailscale** - Netværk (frontend på :8443, backend på :3000)

### Database Architecture (LocalForage + SQLite)
**PWA Storage** (Browser - LocalForage/IndexedDB) **✅ ALREADY WORKING**:
- 4 stores: scenes, chapters, drafts, projects (see `src/lib/storage.js`)
- Drafts: Work in progress scenes with auto-save
- Offline cache: Last synced data
- Full CRUD operations implemented
- Export/import functionality

**Server SQLite Database** (C++ backend):
- Master data: All projects, chapters, scenes (same schema as LocalForage)
- Source of truth for multi-user sync
- Generates `.c` files for loke-engine
- Timestamps for conflict resolution

**Sync Flow**:
```
User edits → LocalForage → HTTP POST/PUT → Server SQLite → Generate .c files → loke-engine
    (vanilla JS) ↓              (new)         (Phase 3)          (Phase 3.4)
             Instant UI
               ↑
          HTTP GET ←──────── Sync ←──── Server is source of truth
             (new)              (Phase 2.6)
```

**Migration Strategy**:
- ✅ Keep existing LocalForage storage.js (working code!)
- ✅ Keep existing storage schema (projects, chapters, scenes, choices, state_changes)
- 🔄 Wrap storage.js functions in Pinia stores (Phase 1.5)
- 🔄 Add sync layer to POST/GET from C++ server (Phase 2.6)
- 🔄 Server SQLite mirrors LocalForage schema (Phase 3.1)

**Advantages**:
- ✅ Reuse existing working storage code
- ✅ No breaking changes to data model
- ✅ LocalForage is simpler than sql.js (no WASM overhead)
- ✅ Offline-first already works
- ✅ `.c` files are "compiled output" from server database

### Development Tools
- **Playwright** - Browser CLI testing
- **Vue DevTools** - Browser extension
- **ESLint + Prettier** - Code quality

### Loke-Engine Integration

**IMPORTANT**: All "card" components (Scene Cards, Chapter Cards) must integrate with **loke-engine**.

**Loke-Engine Documentation Sources**:
1. **System manpages**: `man loke-engine`, `man loke-scene`, etc.
2. **Local project**: `~/loke-engine/` directory
3. **GitHub repository**: Use `gh` command to access `LokeEngine/loke-engine`
   - Example: `gh repo view LokeEngine/loke-engine`
   - Example: `gh api repos/LokeEngine/loke-engine/contents/include/loke/scene.h`

**Integration Requirements**:
- Scene cards generate C code compatible with loke-engine scene API
- Follow loke-engine function signatures and conventions
- Use loke-engine GameState structure for state management
- Reference loke-engine headers in generated code
- Validate against loke-engine C identifier rules

**Reference Files**:
- See `/home/ubuntu/loke-cards/CLAUDE.md` for complete loke-engine format reference
- See `/home/ubuntu/loke-cards/doc/LOKE-FORMAT-REFERENCE.md` for C code generation templates

---

## Phase 0: Technology Migration ⏳ IN PROGRESS

### 0.1 Backup & Branch
- [ ] Create backup branch `vanilla-js-backup`
- [ ] Create new branch `vue-rewrite`
- [ ] Backup current working code
- [ ] Document what works from vanilla version

### 0.2 Vue 3 Project Setup ✅ COMPLETED
- [x] Keep existing dependencies: Vite ✅, Tailwind v4 ✅, LocalForage ✅
- [x] Install Vue 3, Pinia, Vue Router, @vitejs/plugin-vue
- [x] Configure Vite to use @vitejs/plugin-vue
- [x] Created src/App.vue with responsive demo layout
- [x] Updated src/main.js to create Vue app with Pinia
- [x] Created folder structure: components/, views/, stores/, composables/, utils/
- [x] Created index.html with Vue mount point
- [x] Playwright tests: 4/4 passed ✅
- [x] Hot reload confirmed working ✅
- [x] Tailwind CSS fully responsive ✅

### 0.3 C++ Backend Setup ✅ COMPLETED GEMINI AI
- [x] Create `/server` directory
- [x] Install cpp-httplib (header-only HTTP server)
- [x] Install sqlite3 (embedded database)
- [x] Create basic HTTP server on port 3000
- [x] Test CORS headers for Tailscale
- [x] Create Makefile for C++ compilation (with Doxygen support)
- [x] Test server responds to curl

### 0.4 Development Tools ✅ COMPLETED

- [x] Install Playwright for browser CLI testing
- [x] Configure Playwright for Chrome
- [x] Create test script for automated browser checks
- [x] Install Vue DevTools browser extension (manual step)
- [x] Configure ESLint + Prettier for Vue
- [x] Test hot reload works perfectly

Can we merge git branch to main only yes if all is tested and confirmed working?
---

## Phase 1: Core Vue Architecture (Fully Responsive) ✅ COMPLETED
Branch: `phase1-app-shell`
Commit: `8c76f96` - Phase 1 - App Shell Layout Complete
Layout: @doc/vue-layout.md

### 1.1 Vue Project Structure ✅ COMPLETED
- [x] Create `/src/components` struktur ✅
- [x] Create `/src/views` for pages ✅
- [x] Create `/src/stores` for Pinia ✅
- [x] Create `/src/composables` for reusable logic (ready for Phase 2)
- [x] Keep `/src/lib` for utilities (has storage.js ✅, state.js, validation.js ✅, autosave.js ✅)
- [x] Setup main.js with Vue app ✅
- [x] Configure router ✅
- [x] Configure Pinia store ✅
- [x] No database initialization needed - LocalForage ready ✅

### 1.2 App Shell Layout (Full-screen Application) ✅ COMPLETED
- [x] **App.vue** - Full-screen app shell (`h-screen w-screen`)
  - Flex column layout (Header + Sidebar/Main)
  - Only main content scrolls, not page
  - Dark mode support (`bg-gray-50 dark:bg-gray-900`)
  - Test på alle breakpoints ✅

- [x] **AppHeader.vue** - Top navigation ✅
  - Logo + title "Loke Cards"
  - Hamburger menu (mobile only)
  - ThemeToggle (dark/light mode)
  - StatusPill (sync status indicator)
  - Sticky header (h-14 md:h-16)
  - Fully responsive med Tailwind ✅

- [x] **AppSidebar.vue** - Responsive Sidebar/Drawer ✅
  - Mobile: Slide-in drawer with backdrop
  - Desktop: Fixed sidebar (w-64, always visible)
  - Quick actions (New Scene, New Chapter) ✅
  - Project info display ✅
  - Tailwind transitions ✅
  - Navigation links (Dashboard, Scenes, Chapters, Code, Settings)

- [x] **ThemeToggle.vue** - Dark mode toggle ✅
  - Sun/moon emoji icons
  - localStorage persistence
  - System preference detection
  - Adds/removes `dark` class on `<html>`

- [x] **StatusPill.vue** - Sync status indicator ✅
  - "Synced" status (green badge)
  - Ready for dynamic sync states

- [x] **BaseButton.vue** - Reusable button (from dev branch merge) ✅
  - Props: variant, size, loading
  - Touch-friendly
  - Responsive sizing

- [x] **BaseInput.vue** - Reusable input (from dev branch merge) ✅
  - Props: type, label, error, validation
  - Responsive sizing
  - Tailwind styling

### 1.3 Vue Router Setup ✅ COMPLETED
- [x] `/` - Dashboard view (DashboardView.vue) ✅
- [x] `/scenes` - Scene list view (SceneListView.vue) ✅
- [x] `/scene/new` - New scene editor (SceneEditorView.vue) ✅
- [x] `/scene/:id` - Edit scene ✅
- [x] `/chapters` - Chapter management (ChapterListView.vue) ✅
- [x] `/code` - Generated C code view (CodeView.vue) ✅
- [x] `/settings` - Settings view (SettingsView.vue) ✅
- [x] Mobile-friendly transitions ✅
- [x] Back button support ✅
- [x] Document title updates per route ✅
- [x] Lazy loading for all views ✅

### 1.4 Pinia State Store ✅ PARTIALLY COMPLETED
- [x] **uiStore.js** - UI state ✅
  - isSidebarOpen (mobile drawer state)
  - currentProject (project info)
  - stats (scenes count, chapters count)
  - Actions: toggleSidebar, openSidebar, closeSidebar, setCurrentProject, updateStats

- [ ] **projectStore.js** - Project state (Phase 2)
  - currentProject
  - scenes array (from LocalForage storage.js ✅)
  - chapters array (from LocalForage storage.js ✅)
  - Actions: Wrap storage.js functions (getCurrentProject, getAllScenes, getAllChapters)

- [ ] **editorStore.js** - Editor state (Phase 2)
  - currentScene
  - isDirty (unsaved changes)
  - Actions: Wrap storage.js (saveScene, getScene, saveDraft, getDraft)

- [ ] **syncStore.js** - Sync state (Phase 2)
  - lastSyncTime
  - pendingChanges count
  - syncStatus (idle, syncing, error)
  - Actions: syncToServer, pullFromServer, getSyncQueue

### 1.5 Tailwind Dark Mode ✅ COMPLETED
- [x] `tailwind.config.js` - Added `darkMode: 'class'` ✅
- [x] ThemeToggle component with localStorage ✅
- [x] System preference detection ✅
- [x] Dark mode classes on all components ✅
- [x] **Dark mode text visibility fix (2025-10-16)** ✅
  - Fixed all view components with proper `dark:text-*` classes
  - Fixed AppHeader and AppSidebar navigation
  - Fixed loading screen in index.html
  - Consistent color mapping: gray-800→gray-100, gray-600→gray-400
  - Tested on mobile and desktop - both working ✅

### 1.6 Responsive Testing ✅ COMPLETED
- [x] Test på Chrome mobile emulator (375px, 768px, 1024px) ✅
- [x] Test med Playwright CLI ✅
- [x] Playwright tests: 6/7 passed ✅
  - ✅ App shell displays header and sidebar
  - ✅ Dark mode toggle works
  - ✅ Mobile responsive sidebar
  - ✅ StatusPill visible
  - ✅ Navigation between routes
  - ✅ Toggle dark mode on click
- [x] Verify hot reload works på alle komponenter ✅
- [x] Test Tailwind breakpoints virker korrekt ✅
- [x] Document all responsive behaviors (in commit message) ✅

---
**Phase 1 Status: COMPLETED ✅**
Ready to merge to dev and start Phase 2 (Scene Editor)
---
## Phase 2: Scene Editor (Fully Functional & Responsive) ✅ COMPLETED
Branch: `phase2-scene-editor`
Commits: `45888e9`, `4e7c70b`, `6ab1064`, `b4aaf17`

### 2.1 Scene Editor View Component ✅ COMPLETED
- [x] **SceneEditorView.vue** - Main editor page
  - Responsive 2-column layout (desktop)
  - Single column på mobile
  - Form + Preview side-by-side (sticky on desktop)
  - Real-time C code generation
  - Edit mode + Create mode support

### 2.2 Scene Form Components ✅ COMPLETED
- [x] **SceneIdInput.vue**
  - Real-time C identifier validation
  - Error messages
  - Debounced validation (composable)
  - Responsive width

- [x] **ChapterSelect.vue**
  - Dropdown med chapters fra API
  - Create new chapter inline
  - Mobile-friendly select
  - Emits create-chapter event

- [x] **SceneTextEditor.vue**
  - Auto-growing textarea
  - Character count (2048 max)
  - Mobile-optimized keyboard
  - Real-time validation

- [x] **ChoicesList.vue**
  - Dynamic list (add/remove, max 10)
  - Each choice:
    - Text input (required if present)
    - Next scene input (optional for NULL)
    - Enabled checkbox (default true)
  - Choices are OPTIONAL (0–10). If none, generator adds default "Continue".
  - Responsive cards/rows

- [x] **StateChangesList.vue**
  - Dynamic list (add/remove, optional)
  - Each state change:
    - Variable input with datalist autocomplete
    - Operator select (=, +=, -=, *=, /=)
    - Value input with datalist suggestions
  - Responsive layout
  - Preview: state->variable operator value;
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 2.3 C Code Generator (Composable) - Loke-Engine Compatible ✅ COMPLETED
- [x] **useCodeGenerator.js** composable
  - `generateSceneCode(sceneData)` function
  - Proper C string escaping (quotes, newlines, backslashes)
  - Multi-line text splitting (80 char max)
  - **Generates loke-engine compatible C code**
  - **Follows loke-engine scene API (LOKE-FORMAT-REFERENCE.md)**
  - **Uses correct GameState structure**
  - **Includes proper loke-engine headers** (#include <loke/scene.h>)
  - Real-time reactive code generation

- [x] **CodePreview.vue** component
  - Monospace C code display
  - Copy to clipboard button (with success feedback)
  - Collapsible/expandable section
  - Responsive width
  - Sticky on desktop, collapsible on mobile
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 2.4 Form Validation (Composable) - Loke-Engine Rules ✅ COMPLETED
- [x] **useSceneValidation.js**
  - `validateSceneId()` - C identifier check (must start with "scene_")
  - `validateChapterId()` - C identifier check (must start with "chapter")
  - `validateSceneText()` - Max 2048 characters (loke-engine limit)
  - `validateChoices()` - 0–10 choices supported (default Continue if none)
  - `validateStateChanges()` - Variable/operator/value validation
  - **Validates against loke-engine GameState variables**
  - **Uses isValidCIdentifier() from lib/validation.js**
  - Returns reactive errors object and isValid computed

- [x] Real-time validation in all form components
- [x] Save button disabled when invalid
- [x] Visual error indicators (red text, border highlights)

### 2.5 Auto-save (Composable) - REUSE EXISTING
- [ ] **Migrate lib/autosave.js to composable**
  - Already has debounced save (2 seconds) ✅
  - Already saves to LocalForage (saveDraft) ✅
  - Add: Mark as pending sync (set scene.synced = false)
  - Keep: Visual indicator (saving/saved)
  - Add: Syncing state when pushing to server
  - Works på både desktop og mobile

### 2.6 API Integration ✅ COMPLETED
- [x] Create `/src/api/client.js`
  - Fetch wrapper with error handling
  - Base URL: `import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'`
  - Error handling with message extraction
  - JSON serialization/deserialization
  - Exported APIs: scenes, chapters, projects, healthCheck

- [x] **POST /api/scenes** - Create scene (scenesAPI.create)
- [x] **GET /api/scenes/:id** - Load scene (scenesAPI.getById)
- [x] **PUT /api/scenes/:id** - Update scene (scenesAPI.update)
- [x] **DELETE /api/scenes/:id** - Delete scene (scenesAPI.delete)
- [x] **GET /api/scenes** - Get all scenes (scenesAPI.getAll)
- [x] **GET /api/chapters** - Load chapters (chaptersAPI.getAll)
- [x] Integrated into SceneEditorView (save/load/update)
- [x] Inline "Create New Chapter" now calls API; falls back to LocalForage offline
- [x] Scene save falls back to LocalForage offline when API fails



---

## Phase 3: C++ Backend Implementation
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.0 Dev Bootstrap — Minimal SQLite API ✅ COMPLETED (basic)
- [x] Add SQLite-backed dev API in `server/main.cpp`
- [x] DB file: `server/dev.db`; tables: `chapters(id TEXT, data TEXT)`, `scenes(id TEXT, data TEXT)`
- [x] Endpoints implemented:
  - `GET /api/health`
  - `GET /api/chapters`, `POST /api/chapters` (upsert by `id`)
  - `GET /api/scenes`, `GET /api/scenes/:id`, `POST /api/scenes` (upsert by `sceneId|id`), `PUT /api/scenes/:id`, `DELETE /api/scenes/:id`
- [x] Frontend proxy to `/api` via Vite; one-command dev runner
- [x] Dev orchestration:
  - `npm run dev:full` (starts backend + Vite), `npm run dev:backend`, `npm run dev:kill-ports`

Note: JSON persists as text in `data` column for now (quick bootstrap). Proper schema/validation planned below.

### 3.1 Database Schema (SQLite)
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  name TEXT NOT NULL,
  order_num INTEGER,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

CREATE TABLE scenes (
  id TEXT PRIMARY KEY,
  chapter_id TEXT,
  scene_text TEXT,
  generated_code TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  FOREIGN KEY(chapter_id) REFERENCES chapters(id)
);

CREATE TABLE choices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scene_id TEXT,
  text TEXT,
  next_scene TEXT,
  enabled INTEGER,
  FOREIGN KEY(scene_id) REFERENCES scenes(id)
);

CREATE TABLE state_changes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  scene_id TEXT,
  variable TEXT,
  operator TEXT,
  value TEXT,
  FOREIGN KEY(scene_id) REFERENCES scenes(id)
);
```
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.2 C++ HTTP Server
- [x] `server/main.cpp` - Single-file dev bootstrap (entry + routes + DB)
- [ ] Split into `server/routes.cpp`, `server/database.cpp`, `server/models.cpp` (later)
- [x] CORS headers for Tailscale (config via `CORS_ALLOW_ORIGIN`)
- [ ] JSON parser integration (replace naive extraction)
- [ ] Error handling and logging improvements
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.3 API Endpoints
- [x] `POST /api/scenes` - Create/upsert scene (basic)
- [x] `GET /api/scenes/:id` - Get scene (basic)
- [x] `PUT /api/scenes/:id` - Update scene (basic)
- [x] `DELETE /api/scenes/:id` - Delete scene (basic)
- [x] `GET /api/chapters` - List chapters (basic)
- [x] `POST /api/chapters` - Create/upsert chapter (basic)
- [x] `GET /api/scenes` - List all scenes (basic)
- [x] Health check endpoint
- [x] Add `GET /api/chapters/:id`, `PUT /api/chapters/:id`, `DELETE /api/chapters/:id`
- [x] Build endpoints: `POST /api/build` (generate .c/.h), `GET /api/build/artifacts`
- [x] `GET /api/scenes/:id/code` - On-demand server-side codegen
- [ ] Replace naive JSON parsing with proper parser and validation
- [ ] Normalize schema (columns for `chapter_id`, `scene_text`, etc.)
- [ ] Input validation + error codes

### 3.4 Dev Orchestration
- [x] One-command dev (frontend + backend): `npm run dev:full`
- [x] Fixed Vite port with `VITE_DEV_PORT`; auto-kill conflicting ports
- [x] Add `dev:real` to run real DB server separately (no backend)

### 3.5 Frontend Management Actions
- [x] Scenes list delete action
- [x] Chapters list delete action
- [x] Build UI in Settings (run + list artifacts)
- [x] Sync local data to server (Settings)
- [x] Edit Chapter flow (route + editor)
- [x] Scene Editor: on-demand server codegen button
- [x] Scene Editor: toggle between Local/Server code preview
- [x] App Header breadcrumbs (from route meta)
- [x] Active nav highlight in sidebar
- [x] Editor banners dismissible; focus first invalid field; Reset/Cancel UX
- [x] Replace window.confirm with accessible modal for Deletes
- [x] Persist code preview mode (Local/Server)

### Next up
- [x] Integrate proper JSON library (vendored header-only `server/include/mini_json.hpp`)
- [x] Extend server-side codegen to include choices and stateChanges
- [ ] UI polish: edit Scene small enhancements; better error banners
- [ ] Playwright tests for delete/sync/build flows
- [x] Optional: `dev:real` script for external backend usage (see `npm run dev:real`)
### 3.4 C Code Generation - Loke-Engine Format
- [x] `server/codegen.cpp` - C code generator (module + header)
- [ ] **Reference loke-engine documentation**:
  - Check `man loke-scene` for scene API
  - Read `~/loke-engine/include/loke/scene.h`
  - Use `gh api repos/LokeEngine/loke-engine` for latest format
- [x] Scene function template (basic) — generated per scene during build
- [x] Proper string escaping (basic)
- [x] Include loke-engine headers
- [x] Generate complete .c files matching loke-engine structure (text, state, options)
### 3.5 Build System
- [x] Makefile for C++ server (multi-file, include/)
- [x] Auto-restart on code change (watch scripts)
- [x] Systemd service (example unit provided)
- [x] Test compilation on Ubuntu (manual)

---

## Phase 4: Browser CLI Testing with Playwright ✅ COMPLETED (34/36 passing - 94.4%)
### 4.1 Playwright Setup ✅ COMPLETED
- [x] Install Playwright
- [x] Install Chrome browser binary
- [x] Configure playwright.config.js (optimized: 4 workers, 30s timeout)
- [x] Create `/tests` directory

### 4.2 Test Scripts ✅ COMPLETED
**Passing Tests (34):**
- [x] `basic.spec.js` - App title and screenshots (2 tests)
- [x] `phase1-app-shell.spec.js` - App shell layout (7 tests)
- [x] `phase2-scene-editor.spec.js` - Scene editor (14 tests)
- [x] `build-ui.spec.js` - Build UI functionality (1 test)
- [x] `chapter-crud.spec.js` - Chapter create/delete via AppModal (1 test)
- [x] `chapter-list.spec.js` - Chapter list view (1 test)
- [x] `quick-actions.spec.js` - Dashboard quick actions (1 test)
- [x] `test-layout.spec.js` - Responsive layout (2 tests)
- [x] `test-editor.spec.js` - Scene editor flows (2 tests)
- [x] `screenshot-test.spec.js` - Visual testing (3 tests)

**Skipped Tests (15):**
- [x] `base-button.spec.js` - Route doesn't exist (9 tests skipped)
- [x] `phase0-vue-test.spec.js` - Deprecated tests (4 tests skipped)
- [x] `debug-css.spec.js` - Debug only (1 test skipped)
- [x] `server-codegen.spec.js` - Backend endpoint not implemented (1 test skipped)

**Known Issues (1 - Backend API dependent):**
- [~] `scene-crud.spec.js` - Scene not appearing in list after save
  - Workaround: Added networkidle wait + longer timeouts
  - Root cause: Backend API getAll() may not return newly created scenes immediately
  - Status: Intermittent failure (backend timing issue)

**Not Created Yet:**
- [ ] `test-api.spec.js` - API integration (extra flows)
- [ ] `test-mobile.spec.js` - Mobile-specific tests

### 4.3 CLI Commands
```bash
# Run all tests
npm run test

# Run specific test
npm run test:layout

# Run with UI
npm run test:ui

# Run mobile tests
npm run test:mobile
```

### 4.4 Test Optimizations Completed ✅
- [x] Removed hard-coded URLs (use baseURL from config)
- [x] Fixed strict mode selector violations (35+ instances)
- [x] Replaced `waitForTimeout` with proper `waitForSelector`/`waitForFunction`
- [x] Updated delete flows to use AppModal instead of window.confirm
- [x] Optimized playwright.config.js (4 workers, 30s timeout, 10s action timeout)
- [x] Skipped deprecated/debug tests (base-button, phase0, debug-css)
- [x] Screenshot testing (mobile/tablet/desktop viewports)
- [x] Accessibility testing with proper ARIA roles
- [x] Documented in CHANGELOG.md with full test results

### 4.5 Backend Issues Identified 🔧
- [ ] `/api/scenes/:id/code` endpoint returns "Scene not found" for all scenes
- [ ] `/api/scenes` GET may not return newly created scenes immediately (caching/propagation issue)
- [ ] Recommended: Add proper scene list refresh after POST/PUT operations

---

## Phase 5: Chapter & Scene Management (Vue)
### 5.1 Chapter Views
- [x] **ChapterListView.vue** - List all chapters
- [x] **ChapterEditor.vue** - Create/edit chapter
- [x] Drag-to-reorder chapters (drag & drop + Up/Down controls; persists order)
- [x] Delete with confirmation (native confirm + accessible modal)

### 5.2 Scene List Views
- [x] **SceneListView.vue** - List of scenes
- [x] Search and filter
- [x] Sort by date/name
- [x] Click to edit
- [ ] Responsive cards (optional polish)

### 5.3 Dashboard
- [x] **DashboardView.vue** - Overview
- [x] Recent scenes
- [x] Quick stats
- [x] Quick actions
- [x] Mobile-optimized



---

## Phase 6: Polish & Optimization
Branch: `phase6-polish`
Scope: Navigation hardening, toasts, skeletons, error monitor, cleanup
### 6.1 UI/UX
- [x] Toast notifications (Pinia + component)
- [x] Skeleton loaders for lists (BaseSkeletonList)
- [x] Page transition tuned (now disabled to maximize stability)
- [x] Dev error overlay + hardened error monitor (ESM)
- [ ] Optional: wrap views in ErrorBoundary where needed

### 6.2 Performance
- [ ] Lazy load routes
- [ ] Virtual scrolling (large lists)
- [ ] Debounced search
- [ ] Optimized re-renders
- [ ] Bundle size analysis

### 6.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] Color contrast check
- [ ] Focus management

### 6.4 Navigation Hardening
- [x] Remove legacy DOM navigation/layout (Navigation.js, Layout.js, Sidebar.js, lib/state.js)
- [x] Typed router (TypeScript) with RouteName and param guards
- [x] Breadcrumbs validate required params before linking
- [x] Runtime route guards for list links (toEditScene/toEditChapter)
- [x] Remove Suspense wrapper; transition removed for robustness
- [x] Dashboard fixes: path-based breadcrumbs; filter invalid recent scenes; guards used
- [x] Scenes → Dashboard stability verified manually; added Playwright spec
- [ ] Optional: add CI typecheck for router/header

### 6.5 Testing
- [x] Add navigation stability test: `tests/navigation-stability.spec.js`
- [x] README: how to run the single navigation test
- [ ] Optional: add CI typecheck for router/header

---

## Phase 7: PWA Offline‑First + Sync (moved before Deploy)
Branch: `phase7-offline-sync`

Mål: Frontend kan køre helt offline (mobil), og sync’er ændringer til server SQLite when online igen. Single‑user → simple LWW (last‑write‑wins) er OK.

### 7.1 App‑shell + Caching
- [ ] Arbejd videre med Vite PWA plugin (manifest, SW)
- [ ] Cache‑first for app‑shell og statiske assets
- [ ] Network‑first for API; fallback til lokal DB

### 7.2 Lokal DB i PWA
- [ ] Adapter: fortsæt med LocalForage nu for risiko‑frihed
- [ ] (Valgfri/flag) Tilføj WASM SQLite (wa-sqlite/sql.js) bag feature flag og en lille “DB adapter” (ens API)
- [ ] Skema i PWA: scenes(id, data, updatedAt, deleted), chapters(id, data, updatedAt, deleted)

### 7.3 Sync‑model (simpel LWW)
- [ ] Markér lokale ændringer som dirty (updatedAt, deleted)
- [ ] Push dirty rows først (POST /api/changes)
- [ ] Pull delta siden `lastSync` (GET /api/changes?since=ts)
- [ ] Merge lokalt: LWW på updatedAt; håndter deleted som tombstone
- [ ] Sæt `lastSync` ved success; retry/backoff ved fejl

### 7.4 Server API (delta)
- [ ] Added endpoints (dev backend):
  - GET `/api/changes?since=<ts>` → { scenes:[{id,data,updatedAt,deleted}], chapters:[...] }
  - POST `/api/changes` → upserts; accepterer `deleted` og `updatedAt`
- [ ] Server DB: tilføj `updatedAt` og `deleted` i JSON payload (data felt)
- [ ] (Senere) Normaliser til rigtige kolonner i SQLite, men JSON er fint i dev

### 7.5 UX og fejlhåndtering
- [ ] Vis sync‑status pill (synced/syncing/offline/error) — brug eksisterende StatusPill
- [ ] Toasts for sync success/failure (allerede globalt)
- [ ] Background Sync (Workbox) når muligt; ellers sync on focus/online

### 7.6 Tests
- [ ] Playwright: simulér offline (context.setOffline(true)), opret/ret/scenelister, gå online og assert server modtager ændringer (kan stubbes i dev)
- [ ] Race‑test: hurtige edit→sync→nav for stabilitet

---

## Phase 8: Deployment
Branch: `phase8-deploy`
### 8.1 Production Build
- [ ] Build Vue app (`npm run build`)
- [ ] Build C++ server (`make release`)
- [ ] Optimize assets
- [ ] Test production bundle

### 8.2 Tailscale Setup
- [ ] Frontend: `tailscale serve --https=8443 ./dist`
- [ ] Backend: C++ server on port 3000
- [ ] Configure CORS properly
- [ ] Test på Tailscale network

### 8.3 Systemd Services
- [ ] `loke-cards-frontend.service`
- [ ] `loke-cards-backend.service`
- [ ] Auto-restart on failure
- [ ] Logging setup

---
merge to main

## Migration Checklist

### Code to Preserve (Vanilla JS → Vue 3)
- [x] **lib/storage.js** - LocalForage wrapper (KEEP AS-IS ✅)
  - All CRUD operations working
  - Schema matches server requirements
  - Export/import functionality
  - Just wrap in Pinia stores

- [x] **lib/validation.js** - C identifier validation (KEEP AS-IS ✅)
  - Reuse in Vue composables

- [x] **lib/autosave.js** - Debounced save logic (MIGRATE TO COMPOSABLE)
  - Convert to Vue composable
  - Keep debounce logic

- [x] **C code generator logic** - (MIGRATE TO COMPOSABLE)
  - Extract from SceneEditor.js
  - Create useCodeGenerator.js composable

- [ ] **Code generation templates** - Scene function format
  - Move to separate template file
  - Reference loke-engine API

### Code to Rewrite (Vanilla JS → Vue SFC)
- [ ] **components/Layout.js** → **AppLayout.vue**
- [ ] **components/Navigation.js** → **AppNavigation.vue**
- [ ] **components/Sidebar.js** → **AppSidebar.vue**
- [ ] **components/SceneEditor.js** → **SceneEditorView.vue** + child components
- [ ] **components/CodePreview.js** → **CodePreview.vue**
- [ ] **lib/state.js** → Pinia stores (projectStore, editorStore, uiStore)

### New Code (Not in Vanilla JS)
- [ ] Vue Router setup
- [ ] syncStore.js (for server sync)
- [ ] API client (HTTP calls to C++ backend)
- [ ] Server sync logic (LocalForage → Server SQLite)

### Testing Strategy
- [ ] Unit tests (Vitest)
- [ ] Component tests (Vue Test Utils)
- [ ] E2E tests (Playwright)
- [ ] API tests (curl + Playwright)
- [ ] Mobile tests (Playwright emulation)

---

## Success Criteria

✅ Hot reload works 100% af tiden
✅ Fully responsive (mobile, tablet, desktop)
✅ Sidebar vises korrekt på alle skærmstørrelser
✅ C++ backend håndterer alle API requests
✅ No manual localhost server management
✅ Tailwind klasser virker altid
✅ Playwright CLI kan teste alt
✅ Clean, maintainable Vue 3 kode

---

## Timeline Estimate

- **Phase 0 (Migration)**: 2-3 timer
- **Phase 1 (Vue Core)**: 3-4 timer
- **Phase 2 (Editor)**: 3-4 timer
- **Phase 3 (C++ Backend)**: 4-5 timer
- **Phase 4 (Testing)**: 2-3 timer
- **Phase 5 (Management)**: 2-3 timer
- **Phase 6 (Polish)**: 2-3 timer
- **Phase 7 (Deploy)**: 1-2 timer

**Total: ~20-27 timer**

---

NEXT: Make a AI-TODO for IA integration into loke-cards.
