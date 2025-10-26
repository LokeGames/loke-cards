# Stability Strategy Guide

This document outlines strategies to prevent project breakage during development.

## 🎯 Core Principle: Controlled Boundaries

The dual-topbar navigation system provides natural stability boundaries:

```
AppHeader (Level 1) ← Global app concerns
  ↓
TopNavBar (Level 2) ← Module switching + Actions
  ↓
Module Views (Internal) ← Feature-specific navigation
```

## 🛡️ Key Stability Mechanisms

### 1. Navigation as State Boundary

**Why it works:**
- Project switching triggers browser navigation to `/` then `/cards`
- Browser navigation = automatic state reset
- No accumulated stale state between project switches
- No complex cross-component reactivity tracking needed

**Practice:**
```typescript
// ✅ GOOD: Use navigation for state resets
clearCurrentProject();
goto('/');  // Triggers ProjectDashboard
// User selects project → auto-goto('/cards') → Fresh state

// ❌ BAD: Try to manually reset all state
projectState.currentProject = null;
projectState.chapters = [];
projectState.scenes = [];
// ... (easy to forget something)
```

### 2. Module Isolation

**Front Package Responsibilities:**
- App shell and routing
- Global navigation (AppHeader + TopNavBar)
- Project management (dashboard, switching)
- Theme and styling
- Module orchestration

**Cards Package Responsibilities:**
- Cards-specific views (scenes, chapters, states, TOC)
- Internal navigation menu
- Form components
- C-code generation logic

**Shared Package Responsibilities:**
- API client
- Database abstraction
- Type definitions
- State management (projectState)

**Practice:**
```typescript
// ✅ GOOD: Clear package boundaries
// In cards: import { projectState } from '@loke/shared/stores/project.svelte'
// In front: import { cardsFrontModule } from '@loke/apps-cards'

// ❌ BAD: Cross-package direct imports
// In cards: import something from '@loke/front/...'  // NEVER!
```

### 3. Centralized State Management

**Pattern: State Object Exports**
```typescript
// ✅ GOOD: Export state object (Svelte 5 pattern)
export const projectState = $state({
  currentProject: null as Project | null,
  projects: [] as Project[],
  isLoadingProjects: false,
  error: null as string | null,
});

// ❌ BAD: Export individual state variables
export let currentProject = $state(null);
export let projects = $state([]);
// Reason: Cannot reassign exported $state variables
```

**Practice:**
- All project state in `apps/shared/src/stores/project.svelte.ts`
- One source of truth
- Mutations only through exported functions
- All consumers import same `projectState` object

### 4. Type Safety Boundaries

**Current Setup:**
- TypeScript strict mode enabled
- `pnpm check:types` - one-time type check
- `pnpm check:types:watch` - continuous type checking

**Practice:**
```bash
# ✅ GOOD: Run type check before commits
pnpm check:types

# ✅ GOOD: Keep type watch running during development
pnpm check:types:watch

# ✅ GOOD: Fix type errors immediately
# Don't accumulate type errors
```

**Type Safety Rules:**
- Use `as any` only as last resort (document why)
- Prefer interfaces/types over inline types
- Keep shared types in `apps/shared/src/types.ts`

### 5. API Contract Stability

**Pattern: Explicit API Contracts**
```typescript
// ✅ GOOD: Clear API client methods
apiClient.createChapter(chapter: Omit<Chapter, "id"> | Chapter): Promise<Chapter>
apiClient.getChapter(id: string): Promise<Chapter | null>

// Backend expects exact format:
{
  id: "chapter_01",
  name: "Chapter Title",
  description: "...",
  projectId: "project-id"
}
```

**Practice:**
- Backend contract documented in `apps/shared/src/api-client.ts` header
- API client handles format transformations (e.g., parseDataField)
- Frontend uses typed methods, never raw fetch
- Changes to API require updating both backend + api-client.ts

### 6. Development Workflow (TDD)

**Current Process (from CLAUDE.md):**
1. Write small, testable units
2. Test with build/compile/test commands
3. Refactor with respect for existing code
4. Update TODO-CARDS.md sequentially
5. Log changes to CHANGELOG.md
6. Add test proofs to TEST-PROOF.md

