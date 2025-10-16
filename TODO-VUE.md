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

## Phase 1: Core Vue Architecture (Fully Responsive)
New git branch
layout @doc/vue-layout.md

### 1.1 Vue Project Structure
- [ ] Create `/src/components` struktur (partially done - has Layout, Navigation, Sidebar ✅)
- [ ] Create `/src/views` for pages
- [ ] Create `/src/stores` for Pinia
- [ ] Create `/src/composables` for reusable logic
- [ ] Keep `/src/lib` for utilities (has storage.js ✅, state.js, validation.js ✅, autosave.js ✅)
- [ ] Setup main.js with Vue app (currently vanilla JS)
- [ ] Configure router
- [ ] Configure Pinia store
- [ ] No database initialization needed - LocalForage ready ✅

## Layout
The layout must adhere to the following guidelines:
- Responsive grid/flex system
- Mobile: Stack vertical
- Desktop: Sidebar + main content
- Test on all breakpoints (sm, md, lg, xl)

see in @vue-layout.md in /doc for design goals

### 1.2 Responsive Layout Components (Mobile-First)
- [ ] **AppLayout.vue** - Main layout wrapper
  - Responsive grid/flex system
  - Mobile: Stack vertical
  - Desktop: Sidebar + main content
  - Test på alle breakpoints (sm, md, lg, xl)

- [ ] **AppNavigation.vue** - Top navigation
  - Logo + title
  - Hamburger menu (mobile)
  - Desktop: Horizontal nav links
  - Sync status indicator
  - Fully responsive med Tailwind

- [ ] **AppSidebar.vue** - Sidebar/Drawer
  - Mobile: Slide-in drawer
  - Desktop: Fixed sidebar
  - Quick actions (New Scene, New Chapter)
  - Project info display
  - Tailwind transitions

- [ ] **BaseButton.vue** - Reusable button
  - Props: variant, size, loading
  - Touch-friendly (44px min)
  - Responsive sizing

- [ ] **BaseInput.vue** - Reusable input
  - Props: type, label, error, validation
  - Responsive sizing
  - Tailwind styling
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 1.3 Vue Router Setup
- [ ] `/` - Dashboard view
- [ ] `/scenes` - Scene list view
- [ ] `/scene/new` - New scene editor
- [ ] `/scene/:id` - Edit scene
- [ ] `/chapters` - Chapter management
- [ ] Mobile-friendly transitions
- [ ] Back button support

### 1.4 Pinia State Store (Wrap existing storage.js)
- [ ] **projectStore.js** - Project state
  - currentProject
  - scenes array (from LocalForage storage.js ✅)
  - chapters array (from LocalForage storage.js ✅)
  - Actions: Wrap storage.js functions (getCurrentProject, getAllScenes, getAllChapters)

- [ ] **editorStore.js** - Editor state
  - currentScene
  - isDirty (unsaved changes)
  - Actions: Wrap storage.js (saveScene, getScene, saveDraft, getDraft)

- [ ] **syncStore.js** - Sync state (NEW)
  - lastSyncTime
  - pendingChanges count
  - syncStatus (idle, syncing, error)
  - Actions: syncToServer, pullFromServer, getSyncQueue
  - Track which scenes need sync (add 'synced' flag to storage.js schema ✅ already there!)

- [ ] **uiStore.js** - UI state
  - sidebarOpen (mobile)
  - currentView
  - Actions: toggleSidebar, setCurrentView
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 1.6 Responsive Testing
- [ ] Test på Chrome mobile emulator (375px, 768px, 1024px)
- [ ] Test med Playwright CLI
- [ ] Verify hot reload works på alle komponenter
- [ ] Test Tailwind breakpoints virker korrekt
- [ ] Document all responsive behaviors

---
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
## Phase 2: Scene Editor (Fully Functional & Responsive)

### 2.1 Scene Editor View Component
- [ ] **SceneEditorView.vue** - Main editor page
  - Responsive 2-column layout (desktop)
  - Single column på mobile
  - Form + Preview side-by-side
  - Mobile: Tabs (Form / Preview)

### 2.2 Scene Form Components
- [ ] **SceneIdInput.vue**
  - Real-time C identifier validation
  - Error messages
  - Debounced validation (composable)
  - Responsive width

- [ ] **ChapterSelect.vue**
  - Dropdown med chapters fra store
  - Create new chapter inline
  - Searchable på desktop
  - Mobile-friendly select

- [ ] **SceneTextEditor.vue**
  - Auto-growing textarea
  - Character count
  - Markdown preview toggle (future)
  - Mobile-optimized keyboard

- [ ] **ChoicesList.vue**
  - Dynamic list (add/remove)
  - Drag-to-reorder (desktop)
  - Each choice:
    - Text input
    - Next scene select
    - Enabled checkbox
  - Responsive cards/rows

- [ ] **StateChangesList.vue**
  - Dynamic list (add/remove)
  - Each state change:
    - Variable autocomplete
    - Operator select (=, +=, -=, etc)
    - Value input
  - Responsive layout
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 2.3 C Code Generator (Composable) - Loke-Engine Compatible
- [ ] **useCodeGenerator.js** composable
  - `generateSceneCode(sceneData)` function
  - Proper C string escaping
  - Template system for includes
  - **Generate loke-engine compatible C code**
  - **Follow loke-engine scene API (check manpages/docs)**
  - **Use correct GameState structure**
  - **Include proper loke-engine headers**
  - Return reactive code string

- [ ] **CodePreview.vue** component
  - Syntax highlighted C code
  - Copy to clipboard button
  - Toggle visibility
  - Responsive width
  - Mobile: Full screen modal
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 2.4 Form Validation (Composable) - Loke-Engine Rules
- [ ] **useSceneValidation.js**
  - `validateSceneId()` - C identifier check (loke-engine naming conventions)
  - `validateRequired()` - Required fields
  - `validateChoices()` - At least one choice (loke-engine minimum)
  - **Validate against loke-engine GameState variables**
  - **Check scene function signature compatibility**
  - Return reactive errors object

