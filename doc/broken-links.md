# Broken Links Analysis Report

**Date:** 2025-10-23  
**Scope:** Cross-app navigation analysis for `apps/cards/` and `apps/front/`  
**Status:** 🚨 Critical navigation issues found

---

## Executive Summary

Significant navigation fragmentation exists between the cards and front apps. The cards app menu references routes that don't exist within the cards app, while the front app has these routes implemented. This creates a broken user experience where menu items lead to 404 errors.

---

## Critical Issues

### 1. Missing Routes in Cards App

The `apps/cards/src/menu.ts` defines menu items that reference routes **that don't exist** in the cards app:

| Menu Item                            | Expected Route                           | Actual Status | Impact    |
| ------------------------------------ | ---------------------------------------- | ------------- | --------- |
| "Cards" → `/cards`                   | ✅ EXISTS (redirects to `/cards/scenes`) | Working       | Low       |
| "Scenes" → `/cards/scenes`           | ✅ EXISTS                                | Working       | Low       |
| "Chapters" → `/cards/chapters`       | ❌ **MISSING**                           | 404 Error     | 🚨 High   |
| "Scene Editor" → `/cards/editor`     | ✅ EXISTS                                | Working       | Low       |
| "New Scene" → `/cards/scene/new`     | ❌ **MISSING**                           | 404 Error     | 🚨 High   |
| "New Chapter" → `/cards/chapter/new` | ❌ **MISSING**                           | 404 Error     | 🚨 High   |
| "Table of Contents" → `/cards/toc`   | ❌ **MISSING**                           | 404 Error     | 🚨 Medium |

**Impact:** 4 out of 7 menu items (57%) are broken in the cards app.

### 2. Cross-App Navigation Mismatches

The front app (`apps/front`) has routes that **don't align** with cards app expectations:

**Front App Routes (EXISTING):**

- `/cards/chapters` ✅
- `/cards/chapter/edit` ✅
- `/cards/chapter/new` ✅
- `/cards/scene/new` ✅
- `/cards/toc` ✅

**Cards App Routes (MISSING):**

- `/cards/chapters` ❌
- `/cards/chapter/new` ❌
- `/cards/scene/new` ❌
- `/cards/toc` ❌

**Result:** Users can access these features from the front app but not from the cards app menu.

### 3. Broken Quick Actions Navigation

**File:** `apps/front/src/lib/components/dashboard/QuickActions.svelte`

```javascript
// Line 5, 9 - BROKEN LINKS
goto("/scene/new"); // ❌ Should be '/cards/scene/new'
goto("/chapter/new"); // ❌ Should be '/cards/chapter/new'
```

**Impact:** Dashboard quick actions lead to 404 errors.

### 4. Broken Recent Components Navigation

**File:** `apps/front/src/lib/components/dashboard/RecentChapters.svelte`

```javascript
// Line 25, 38 - BROKEN LINKS
goto(`/chapters`); // ❌ Should be '/cards/chapters'
```

**Impact:** Recent chapters navigation leads to 404 errors.

### 5. Graph App Route Issues

**Issue:** Graph menu references `/graph/chapter` but actual route is `/graph/chapter/[id]`

- Menu: `/graph/chapter` ❌
- Actual: `/graph/chapter/[id]` ✅

**Impact:** Graph navigation may be broken for specific chapter views.

---

## Detailed Route Analysis

### Cards App Menu vs Reality

**Menu Definition (`apps/cards/src/menu.ts`):**

```typescript
export const cardsMenu = [
  { label: "Cards", href: "/cards", icon: FileText }, // ✅ Works
  { label: "Scenes", href: "/cards/scenes", icon: File }, // ✅ Works
  { label: "Chapters", href: "/cards/chapters", icon: BookOpen }, // ❌ 404
  { label: "Scene Editor", href: "/cards/editor", icon: PenTool }, // ✅ Works
  { label: "New Scene", href: "/cards/scene/new", icon: Plus }, // ❌ 404
  { label: "New Chapter", href: "/cards/chapter/new", icon: Plus }, // ❌ 404
  { label: "Table of Contents", href: "/cards/toc", icon: List }, // ❌ 404
];
```

**Actual Cards App Routes:**

```
✅ /cards (redirects to /cards/scenes)
✅ /cards/scenes
✅ /cards/editor
✅ /cards/new (redirects from /cards/scene)
❌ /cards/chapters (MISSING)
❌ /cards/scene/new (MISSING)
❌ /cards/chapter/new (MISSING)
❌ /cards/toc (MISSING)
```

