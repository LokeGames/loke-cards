# Loke Cards - Theme System

## Oversigt

Loke Cards bruger **CSS Custom Properties (variables)** som single source of truth for hele tema'et. Ændre farver, spacing, eller andre design-tokens ét sted, og hele appen opdateres automatisk.

## Hvordan det virker

```
┌─────────────────────────────────────┐
│  app.css (:root CSS variables)     │  ← **ÆND HER**
│  - Farver, spacing, fonts, osv.    │
├─────────────────────────────────────┤
│  tailwind.config.js                 │  ← Mapper til CSS vars
│  - Bruger rgb(var(--color-*))      │
├─────────────────────────────────────┤
│  Component classes (@layer)         │  ← Bruger theme tokens
│  - .card, .btn-primary, osv.       │
├─────────────────────────────────────┤
│  Svelte components + Tailwind      │  ← Bruger alt ovenstående
│  - <Button>, <Card>, osv.          │
└─────────────────────────────────────┘
```

## Quick Start: Ændre Brand Farve

**Alt du skal gøre:**

Åbn `apps/front/src/app.css` og ændre primary color:

```css
:root {
  /* Brand Colors - Primary Blue */
  --color-primary-500: 59 130 246;  /* Nuværende: Blå */
}
```

**Eksempel: Skift til Grøn**
```css
:root {
  /* Brand Colors - Primary Green */
  --color-primary-500: 34 197 94;  /* Ny: Grøn */
}
```

**Resultat:** Alle knapper, links, focus rings osv. ændres til grøn!

## Theme Variables Reference

### 🎨 Farver

#### Brand Colors (Primary)
```css
--color-primary-50: 239 246 255;   /* Lightest */
--color-primary-100: 219 234 254;
--color-primary-200: 191 219 254;
--color-primary-300: 147 197 253;
--color-primary-400: 96 165 250;
--color-primary-500: 59 130 246;   /* ← Base farve */
--color-primary-600: 37 99 235;
--color-primary-700: 29 78 216;
--color-primary-800: 30 64 175;
--color-primary-900: 30 58 138;    /* Darkest */
```

#### Semantiske Farver
```css
--color-success: 5 150 105;        /* Grøn */
--color-warning: 217 119 6;        /* Orange */
--color-danger: 220 38 38;         /* Rød */
```

#### Baggrunde (Auto Light/Dark)
```css
/* Light mode */
--bg-page: 249 250 251;           /* Sidens baggrund */
--bg-surface: 255 255 255;        /* Cards, modals */
--bg-elevated: 255 255 255;       /* Popups, tooltips */

/* Dark mode (.dark class) */
--bg-page: 17 24 39;
--bg-surface: 31 41 55;
--bg-elevated: 55 65 81;
```

#### Tekst (Auto Light/Dark)
```css
/* Light mode */
--text-primary: 17 24 39;         /* Hovedtekst */
--text-secondary: 75 85 99;       /* Sekundær tekst */
--text-tertiary: 107 114 128;     /* Hjælpetekst */
--text-muted: 156 163 175;        /* Meget svag tekst */

/* Dark mode - auto overridet */
```

### 📏 Spacing

```css
--spacing-xs: 0.25rem;      /* 4px */
--spacing-sm: 0.5rem;       /* 8px */
--spacing-md: 1rem;         /* 16px */
--spacing-lg: 1.5rem;       /* 24px */
--spacing-xl: 2rem;         /* 32px */
--spacing-2xl: 3rem;        /* 48px */

/* Specielle */
--spacing-card: 1.5rem;           /* Card padding */
--spacing-card-compact: 1rem;     /* Compact card padding */
--spacing-section: 2rem;          /* Section spacing */
```

### 🔤 Typography

```css
/* Font Families */
--font-sans: ui-sans-serif, system-ui, ...;
--font-mono: ui-monospace, SFMono-Regular, ...;

/* Font Sizes */
--text-xs: 0.75rem;         /* 12px */
--text-sm: 0.875rem;        /* 14px */
--text-base: 1rem;          /* 16px */
--text-lg: 1.125rem;        /* 18px */
--text-xl: 1.25rem;         /* 20px */
--text-2xl: 1.5rem;         /* 24px */
--text-3xl: 1.875rem;       /* 30px */
--text-4xl: 2.25rem;        /* 36px */
```

### 🔘 Border Radius

```css
--radius-sm: 0.25rem;       /* 4px */
--radius-md: 0.375rem;      /* 6px */
--radius-lg: 0.5rem;        /* 8px - Standard */
--radius-xl: 0.75rem;       /* 12px */
--radius-full: 9999px;      /* Fuldt runde */
```

### 🎭 Shadows

```css
--shadow-sm: 0 1px 2px ...;
--shadow-md: 0 4px 6px ...;
--shadow-lg: 0 10px 15px ...;
--shadow-xl: 0 20px 25px ...;
```

### ⚡ Transitions

```css
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Brug i Kode

### 1. Tailwind Classes (Anbefalet)

```svelte
<!-- Bruger theme spacing -->
<div class="p-card rounded-card">...</div>

<!-- Bruger theme colors -->
<button class="bg-primary-600 text-white">...</button>

<!-- Bruger semantiske colors -->
<div class="bg-surface border-default">...</div>
```

### 2. Component Classes

```svelte
<!-- Bruger .card som automatisk har theme colors -->
<div class="card">...</div>