- [ ] Real-time validation i form
- [ ] Disable save når invalid
- [ ] Visual error indicators (Tailwind)

### 2.5 Auto-save (Composable) - REUSE EXISTING
- [ ] **Migrate lib/autosave.js to composable**
  - Already has debounced save (2 seconds) ✅
  - Already saves to LocalForage (saveDraft) ✅
  - Add: Mark as pending sync (set scene.synced = false)
  - Keep: Visual indicator (saving/saved)
  - Add: Syncing state when pushing to server
  - Works på både desktop og mobile

### 2.6 API Integration
- [ ] Create `/src/api/client.js`
  - Axios eller fetch wrapper
  - Base URL: `http://localhost:3000/api`
  - Error handling
  - Retry logic

- [ ] **POST /api/scenes** - Save scene
- [ ] **GET /api/scenes/:id** - Load scene
- [ ] **PUT /api/scenes/:id** - Update scene
- [ ] Test med Playwright CLI
- [ ] Mobile network simulation
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 2.7 Responsive Testing
- [ ] Test entire editor på mobile (375px)
- [ ] Test på tablet (768px)
- [ ] Test på desktop (1024px+)
- [ ] Verify form works med touch
- [ ] Test keyboard navigation
- [ ] Playwright automation test
- [ ] Document all edge cases

---

## Phase 3: C++ Backend Implementation
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
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
- [ ] `server/main.cpp` - Entry point
- [ ] `server/routes.cpp` - API routes
- [ ] `server/database.cpp` - SQLite wrapper
- [ ] `server/models.cpp` - Data models
- [ ] CORS headers for Tailscale
- [ ] JSON serialization/deserialization
- [ ] Error handling and logging
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.3 API Endpoints
- [ ] `POST /api/scenes` - Create scene
- [ ] `GET /api/scenes/:id` - Get scene
- [ ] `PUT /api/scenes/:id` - Update scene
- [ ] `DELETE /api/scenes/:id` - Delete scene
- [ ] `GET /api/chapters` - List chapters
- [ ] `POST /api/chapters` - Create chapter
- [ ] `GET /api/scenes` - List all scenes
- [ ] Health check endpoint

### 3Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.4 C Code Generation - Loke-Engine Format
- [ ] `server/codegen.cpp` - C code generator
- [ ] **Reference loke-engine documentation**:
  - Check `man loke-scene` for scene API
  - Read `~/loke-engine/include/loke/scene.h`
  - Use `gh api repos/LokeEngine/loke-engine` for latest format
- [ ] Scene function template (loke-engine compatible)
- [ ] Proper string escaping
- [ ] Include loke-engine headers
- [ ] Generate complete .c files matching loke-engine structure
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 3.5 Build System
- [ ] Makefile for C++ server
- [ ] Auto-restart on code change (nodemon-style)
- [ ] Systemd service (for Tailscale deployment)
- [ ] Test compilation on Ubuntu

---

## Phase 4: Browser CLI Testing with Playwright
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 4.1 Playwright Setup
- [ ] Install Playwright
- [ ] Install Chrome browser binary
- [ ] Configure playwright.config.js
- [ ] Create `/tests` directory

### 4.2 Test Scripts
- [ ] `test-layout.spec.js` - Test responsive layout
- [ ] `test-editor.spec.js` - Test scene editor
- [ ] `test-api.spec.js` - Test API integration
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

### 4.4 Visual Testing
- [ ] Screenshot comparison
- [ ] Layout shift detection
- [ ] Accessibility testing
- [ ] Performance metrics

---

## Phase 5: Chapter & Scene Management (Vue)
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 5.1 Chapter Views
- [ ] **ChapterListView.vue** - List all chapters
- [ ] **ChapterEditor.vue** - Create/edit chapter
- [ ] Drag-to-reorder chapters
- [ ] Delete with confirmation

### 5.2 Scene List Views
- [ ] **SceneListView.vue** - Grid/list of scenes
- [ ] Search and filter
- [ ] Sort by date/name
- [ ] Click to edit
- [ ] Responsive cards

### 5.3 Dashboard
- [ ] **DashboardView.vue** - Overview
- [ ] Recent scenes
- [ ] Quick stats
- [ ] Quick actions
- [ ] Mobile-optimized

---

## Phase 6: Polish & Optimization
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 6.1 UI/UX
- [ ] Toast notifications (Vue component)
- [ ] Loading states
- [ ] Error boundaries
- [ ] Skeleton loaders
- [ ] Smooth transitions

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

---

## Phase 7: Deployment
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 7.1 Production Build
- [ ] Build Vue app (`npm run build`)
- [ ] Build C++ server (`make release`)
- [ ] Optimize assets
- [ ] Test production bundle

### 7.2 Tailscale Setup
- [ ] Frontend: `tailscale serve --https=8443 ./dist`
- [ ] Backend: C++ server on port 3000
- [ ] Configure CORS properly
- [ ] Test på Tailscale network

### 7.3 Systemd Services
- [ ] `loke-cards-frontend.service`
- [ ] `loke-cards-backend.service`
- [ ] Auto-restart on failure
- [ ] Logging setup

---

## Phase 8: PWA (Optional - Sidste fase)
Can we merge git branch to main only yes if all is tested and confirmed working?
New git branch for dev.
### 8.1 PWA Setup
- [ ] Vite PWA plugin
- [ ] Service worker
- [ ] Offline support
- [ ] Install prompt
- [ ] App manifest

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

## Current Status: Ready to Start Phase 0
