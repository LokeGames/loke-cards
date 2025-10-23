# Apps Architecture Analysis Report

**Date:** 2025-10-23  
**Scope:** Analysis of `apps/` directory (excluding `apps/graph/`)  
**Focus:** Code consistency, API patterns, database forms, view architecture, and UX coherence

---

## Executive Summary

The apps directory demonstrates solid modern architecture with TypeScript, Svelte 5, and proper workspace separation. However, there are opportunities for streamlining duplicate data access patterns, standardizing layout architecture, and consolidating form components across apps.

## 1. Code Consistency Assessment

### ✅ Strengths

- **Consistent TypeScript usage**: Pure TypeScript across all apps with proper typing
- **Modern Svelte patterns**: Svelte 5 adoption with `<script lang="ts">` throughout
- **Workspace dependencies**: Clean separation using `@loke/shared` and `@loke/ui`
- **Testing consistency**: Vitest + Testing Library across all apps
- **Component organization**: Similar `src/components/` structure

### ⚠️ Inconsistencies Found

#### Data Access Patterns

```typescript
// apps/cards/src/lib/dataClient.ts - Direct wrapper
export const dataClient = {
  async createScene(scene: Omit<Scene, "id">) {
    return await db.createScene(scene);
  },
};

// apps/front/src/lib/dataStore.ts - Svelte store wrapper
export const scenes = writable<Scene[]>([]);
export const chapters = writable<Chapter[]>([]);
```

#### Layout Architecture

- `cards/`: Minimal layout with `<CardsLayout>`
- `front/`: Full shell with header, sidebar, and navigation

#### Route Organization

- `cards/`: Nested routes (`editor/`, `scenes/`, `scene/`)
- `front/`: Flatter structure with `/cards/*` prefix

## 2. API Usage Patterns and Data Flow

### ✅ Excellent Offline-First Architecture

The shared database implementation provides robust offline-first functionality:

```typescript
// apps/shared/src/database.ts
async createScene(scene: Omit<Scene, "id">): Promise<Scene> {
  try {
    const created = await apiClient.createScene(scene); // API first
    this.scenes.set(created.id, created);
    this.saveToStorage();
    return created;
  } catch (error) {
    // Graceful fallback to localStorage
    const newScene: Scene = {
      ...scene,
      id: this.generateId()
    };
    this.scenes.set(newScene.id, newScene);
    this.saveToStorage();
    return newScene;
  }
}
```

### ⚠️ Data Access Duplication

Both `cards/` and `front/` implement different wrappers around the same shared database functionality, creating unnecessary duplication.

## 3. Database Form Patterns

### ✅ Consistent Form Architecture

Forms follow consistent patterns with proper validation and TypeScript typing:

```typescript
// SceneEditorView.svelte - Good pattern example
export let sceneId: string | null = null;
let chapterId = "";
let title = "";
let sceneText = "";

async function save() {
  const s: Scene = {
    sceneId: sceneId || title.toLowerCase().replace(/\s+/g, "-"),
    chapterId,
    title,
    sceneText,
    createdAt: now,
    updatedAt: now,
  } as Scene;
}
```

### ✅ Reusable Form Components

- `SceneIdInput.svelte`: Validation with regex patterns
- `ChapterSelect.svelte`: Async data loading with error handling
- Consistent Tailwind CSS styling throughout

### ⚠️ Component Duplication

Similar form patterns exist in both apps without shared components.

## 4. View Architecture Analysis

### Layout Inconsistency

#### Cards App (Minimal)

```svelte
<!-- apps/cards/src/routes/+layout.svelte -->
<CardsLayout title="Cards">
  <slot />
</CardsLayout>
```

#### Front App (Full Shell)

```svelte
<!-- apps/front/src/routes/+layout.svelte -->
<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950">
  <AppSidebar />
  <div class="flex-1 flex flex-col">
    <AppHeader title="Loke Cards" />
    <main class="flex-1 overflow-auto p-4">
      <slot />
    </main>
  </div>
</div>
```

