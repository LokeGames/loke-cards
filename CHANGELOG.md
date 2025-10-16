# Changelog

All notable changes to Loke Cards will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 1 - App Shell Layout - 2025-10-16

### Added
- **Full-screen app shell layout** (`h-screen w-screen`)
  - App.vue converted to full viewport layout
  - Header + Sidebar + Main content structure
  - Only main content scrolls, not page
  - Dark mode support (`bg-gray-50 dark:bg-gray-900`)

- **Dark mode implementation**
  - `tailwind.config.js` - Added `darkMode: 'class'`
  - ThemeToggle.vue component with sun/moon icons
  - localStorage persistence
  - System preference detection
  - Adds/removes `dark` class on `<html>` element

- **AppHeader.vue** - Top navigation component
  - Logo + "Loke Cards" title
  - Hamburger menu button (mobile only)
  - ThemeToggle integration
  - StatusPill (sync status indicator)
  - Sticky header (h-14 md:h-16)
  - Fully responsive with Tailwind

- **AppSidebar.vue** - Responsive sidebar/drawer
  - Mobile: Slide-in drawer with backdrop overlay
  - Desktop: Fixed sidebar (w-64, always visible)
  - Quick actions (New Scene, New Chapter)
  - Project info display (name, scenes count, chapters count)
  - Navigation links (Dashboard, Scenes, Chapters, Code, Settings)
  - Smooth Tailwind transitions

- **UI Store (Pinia)** - `src/stores/ui.js`
  - `isSidebarOpen` - Mobile drawer state
  - `currentProject` - Current project info
  - `stats` - Scene and chapter counts
  - Actions: toggleSidebar, openSidebar, closeSidebar, setCurrentProject, updateStats

- **Placeholder view components**
  - CodeView.vue - Generated C code view
  - SettingsView.vue - Settings page
  - All other views exist from dev branch merge

- **Playwright tests** - `tests/phase1-app-shell.spec.js`
  - 6 out of 7 tests passing
  - Tests: Header visibility, sidebar responsiveness, dark mode toggle, navigation, StatusPill
  - Mobile viewport testing (375px width)

### Changed
- App.vue - Complete rewrite from centered layout to full-screen app shell
- Router configuration - Added meta data for page titles and scroll behavior
- Tailwind config - Added dark mode class strategy

### Testing
- Playwright CLI tests: 6/7 passed ✅
- Responsive testing on mobile (375px), tablet (768px), desktop (1024px+) ✅
- Hot reload verified working ✅
- Dark mode toggle verified ✅

### Migration to Vue 3 - 2025-10-16

### Added
- C++ backend setup (Phase 0.3)
  - Created `/server` directory with `cpp-httplib` and `sqlite3`.
  - Basic HTTP server on port 3000 with CORS for Tailscale.
  - Makefile for compilation and Doxygen man page generation.
  - C code generator (server/src/code_generator.cpp) - 100% loke-engine compatible
  - File manager (server/src/file_manager.cpp) - Manages project/chapter/scene structure
  - REST API with 8 endpoints (health, projects, chapters, scenes)
  - Test scene generated and verified: `projects/test-adventure/chapter01/forest_entrance.c`
- Configured ESLint and Prettier for Vue.
- Added a basic Playwright test script.

### Fixed
- Vite dev server port to 8081 to match Tailscale proxy configuration.


**Decision: Rewrite with Vue 3 + C++ Backend**

After completing Phase 0-2 with Vanilla JavaScript, we encountered fundamental issues:
- Hot reload inconsistent with dynamic Tailwind classes in JS
- Sidebar component visibility problems
- Manual DOM manipulation became unmaintainable
- Difficult debugging without framework devtools

**New Technology Stack:**
- Frontend: Vue 3 + Vite + Tailwind + Pinia + Vue Router
- Backend: C++ with httplib + SQLite (replacing localStorage/LocalForage)
- Testing: Playwright CLI for browser automation
- No localhost URLs - Tailscale serve only

**Branches:**
- `vanilla-js-backup` - Preserved original work
- `vue-rewrite` - New Vue 3 implementation (current)
- `dev` - Original development branch

**Migration Files:**
- `TODO.md` - Now deprecated, points to TODO-VUE.md
- `TODO-VUE.md` - Complete Vue 3 migration plan (20-27 hours)

---

## [Vanilla JS Version] - 2025-10-16 (Deprecated)

### Added
- Initial project setup with Vite, Tailwind CSS v4, and PWA support
- LocalForage for offline storage with 4 separate stores (scenes, chapters, drafts, projects)
- Basic folder structure (src/, public/, doc/, tests/)
- Development environment configuration
- Vite dev server on port 8081 (Tailscale proxied on port 8443)
- PWA manifest and service worker configuration with Workbox
- Responsive layout with mobile hamburger menu and drawer sidebar
- Navigation component with sync status indicator
- State management system with event emitter pattern
- Auto-save functionality with 2-second debounce
- Scene Editor component with full form functionality
  - Scene ID validation (valid C identifier)
  - Dynamic chapter dropdown loaded from storage
  - Multi-line textarea for scene text
  - Dynamic choices list (add/remove, text, next scene, enabled)
  - Dynamic state changes list (add/remove, variable, operator, value)
  - Form validation with inline error messages
  - Cancel button returning to dashboard
- C code generator with proper string escaping
- Code preview component with toggle show/hide
- Copy-to-clipboard functionality for generated C code
- Real-time C code generation on form input
- Scene save to LocalForage with success/error messaging
- Draft auto-save every 2 seconds
- Default chapter creation (chapter01, chapter02) if none exist
- PWA install button in navigation
- Validation utilities for C identifiers

### Changed
- Updated Tailwind CSS from v3 to v4 with @tailwindcss/postcss plugin
- Changed base URL from /cards subpath to dedicated port 8443
- Exported loadDashboard and generateCCode functions for reuse
- Made createSceneEditor async to support dynamic chapter loading

### Fixed
- Tailscale serve path rewriting issues (solved with dedicated port)
- Port conflicts with multiple Vite dev servers
- Sidebar overlapping main content on desktop
- Mobile touch interaction with touch-manipulation class
- getCurrentProject naming conflict in state.js

### Removed
- HTTPS configuration from Vite (handled by Tailscale serve)

---

## Release History

<!-- Releases will be documented here -->
