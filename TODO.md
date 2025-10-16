# TODO - Loke Cards

## ⚠️ MIGRATION NOTICE

**Original TODO is deprecated. Project is being rewritten with Vue 3.**

See **TODO-VUE.md** for the complete Vue 3 migration plan.

---

## Migration Decision

After completing Phase 0-2 with Vanilla JS, we discovered:
- ❌ Hot reload issues with dynamic Tailwind classes
- ❌ Sidebar not rendering consistently
- ❌ Manual DOM manipulation became complex
- ❌ Difficult to debug without proper tooling

**New Approach: Vue 3 + Vite + Tailwind + C++ Backend**

All future development will follow **TODO-VUE.md**

---

## Completed Work (Vanilla JS - Preserved)

### Phase 0: Project Setup ✅
- Vite + Tailwind CSS setup
- LocalForage storage
- Git repository and branches
- Tailscale server configuration

### Phase 1: Core Architecture ✅
- PWA manifest and service worker
- Navigation and Sidebar components (partially working)
- State management (event emitter pattern)
- Auto-save functionality

### Phase 2: Scene Card Editor ✅
- Scene ID validation
- Chapter dropdown
- Scene text editor
- Choices and state changes lists
- C code generator
- Code preview component

**Issues with vanilla JS:**
- Sidebar visibility problems
- Tailwind classes not always applied
- Hot reload inconsistent
- Complex manual DOM updates

---

## Next Steps

1. ✅ Backup vanilla JS code → `vanilla-js-backup` branch
2. ⏳ Follow **TODO-VUE.md** Phase 0: Technology Migration
3. ⏳ Vue 3 project setup
4. ⏳ Playwright CLI testing setup
5. ⏳ C++ backend implementation

---

## References

- **TODO-VUE.md** - Complete Vue 3 migration plan
- **vanilla-js-backup** branch - Preserved original code
- **vue-rewrite** branch - New Vue 3 implementation
- **CHANGELOG.md** - Migration notes and history

---

## Current Status: Migration to Vue 3 in Progress

**Branch:** `vue-rewrite`
**Plan:** TODO-VUE.md
**Timeline:** ~20-27 hours
