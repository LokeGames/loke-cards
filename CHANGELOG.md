# Changelog

All notable changes to Loke Cards will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Migration to Vue 3 - 2025-10-16

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
