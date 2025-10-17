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
Merged to dev on 2025-10-16
---
## Phase 2: Scene Editor (Fully Functional & Responsive) ✅ COMPLETED
Branch: `phase2-scene-editor` → **MERGED TO DEV** ✅
Commits: `45888e9`, `4e7c70b`, `6ab1064`, `b4aaf17`, `dd10020`, `386f244`, `cdb28d8`
Merged: 2025-10-17 (commit `cdb28d8`)

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
    - Text input (required)
    - Next scene input (optional for NULL)
    - Enabled checkbox (default true)
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
  - `validateChoices()` - At least 1, max 10 choices (loke-engine limit)
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
- [x] Test med Playwright CLI ✅
- [x] Merged to dev branch (commit `cdb28d8`) ✅

### 2.7 Responsive Testing ✅ COMPLETED
- [x] Test entire editor på mobile (375px) ✅
- [x] Test på tablet (768px) ✅
- [x] Test på desktop (1024px+) ✅
- [x] Verify form works med touch ✅
- [x] Test keyboard navigation ✅
- [x] Playwright automation test (14/14 tests passed) ✅
  - Test file: `tests/phase2-scene-editor.spec.js`
  - Tests: Page load, validation, form components, responsive layouts, dark mode
  - Commit: `386f244`
- [x] Document all edge cases ✅
- [x] Screenshots captured and committed (commit `747ce71`) ✅
  - Mobile: dashboard-mobile.png, scene-editor-mobile.png
  - Desktop: scene-editor-desktop.png

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

Can we merge git branch to main only yes if all is tested and confirmed working?
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

### 4.5 Robustness Testing & Error Handling
**Mål**: Platformen skal være fejltolerant og aldrig crashe - graceful degradation med brugervenlige fejlmeddelelser.

#### 4.5.1 Error Boundary Implementation
- [ ] **Vue Global Error Handler**
  - Catch uncaught errors i components
  - Log til console + vis brugervenlig toast
  - Prevent white screen of death
  - Test: Throw error i component, verify recovery

- [ ] **Router Error Handling**
  - Catch navigation failures
  - Fallback til 404 page ved invalid routes
  - Handle missing route params gracefully
  - Test: Navigate til `/scene/invalid-id`

- [ ] **Store Error Boundaries**
  - Try-catch wrapping i alle Pinia actions
  - Return error objects instead of throwing
  - Update UI state ved fejl (loading: false, error: message)
  - Test: Force storage failure, verify UI response

#### 4.5.2 API Error Handling Strategy
- [ ] **Network Failure Handling**
  - Detect offline state (navigator.onLine)
  - Queue failed requests for retry
  - Show "Offline" status pill
  - Test: Disable network, verify queuing

- [ ] **HTTP Error Responses**
  - 400 Bad Request → Show validation errors
  - 401 Unauthorized → Redirect to auth (future)
  - 404 Not Found → Show "Scene not found" message
  - 500 Server Error → Show "Server unavailable, try again"
  - Test: Mock hver HTTP status code

- [ ] **Timeout Handling**
  - Set request timeout (10 seconds)
  - Show "Request taking too long" message
  - Cancel button for long requests
  - Test: Delay server response 15 seconds

- [ ] **Retry Strategy**
  - Automatic retry for network errors (max 3 attempts)
  - Exponential backoff (1s, 2s, 4s)
  - Manual retry button ved persisterende fejl
  - Test: Force 2 failures, verify 3rd retry succeeds

#### 4.5.3 LocalForage Error Handling
- [ ] **Storage Quota Exceeded**
  - Catch QuotaExceededError
  - Show "Storage full, please delete old drafts"
  - Provide cleanup utility
  - Test: Fill storage, verify graceful message

- [ ] **Corrupted Data Recovery**
  - Validate data structure ved load
  - Fallback til empty state ved corruption
  - Backup mechanism (export/import)
  - Test: Write invalid JSON, verify recovery

- [ ] **Missing Store Initialization**
  - Auto-initialize stores hvis missing
  - Default empty arrays for scenes/chapters
  - Never throw on missing data
  - Test: Clear IndexedDB, verify auto-init

#### 4.5.4 Form Validation Error States
- [ ] **Scene Editor Validation**
  - Show errors inline (red border + message)
  - Disable save button når invalid
  - Persist partial data i draft (auto-save fortsætter)
  - Test: Submit empty form, verify error messages

- [ ] **Required Field Handling**
  - Mark required fields visuelt (*)
  - Show "This field is required" message
  - Focus first invalid field ved submit
  - Test: Leave required field empty, verify focus

