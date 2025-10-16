# TODO - Loke Cards Vue 3 Rewrite

## Technology Stack Decision

### Frontend
- **Vue 3** (Composition API) - Reactive, lettere end React
- **Vite** - Lynhurtig build og HMR
- **Tailwind CSS** - Utility-first styling
- **Pinia** - State management (officiel Vue store)
- **Vue Router** - Client-side routing
- **PWA** (Phase 8) - Valgfrit til sidst

### Backend
- **C++ med httplib** - Lightweight HTTP server
- **SQLite** - Embedded database for scenes/chapters
- **JSON** - API kommunikation
- **Port 3000** - Backend API server
- **Tailscale** - Netværk (frontend på :8443, backend på :3000)

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

### 0.2 Vue 3 Project Setup
- [ ] Remove old dependencies (keep LocalForage for now)
- [ ] Install Vue 3 + Vite
- [ ] Install Tailwind CSS (with Vue plugin)
- [ ] Install Pinia for state management
- [ ] Install Vue Router
- [ ] Configure Vite for Vue + Tailwind
- [ ] Test basic Vue + Tailwind works

### 0.3 C++ Backend Setup
- [ ] Create `/server` directory
- [ ] Install cpp-httplib (header-only HTTP server)
- [ ] Install sqlite3 (embedded database)
- [ ] Create basic HTTP server on port 3000
- [ ] Test CORS headers for Tailscale
- [ ] Create Makefile for C++ compilation
- [ ] Test server responds to curl

### 0.4 Development Tools
- [ ] Install Playwright for browser CLI testing
- [ ] Configure Playwright for Chrome
- [ ] Create test script for automated browser checks
- [ ] Install Vue DevTools browser extension
- [ ] Configure ESLint + Prettier for Vue
- [ ] Test hot reload works perfectly

---

## Phase 1: Core Vue Architecture (Fully Responsive)

### 1.1 Vue Project Structure
- [ ] Create `/src/components` struktur
- [ ] Create `/src/views` for pages
- [ ] Create `/src/stores` for Pinia
- [ ] Create `/src/composables` for reusable logic
- [ ] Create `/src/utils` for helpers
- [ ] Setup main.js with Vue app
- [ ] Configure router
- [ ] Configure Pinia store

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

### 1.3 Vue Router Setup
- [ ] `/` - Dashboard view
- [ ] `/scenes` - Scene list view
- [ ] `/scene/new` - New scene editor
- [ ] `/scene/:id` - Edit scene
- [ ] `/chapters` - Chapter management
- [ ] Mobile-friendly transitions
- [ ] Back button support

### 1.4 Pinia State Store
- [ ] **projectStore.js** - Project state
  - currentProject
  - scenes array
  - chapters array
  - Actions: loadProject, saveProject

- [ ] **editorStore.js** - Editor state
  - currentScene
  - isDirty (unsaved changes)
  - Actions: saveScene, loadScene, resetEditor

- [ ] **uiStore.js** - UI state
  - sidebarOpen (mobile)
  - syncStatus
  - Actions: toggleSidebar, setSyncStatus

### 1.5 Responsive Testing
- [ ] Test på Chrome mobile emulator (375px, 768px, 1024px)
- [ ] Test med Playwright CLI
- [ ] Verify hot reload works på alle komponenter
- [ ] Test Tailwind breakpoints virker korrekt
- [ ] Document all responsive behaviors

---

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

### 2.5 Auto-save (Composable)
- [ ] **useAutoSave.js**
  - Debounced save (2 seconds)
  - Save to localStorage (draft)
  - Visual indicator (saving/saved)
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

### 3.2 C++ HTTP Server
- [ ] `server/main.cpp` - Entry point
- [ ] `server/routes.cpp` - API routes
- [ ] `server/database.cpp` - SQLite wrapper
- [ ] `server/models.cpp` - Data models
- [ ] CORS headers for Tailscale
- [ ] JSON serialization/deserialization
- [ ] Error handling and logging

### 3.3 API Endpoints
- [ ] `POST /api/scenes` - Create scene
- [ ] `GET /api/scenes/:id` - Get scene
- [ ] `PUT /api/scenes/:id` - Update scene
- [ ] `DELETE /api/scenes/:id` - Delete scene
- [ ] `GET /api/chapters` - List chapters
- [ ] `POST /api/chapters` - Create chapter
- [ ] `GET /api/scenes` - List all scenes
- [ ] Health check endpoint

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

### 3.5 Build System
- [ ] Makefile for C++ server
- [ ] Auto-restart on code change (nodemon-style)
- [ ] Systemd service (for Tailscale deployment)
- [ ] Test compilation on Ubuntu

---

## Phase 4: Browser CLI Testing with Playwright

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

### 8.1 PWA Setup
- [ ] Vite PWA plugin
- [ ] Service worker
- [ ] Offline support
- [ ] Install prompt
- [ ] App manifest

---

## Migration Checklist

### Code to Preserve
- [x] C code generator logic
- [x] Scene validation functions
- [x] Storage schema design
- [x] LocalForage as fallback

### Code to Rewrite
- [ ] All UI components (Vue SFC)
- [ ] State management (Pinia)
- [ ] Routing (Vue Router)
- [ ] API client (TypeScript/JS)

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