### Front App Routes (Working)

**Existing Front App Routes:**

```
✅ /cards/chapters
✅ /cards/chapter/edit
✅ /cards/chapter/new
✅ /cards/scene/new
✅ /cards/toc
✅ /cards/scenes
✅ /cards/editor
```

---

## User Impact Assessment

### High Impact Issues

1. **Menu Navigation Broken** - 57% of cards app menu items don't work
2. **Dashboard Quick Actions Broken** - Primary navigation buttons fail
3. **Recent Items Navigation Broken** - Secondary navigation fails

### Medium Impact Issues

1. **Inconsistent Experience** - Features work in front app but not cards app
2. **User Confusion** - Same user journey works differently depending on entry point

### Low Impact Issues

1. **Graph App** - Minor route pattern mismatch

---

## Root Cause Analysis

### Architecture Fragmentation

The project has **two separate apps** with **different route structures**:

1. **Cards App** (`apps/cards`) - Minimal route implementation
2. **Front App** (`apps/front`) - Complete route implementation

### Menu Ownership Confusion

- Cards app defines menu but doesn't implement all routes
- Front app implements routes but doesn't control the menu
- No synchronization between menu definitions and route implementations

### Development Workflow Gap

- No automated testing for cross-app navigation
- No validation that menu items map to existing routes
- No shared route definitions between apps

---

## Recommended Solutions

### Immediate Fixes (High Priority)

#### 1. Add Missing Routes to Cards App

Create the following route files in `apps/cards/src/routes/`:

```
/cards/chapters/+page.svelte
/cards/chapter/new/+page.svelte
/cards/scene/new/+page.svelte
/cards/toc/+page.svelte
```

#### 2. Fix Front App Navigation

Update these files:

**`apps/front/src/lib/components/dashboard/QuickActions.svelte`:**

```javascript
goto("/cards/scene/new"); // ✅ Fixed
goto("/cards/chapter/new"); // ✅ Fixed
```

**`apps/front/src/lib/components/dashboard/RecentChapters.svelte`:**

```javascript
goto(`/cards/chapters`); // ✅ Fixed
```

### Medium-term Solutions

#### 3. Route Consolidation Strategy

Choose one approach:

**Option A: Single Source of Truth**

- Move all routes to front app
- Cards app becomes component library only
- Menu defined in front app

**Option B: Synchronized Routes**

- Share route definitions between apps
- Automated validation that menu items map to routes
- Cross-app route testing

#### 4. Automated Navigation Testing

- Add E2E tests for all menu items
- Add cross-app navigation validation
- Add route existence checks in CI/CD

### Long-term Solutions

#### 5. Shared Navigation System

- Create shared route definitions package
- Centralized menu management
- Type-safe navigation between apps

#### 6. Architecture Review

- Evaluate if two apps are necessary
- Consider consolidating into single app
- Review micro-frontend approach benefits vs complexity

---

## Implementation Priority

### Phase 1: Emergency Fixes (1-2 hours)

1. Fix QuickActions navigation links
2. Fix RecentChapters navigation links
3. Add missing routes to cards app (basic implementations)

### Phase 2: Consistency (1 day)

1. Implement full missing routes in cards app
2. Add navigation tests
3. Validate all menu items work

### Phase 3: Architecture (1 week)

1. Decide on route consolidation strategy
2. Implement shared navigation system
3. Add automated validation

---

## Testing Recommendations

### Manual Testing Checklist

- [ ] All cards app menu items work
- [ ] Front app dashboard quick actions work
- [ ] Recent items navigation works
- [ ] Cross-app navigation works
- [ ] Graph app navigation works

### Automated Testing

- E2E tests for all menu navigation
- Route existence validation tests
- Cross-app link checking in CI/CD

---

## Conclusion

The current navigation fragmentation creates a **broken user experience** that significantly impacts usability. While the front app has complete route implementation, the cards app menu is largely non-functional.

**Immediate action required** to fix the 4 broken menu items in the cards app and navigation links in the front app dashboard components.

**Long-term architectural decisions** needed to prevent similar fragmentation in the future.

---

**Files Referenced:**

- `apps/cards/src/menu.ts`
- `apps/cards/src/routes/`
- `apps/front/src/routes/`
- `apps/front/src/lib/components/dashboard/QuickActions.svelte`
- `apps/front/src/lib/components/dashboard/RecentChapters.svelte`