- [ ] **Invalid C Identifier**
  - Real-time validation med debounce
  - Show allowed characters (a-z, 0-9, _)
  - Suggest valid alternative (replace spaces med _)
  - Test: Input "scene-name!", verify suggestion

#### 4.5.5 Component Isolation & Crash Recovery
- [ ] **Independent Component Failures**
  - Each component wrapped i error boundary
  - If SceneTextEditor crashes, rest of form works
  - Show "Component error" placeholder
  - Test: Throw error i ChoicesList, verify editor still works

- [ ] **Graceful Degradation**
  - If code preview fails, form still saves
  - If chapter dropdown fails, show text input fallback
  - If theme toggle fails, use default light mode
  - Test: Break CodePreview, verify save works

- [ ] **Recovery Actions**
  - "Reload component" button ved fejl
  - "Reset form" button ved total failure
  - "Export draft" button som fallback
  - Test: Trigger error, use recovery button

#### 4.5.6 Stress Testing med Playwright
- [ ] **Large Data Sets**
  - Test: Create 1000 scenes, verify UI performance
  - Test: Scene with 2048 characters, verify rendering
  - Test: 10 choices per scene (max), verify layout
  - Success: No crashes, <100ms render time

- [ ] **Rapid User Actions**
  - Test: Click save button 10 times rapidly
  - Test: Toggle sidebar 50 times quickly
  - Test: Type in all fields simultaneously (fast)
  - Success: No duplicate saves, no UI glitches

- [ ] **Memory Leaks**
  - Test: Navigate between routes 100 times
  - Test: Open/close editor 50 times
  - Monitor: Browser memory usage (should stay <200MB)
  - Success: No memory increase >10MB

- [ ] **Concurrent Operations**
  - Test: Save scene while syncing to server
  - Test: Load scene while auto-save triggers
  - Test: Edit form while code generation runs
  - Success: No race conditions, data consistency

#### 4.5.7 Offline/Online Transition
- [ ] **Offline Mode**
  - Test: Go offline mid-save, verify queue
  - Test: Work offline 5 minutes, go online, verify sync
  - Test: Edit same scene offline on 2 devices, verify conflict resolution
  - Success: No data loss, clear conflict messages

- [ ] **Network Interruption Recovery**
  - Test: Disconnect during API call, verify retry
  - Test: Reconnect after 10 seconds, verify auto-sync
  - Test: Partial response (connection drop mid-transfer)
  - Success: All data syncs eventually

#### 4.5.8 Edge Cases & Boundary Conditions
- [ ] **Empty State Handling**
  - Test: New project with no scenes/chapters
  - Test: Scene with no choices (validation error)
  - Test: Choice with empty text (validation error)
  - Success: Clear empty state messages, no crashes

- [ ] **Special Characters**
  - Test: Scene text with unicode emoji 🎮
  - Test: Scene ID with invalid chars (é, ñ, 中)
  - Test: Quotes in scene text ("Hello")
  - Success: Proper escaping, validation, no injection

- [ ] **Browser Compatibility**
  - Test: Chrome, Firefox, Safari (Playwright)
  - Test: Mobile Chrome, Mobile Safari
  - Test: Old browser (Chrome 90, 1 year old)
  - Success: Core features work everywhere

#### 4.5.9 Success Criteria
- [ ] **No Crashes**: 100 Playwright stress tests, 0 crashes
- [ ] **Error Messages**: All errors show user-friendly messages (no raw stack traces)
- [ ] **Data Integrity**: No data loss i 1000 save operations under stress
- [ ] **Recovery**: User kan altid recover fra fejl (reload, reset, export)
- [ ] **Performance**: UI responds <100ms even under load
- [ ] **Offline First**: App fungerer 100% offline (no server required)

#### 4.5.10 Error Logging & Monitoring
- [ ] **Console Logging Strategy**
  - Error: Red console errors med stack trace
  - Warning: Yellow warnings for non-critical issues
  - Info: Blue logs for state changes (dev mode only)
  - Test: Trigger error, verify console output

- [ ] **User Feedback Mechanism**
  - Toast notifications for all errors
  - Success messages for saves/syncs
  - Progress indicators for long operations
  - Test: Each error type shows correct toast

- [ ] **Error Report Export**
  - "Export error log" button i Settings
  - JSON export med last 100 errors
  - Include: timestamp, component, message, stack
  - Test: Trigger errors, export, verify format

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
