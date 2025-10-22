# Loke Cards - Styling Architecture Guide

## Overview

Loke Cards uses a **centralized styling system** based on Tailwind CSS with custom component classes and reusable Svelte components. This approach ensures consistency, maintainability, and reduces code duplication.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│  Tailwind Config (Design Tokens)       │  ← Brand colors, spacing, etc.
├─────────────────────────────────────────┤
│  app.css (@layer components)           │  ← Reusable CSS classes
├─────────────────────────────────────────┤
│  packages/ui (Svelte Components)       │  ← Semantic components
├─────────────────────────────────────────┤
│  Application Pages & Features          │  ← Use components + classes
└─────────────────────────────────────────┘
```

## 1. Tailwind Configuration

**Location:** `apps/front/tailwind.config.js`

### Custom Design Tokens

```javascript
theme: {
  extend: {
    colors: {
      primary: { ... },      // Brand blue
      success: { ... },      // Green
      warning: { ... },      // Yellow/Orange
      danger: { ... },       // Red
    },
    spacing: {
      'card': '1.5rem',      // Standard card padding
      'card-compact': '1rem', // Compact card padding
      'section': '2rem',     // Section spacing
    },
    borderRadius: {
      'card': '0.5rem',      // Standard card radius
    },
  },
}
```

**Usage:**
```svelte
<div class="p-card rounded-card">...</div>
```

## 2. Component Classes

**Location:** `apps/front/src/app.css`

### Page Layout

| Class | Purpose | Example |
|-------|---------|---------|
| `.page-container` | Standard page padding | Dashboard, lists |
| `.page-container-wide` | Wide pages with max-width | Reports |
| `.page-container-narrow` | Narrow pages (forms, editors) | Scene editor |

### Typography

| Class | Purpose |
|-------|---------|
| `.page-title` | Main page heading (h1) |
| `.section-title` | Section heading (h2) |
| `.subsection-title` | Subsection heading (h3) |
| `.text-muted` | Secondary text |
| `.text-subtle` | Tertiary/helper text |
| `.text-error` | Error messages |

### Cards

| Class | Purpose | Visual |
|-------|---------|--------|
| `.card` | Standard card | White bg, border, padding |
| `.card-compact` | Smaller padding | Items in lists |
| `.card-interactive` | Hover shadow | Interactive but not clickable |
| `.card-clickable` | Clickable card | Hover background change |

### Buttons

| Class | Purpose |
|-------|---------|
| `.btn-primary` | Primary action (blue) |
| `.btn-success` | Success action (green) |
| `.btn-danger` | Destructive action (red) |
| `.btn-secondary` | Secondary action (gray) |
| `.btn-sm` | Small button variant |

### Forms

| Class | Purpose |
|-------|---------|
| `.form-label` | Form field labels |
| `.form-input` | Text inputs |
| `.form-select` | Select dropdowns |
| `.form-textarea` | Textarea fields |
| `.form-checkbox` | Checkboxes |

### States

| Class | Purpose |
|-------|---------|
| `.empty-state` | Empty state container |
| `.empty-state-icon` | Large icon (emoji) |
| `.empty-state-title` | Empty state heading |
| `.empty-state-description` | Empty state text |
| `.loading-container` | Loading state container |
| `.loading-spinner` | Animated spinner |

### Utilities

| Class | Purpose |
|-------|---------|
| `.item-list` | Grid layout for lists |
| `.item-card` | Card in a list |
| `.code-inline` | Inline code snippets |
| `.badge` | Badge base |
| `.badge-{color}` | Colored badges |
| `.alert-{type}` | Alert boxes |

## 3. Svelte Components

**Location:** `packages/ui/src/components/`

### Layout Components

#### `<PageContainer>`
```svelte
<script>
  import { PageContainer } from '@ui';
</script>

<PageContainer width="narrow">
  <!-- Content -->
</PageContainer>
```

**Props:**
- `width`: `'default' | 'wide' | 'narrow'`

#### `<Card>`
```svelte
<script>
  import { Card } from '@ui';
</script>

<Card variant="interactive">
  <!-- Card content -->
</Card>
```

**Props:**
- `variant`: `'default' | 'compact' | 'interactive' | 'clickable'`
- `onClick`: Optional click handler (converts to button)

### Action Components

#### `<Button>`
```svelte
<script>
  import { Button } from '@ui';
</script>

<Button variant="primary" size="sm" href="/somewhere">
  Click Me
</Button>
```

**Props:**
- `variant`: `'primary' | 'success' | 'danger' | 'secondary'`
- `size`: `'default' | 'sm'`
- `type`: `'button' | 'submit' | 'reset'`
- `disabled`: boolean
- `href`: string (renders as `<a>` instead of `<button>`)

### State Components

#### `<LoadingState>`
```svelte
<script>
  import { LoadingState } from '@ui';