## 5. Menu Systems and Navigation

### ✅ Dynamic Menu Loading

Excellent implementation of dynamic menu loading with graceful fallbacks:

```typescript
// apps/front/src/lib/components/AppSidebar.svelte
onMount(async () => {
  const cardsModule = await import("@loke/apps-cards");
  cardsMenuItems = cardsModule.cardsMenu || [];

  try {
    const graphModule = await import("@loke/apps-graph");
    graphMenuItems = graphModule.graphMenu || [];
  } catch (e) {
    // Graph module not available - graceful handling
  }
});
```

### ✅ Centralized Menu Definitions

```typescript
// apps/cards/src/menu.ts
export const cardsMenu: MenuItem[] = [
  { label: "Cards", href: "/cards", icon: "📝" },
  { label: "Scenes", href: "/cards/scenes", icon: "📄" },
  { label: "Editor", href: "/cards/editor", icon: "✏️" },
];
```

## 6. UX Coherence Assessment

### ✅ Strengths

- Consistent dark mode support across all apps
- Responsive design patterns with Tailwind CSS
- Accessible form components with proper ARIA labels
- Loading states and error handling implemented

### ⚠️ UX Inconsistencies

- Different navigation patterns between apps
- Inconsistent breadcrumb usage
- Mixed language usage (Danish/English) in some components

## 7. Recommendations for Streamlining

### 1. Unify Data Access Patterns

**Create `@loke/data-store` package:**

```typescript
// packages/data-store/src/index.ts
import { writable, type Writable } from "svelte/store";
import { db } from "@loke/shared/database";

export const dataApi = db;
export const scenesStore = writable<Scene[]>([]);
export const chaptersStore = writable<Chapter[]>([]);

// Auto-sync stores with database
db.scenes.subscribe((scenes) => scenesStore.set(Array.from(scenes.values())));
```

### 2. Standardize Layout Architecture

**Create shared layout components:**

```typescript
// packages/ui/src/layouts/AppShell.svelte
// packages/ui/src/layouts/CardsLayout.svelte
// packages/ui/src/layouts/MinimalLayout.svelte
```

### 3. Consolidate Form Components

**Create `@loke/forms` package:**

```typescript
// packages/forms/src/SceneForm.svelte
// packages/forms/src/ChapterForm.svelte
// packages/forms/src/FormField.svelte (base component)
```

### 4. Unified Route Patterns

**Standardize route conventions:**

```
/cards/editor → /cards/scenes/edit/[id]
/cards/scene/new → /cards/scenes/new
/cards/chapters → /cards/chapters
```

### 5. Language Consistency

**Establish English as primary language** with proper i18n support for future needs.

## 8. Implementation Priority

### High Priority

1. **Unify data access patterns** - Eliminate duplication between `dataClient.ts` and `dataStore.ts`
2. **Standardize layout architecture** - Create shared layout components
3. **Consolidate form components** - Move to shared package

### Medium Priority

1. **Unified routing conventions** - Standardize URL patterns
2. **Language consistency** - Choose primary language
3. **Component organization** - Review and optimize component structure

### Low Priority

1. **Enhanced error boundaries** - Improve error handling consistency
2. **Performance optimization** - Bundle size analysis and optimization

## 9. Conclusion

The apps directory demonstrates solid modern architecture with excellent foundations. The main opportunities for improvement lie in:

1. **Eliminating data access duplication** between apps
2. **Standardizing layout architecture** for consistency
3. **Creating shared form components** to reduce code duplication

These changes would improve maintainability, reduce bundle size, and provide more consistent user experience across all applications.

---

**Next Steps:**

1. Review and approve recommendations
2. Create implementation plan for high-priority items
3. Begin with data access pattern unification
4. Progressively implement other improvements

**Files Referenced:**

- `apps/cards/src/lib/dataClient.ts`
- `apps/front/src/lib/dataStore.ts`
- `apps/shared/src/database.ts`
- `apps/cards/src/menu.ts`
- Various layout and component files across apps