**Stability Additions:**
```bash
# Before making changes:
1. Read TODO-CARDS.md - work sequentially
2. Read CHANGELOG.md - understand recent changes
3. Run `pnpm check:types` - ensure clean start

# During development:
4. Keep `pnpm dev` running with watch
5. Keep `pnpm check:types:watch` running
6. Test changes in browser after each file save
7. Check for HMR errors in terminal

# After changes:
8. Run `pnpm check:types` - verify no new type errors
9. Test full workflow in browser
10. Update TODO-CARDS.md - mark tasks done
11. Update CHANGELOG.md - document changes
12. Commit with descriptive message
```

## 🚨 Warning Signs to Watch For

### 1. State Accumulation
**Symptom:** Data from previous project appears in new project
**Solution:** Use project switching workflow (clear → dashboard → select → navigate)

### 2. Module Undefined Errors
**Symptom:** `TypeError: Cannot read properties of undefined`
**Solution:** Check Vite cache, restart dev server

### 3. Reactivity Not Working
**Symptom:** UI doesn't update when state changes
**Solution:** Verify using `$state` object pattern, not individual exports

### 4. API Format Mismatches
**Symptom:** Backend rejects data or returns 500 errors
**Solution:** Check api-client.ts transformation logic, verify backend logs

### 5. Cross-Package Imports
**Symptom:** Circular dependencies, unexpected rebuilds
**Solution:** Only import from `@loke/shared`, `@loke/ui`, `@loke/front-api`

## 📋 Pre-Change Checklist

Before making any significant change:

- [ ] Have I read the relevant README.md files?
- [ ] Have I checked TODO-CARDS.md for context?
- [ ] Have I reviewed recent CHANGELOG.md entries?
- [ ] Do I understand which package this change belongs to?
- [ ] Have I identified the module boundaries?
- [ ] Am I changing state management? (Extra caution needed)
- [ ] Am I changing navigation? (Extra caution needed)
- [ ] Am I changing API contracts? (Update both sides)
- [ ] Have I planned how to test this change?

## 🔧 Recovery Strategies

### When Things Break

**1. Fresh Start (Nuclear Option):**
```bash
# Kill all processes
pkill -f "pnpm\|vite\|node"

# Clear Vite cache
rm -rf apps/front/.svelte-kit
rm -rf apps/front/node_modules/.vite

# Reinstall and restart
pnpm install
pnpm dev
```

**2. Type Check First:**
```bash
pnpm check:types
# Fix all type errors before debugging runtime issues
```

**3. Isolate the Change:**
```bash
git diff  # What actually changed?
git checkout -- <file>  # Revert specific file
git stash  # Temporarily remove all changes
```

**4. Backend vs Frontend:**
```bash
# Test backend directly:
curl http://localhost:3000/api/health

# Test API endpoint:
curl http://localhost:3000/api/chapters?project=<id>

# Check backend logs in terminal
# Check browser console for frontend errors
```

## 🎓 Lessons Learned

### Issue: Chapter Save Not Working (2025-10-26)

**Root Causes:**
1. Hardcoded `projectId: "default"` in ChapterCreateView
2. API client ignored `chapter.id`, used `chapter.name` instead
3. Vite cache showed old error after fix

**Fixes:**
1. Use `projectState.currentProject.id`
2. Change API client to prioritize `chapter.id`
3. Restart dev server to clear Vite cache

**Prevention:**
- Always use `projectState.currentProject.id` for current project
- API client must respect explicit IDs over generated ones
- When seeing compile errors that don't match code, restart dev server

### Issue: Project Switch State Problems (2025-10-26)

**Root Cause:**
Trying to reactively update all state across components

**Fix:**
Project switcher workflow with browser navigation:
```typescript
onClick: () => {
  clearCurrentProject();
  goto('/');  // Dashboard shows, user selects project
  // Auto-navigation to /cards triggers fresh load
}
```

**Prevention:**
- Use navigation for state resets, not manual clearing
- Let browser handle the refresh cycle
- Don't fight the framework

## 📚 Key Documents

- `TODO-CARDS.md` - Sequential task list (source of truth)
- `CHANGELOG.md` - Change history
- `TEST-PROOF.md` - Test documentation
- `apps/front/README.md` - App shell responsibilities
- `apps/cards/README.md` - Cards module responsibilities
- `apps/shared/src/api-client.ts` - API contract definitions

## 🎯 Success Metrics

You know the strategy is working when:
- Changes are localized to one package
- No unexpected side effects in other modules
- Type checking passes on first try
- State behaves predictably across navigation
- Can explain why a change is safe before making it
- Recovery from errors is quick (< 5 minutes)

---

**Remember:** The dual-topbar navigation is your friend. It creates natural boundaries that prevent state accumulation and cross-module interference. Trust the architecture.