<!-- Bruger .btn-primary som automatisk har theme colors -->
<button class="btn-primary">Save</button>
```

### 3. Direkte CSS Variables

```svelte
<style>
  .my-component {
    background-color: rgb(var(--bg-surface));
    color: rgb(var(--text-primary));
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
  }
</style>
```

### 4. Inline Styles (Hvis nødvendigt)

```svelte
<div style="color: rgb(var(--text-secondary))">...</div>
```

## Eksempler: Theme Customization

### Eksempel 1: Purple Brand

```css
:root {
  /* Skift til lilla primary farve */
  --color-primary-500: 168 85 247;   /* Purple-500 */
  --color-primary-600: 147 51 234;   /* Purple-600 */
  --color-primary-700: 126 34 206;   /* Purple-700 */
}
```

### Eksempel 2: Øg Spacing

```css
:root {
  /* Større card padding overalt */
  --spacing-card: 2rem;              /* Fra 1.5rem til 2rem */
  --spacing-card-compact: 1.5rem;    /* Fra 1rem til 1.5rem */
}
```

### Eksempel 3: Rounder Corners

```css
:root {
  /* Mere runde hjørner */
  --radius-lg: 1rem;                 /* Fra 0.5rem til 1rem */
}
```

### Eksempel 4: Langsommere Animationer

```css
:root {
  /* Gør alle transitions langsommere */
  --transition-base: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Eksempel 5: Custom Dark Mode Farver

```css
.dark {
  /* Mere blålig dark mode */
  --bg-page: 15 23 42;               /* Slate-900 */
  --bg-surface: 30 41 59;            /* Slate-800 */
}
```

## Advanced: Tilføj Nye Theme Tokens

### 1. Tilføj CSS Variable

I `apps/front/src/app.css`:

```css
:root {
  /* Ny custom farve */
  --color-accent: 236 72 153;        /* Pink-500 */
}
```

### 2. Tilføj Tailwind Mapping

I `apps/front/tailwind.config.js`:

```javascript
colors: {
  accent: 'rgb(var(--color-accent) / <alpha-value>)',
}
```

### 3. Brug det!

```svelte
<button class="bg-accent text-white">New Accent Button</button>
```

## Dark Mode

Dark mode håndteres automatisk via CSS variables!

### Hvordan det virker:

```css
/* Light mode (default) */
:root {
  --bg-surface: 255 255 255;  /* White */
}

/* Dark mode (når <html class="dark">) */
.dark {
  --bg-surface: 31 41 55;     /* Gray-800 */
}
```

**Result:** Alle komponenter der bruger `--bg-surface` skifter automatisk!

### Toggle Dark Mode

Dark mode styres af ThemeToggle component som tilføjer/fjerner `.dark` class på `<html>`.

## Migration Guide

### Fra Hard-Coded Farver

**Før:**
```svelte
<div class="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
  ...
</div>
```

**Efter:**
```svelte
<div class="bg-surface border-default">
  ...
</div>
```

eller:

```svelte
<div class="card">  <!-- Card class bruger allerede theme vars -->
  ...
</div>
```

### Fra Tailwind Default Colors

**Før:**
```svelte
<button class="bg-blue-600 hover:bg-blue-700">...</button>
```

**Efter:**
```svelte
<button class="bg-primary-600 hover:bg-primary-700">...</button>
```

eller:

```svelte
<button class="btn-primary">...</button>  <!-- Bruger theme automatisk -->
```

## Best Practices

### ✅ Gør:

1. **Brug semantiske farver** når muligt:
   ```svelte
   <div class="bg-surface text-primary">...</div>
   ```

2. **Brug theme spacing**:
   ```svelte
   <div class="p-card gap-md">...</div>
   ```

3. **Brug component classes**:
   ```svelte
   <div class="card">...</div>
   ```

4. **Test både light og dark mode** efter ændringer

### ❌ Undgå:

1. **Hard-coded hex/rgb farver**:
   ```svelte
   <!-- Dårligt -->
   <div style="background: #3b82f6">...</div>

   <!-- Godt -->
   <div class="bg-primary-500">...</div>
   ```

2. **Pixel-værdier for spacing**:
   ```svelte
   <!-- Dårligt -->
   <div class="p-[24px]">...</div>

   <!-- Godt -->
   <div class="p-card">...</div>
   ```

3. **Ignorere dark mode**:
   - Alle nye komponenter SKAL fungere i dark mode
   - Brug theme variables, så sker det automatisk!

## FAQ

**Q: Hvorfor RGB format i stedet for hex?**
A: RGB format tillader alpha transparency: `rgb(var(--color-primary-500) / 0.5)` for 50% opacity.

**Q: Skal jeg ændre Tailwind config når jeg ændrer farver?**
A: Nej! Tailwind mapper automatisk til CSS variables. Ændre kun `app.css`.

**Q: Hvordan tilføjer jeg et helt nyt tema?**
A: Lav en ny CSS class (f.eks. `.theme-ocean`) med alle variable overrides, ligesom `.dark`.

**Q: Kan jeg have flere temaer ud over light/dark?**
A: Ja! Lav nye classes (`.theme-high-contrast`, `.theme-ocean`, osv.) med variable overrides.

## Ressourcer

- **Theme Variables:** `apps/front/src/app.css` - Alle CSS variables
- **Tailwind Config:** `apps/front/tailwind.config.js` - Tailwind mappings
- **Component Classes:** `apps/front/src/app.css @layer components` - Genbrugelige styles
- **Color Palette Tool:** https://uicolors.app/create - Generer farve-palette

---

**Single source of truth = Nemt at vedligeholde! 🎨**