</script>

<LoadingState message="Loading scenes..." />
```

#### `<EmptyState>`
```svelte
<script>
  import { EmptyState, Button } from '@ui';
</script>

<EmptyState
  icon="📄"
  title="No scenes yet"
  description="Get started by creating your first scene"
>
  <Button variant="primary" href="/cards/scene/new">
    Create Scene
  </Button>
</EmptyState>
```

## 4. Usage Examples

### Before (Inline Tailwind)

```svelte
<div class="p-6">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Scenes</h1>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  {/if}

  {#if scenes.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed">
      <span class="text-6xl">📄</span>
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No scenes</h3>
    </div>
  {/if}
</div>
```

### After (Component Classes + Components)

```svelte
<script>
  import { PageContainer, LoadingState, EmptyState, Button } from '@ui';
</script>

<PageContainer>
  <h1 class="page-title">Scenes</h1>

  {#if loading}
    <LoadingState message="Loading scenes..." />
  {/if}

  {#if scenes.length === 0}
    <EmptyState
      icon="📄"
      title="No scenes yet"
      description="Get started by creating your first scene"
    >
      <Button variant="primary" href="/cards/scene/new">
        Create Scene
      </Button>
    </EmptyState>
  {/if}
</PageContainer>
```

**Benefits:**
- ✅ **60% less code**
- ✅ **Consistent styling** across pages
- ✅ **Dark mode** handled automatically
- ✅ **Easier to maintain** - change once, update everywhere
- ✅ **Type-safe** with TypeScript props
- ✅ **Semantic** - code expresses intent

## 5. When to Use What

### Use Component Classes When:
- ✅ Simple styling patterns repeated across pages
- ✅ Typography and text styling
- ✅ Form elements
- ✅ One-off elements that don't need props

**Example:**
```svelte
<h1 class="page-title">Dashboard</h1>
<p class="text-muted">Welcome back!</p>
<input class="form-input" />
```

### Use Svelte Components When:
- ✅ Complex interactive elements
- ✅ Elements with state or props
- ✅ Repeated UI patterns (cards, buttons, modals)
- ✅ Need TypeScript type safety

**Example:**
```svelte
<Button variant="primary" on:click={handleSave}>Save</Button>
<Card variant="clickable" onClick={() => navigate('/scene')}>
  <!-- Content -->
</Card>
```

### Use Inline Tailwind When:
- ✅ Unique, one-off styling
- ✅ Layout-specific adjustments
- ✅ Responsive utilities (`md:`, `lg:`, etc.)

**Example:**
```svelte
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid items -->
</div>
```

## 6. Migration Strategy

### Phase 1: New Code ✅
- All new pages use component classes and Svelte components
- Documented in this guide

### Phase 2: Gradual Refactoring (Future)
- Refactor existing pages one-by-one
- Start with most frequently edited pages
- Use `.refactored.svelte` extension during transition
- Test thoroughly before replacing original

### Phase 3: Cleanup (Future)
- Remove unused inline Tailwind
- Optimize bundle size
- Add more reusable components as patterns emerge

## 7. Component Development Guidelines

### Creating New Component Classes

Add to `apps/front/src/app.css`:

```css
@layer components {
  .my-component {
    @apply /* tailwind classes */;
  }
}
```

### Creating New Svelte Components

1. Add to `packages/ui/src/components/`
2. Export from `packages/ui/src/components/index.ts`
3. Document props with TypeScript
4. Include dark mode support
5. Make accessible (ARIA, keyboard nav)

### Testing

```bash
# Build and check for CSS errors
pnpm run build

# Preview to test visually
pnpm run preview
```

## 8. Dark Mode

All component classes include dark mode automatically:

```css
.card {
  @apply bg-white dark:bg-gray-800
         border-gray-200 dark:border-gray-700;
}
```

**No need to add dark: prefixes in components!**

## 9. Best Practices

### ✅ Do:
- Use semantic class names (`.card`, `.btn-primary`)
- Compose classes for reusability
- Keep component APIs simple
- Document complex components
- Test dark mode

### ❌ Don't:
- Create one-off component classes
- Override component classes with inline styles
- Duplicate Tailwind patterns
- Forget accessibility
- Hard-code colors (use theme)

## 10. Resources

- **Tailwind Docs:** https://tailwindcss.com
- **Component Classes:** `apps/front/src/app.css`
- **UI Components:** `packages/ui/src/components/`
- **Examples:** `apps/front/src/routes/cards/scenes/+page.refactored.svelte`

---

**Questions?** Check existing components first, then create an issue or ask in team chat.
