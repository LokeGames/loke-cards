# Loke Cards

> Migration note: The project is being ported from Vue to SvelteKit. The new app lives in `cards/` and is the active target for development, build, and tests. Legacy Vue folders (`cards-vue`, `graph-vue`, `shared-vue`) are archived artifacts and excluded from the toolchain until the port is complete.

**Progressive Web App (PWA) for authoring interactive fiction content in loke-engine format.**

Loke Cards provides simple form-based "cards" for writing scenes and chapters directly in C format, which are then saved to a loke-engine server.

## Quick Start (Svelte)

Install pnpm (if not already installed):

```bash
npm install -g pnpm
```

Install dependencies:

```bash
pnpm install
```

Start development:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview production build locally:

```bash
pnpm preview
```

### Available Scripts

**Development:**

```bash
pnpm dev
```

Full stack (frontend + backend)

```bash
pnpm dev:front
```

Frontend only (http://127.0.0.1:5183)

```bash
pnpm dev:graph
```

Graph app only (http://127.0.0.1:8092)

```bash
pnpm dev:backend
```

Backend only

**Build & Test:**

```bash
pnpm build
```

Production build (outputs to `apps/front/.svelte-kit/output/`)

```bash
pnpm preview
```

Preview production build locally (starts Node.js server)

```bash
pnpm test
```

E2E tests

```bash
pnpm test:unit
```

Unit tests

```bash
pnpm lint
```

ESLint

```bash
pnpm check:types
```

TypeScript type checking

## Production URL

**https://loke.tail2d448.ts.net:8443/** (Installed in macOS dock)

Default dev server (Svelte): **http://127.0.0.1:5173**.

### Running legacy Vue apps (optional)

Cards (Vue):

```bash
npm install -C cards-vue && npm run dev -C cards-vue
```

Graph (Vue):

```bash
npx vite --config graph-vue/vite.config.js
```

Legacy apps are not part of the active toolchain and are kept read‑only during the port.

## Project Structure

```
loke-cards/
├── apps/                # Active Svelte applications
│   ├── front/           # PWA shell (SvelteKit) - Dashboard + Layout
│   ├── cards/           # Cards micro-app - Scene/Chapter editors + menu
│   ├── graph/           # Graph micro-app - Visualization + menu
│   └── shared/          # Shared utilities, types, and database
├── packages/            # Shared packages
│   ├── schemas/         # Zod schemas for data validation
│   └── ui/              # Shared UI components (Header, Sidebar, Toasts)
├── server/              # C++ backend server (SQLite + REST API)
├── doc/                 # Documentation
├── scripts/             # Development scripts
└── tests/               # E2E tests
```

### Architecture Design

**Micro-frontend architecture** hvor hver feature-område er et selvstændigt modul:

- **`apps/front/`** - SvelteKit PWA shell (http://127.0.0.1:5183)
  - Dashboard med statistics og quick actions
  - Layout (AppHeader, AppSidebar, AppToasts)
  - Settings page
  - **Import dynamisk menu** fra cards og graph moduler

- **`apps/cards/`** - Cards feature modul (Svelte library)
  - Scene editor komponenter
  - Chapter manager komponenter
  - **Eksporterer `cardsMenu`** til sidebar
  - Routes defineret i `src/routes/` (ikke brugt af front endnu)

- **`apps/graph/`** - Graph feature modul (LiteGraph)
  - Graph visualization komponenter
  - **Eksporterer `graphMenu`** til sidebar
  - Routes defineret i `src/routes/` (ikke brugt af front endnu)

- **`apps/shared/`** - Delte utilities
  - Database (localStorage wrapper)
  - TypeScript types
  - Utility functions

### Key Design Principle

**Menu items tilhører deres feature-område**, ikke front app:

```typescript
// apps/cards/src/menu.ts - Cards definerer sine egne menu items
export const cardsMenu = [
  { label: "Scenes", href: "/cards/scenes", icon: "📄" },
  { label: "Chapters", href: "/cards/chapters", icon: "📚" },
  // ...
];

// packages/ui/src/components/AppSidebar.svelte - Front importerer dem
const cardsModule = await import("@loke/apps-cards");
cardsMenuItems = cardsModule.cardsMenu;
```

### Legacy (Being Removed)

- `apps-vue/` - Legacy Vue applications (reference implementation)

## Database Architecture

### Unified Database Interface

Loke Cards uses a **single unified database interface** pattern for all data access. This ensures consistency, maintainability, and makes it easy to create new views.

**Key Principle**: All components access data through the same `db` singleton from `@loke/shared/database`.

### Usage Pattern

```typescript
// ✅ CORRECT: Import db singleton
import { db } from '@loke/shared/database';
import type { Chapter, Scene } from '@loke/shared';

// Use db methods directly
const chapters = await db.getAllChapters();
const chapter = await db.getChapter(id);
await db.createChapter(data);
await db.updateChapter(id, data);
await db.deleteChapter(id);

// ❌ WRONG: Do not create wrappers or stores
import { dataClient } from '../lib/dataClient'; // DON'T DO THIS
import { dataStore } from '../lib/dataStore'; // DON'T DO THIS
```

### Available Database Methods

**Chapters:**
- `db.getAllChapters()` - Get all chapters
- `db.getChapter(id)` - Get single chapter
- `db.createChapter(data)` - Create new chapter
- `db.updateChapter(id, data)` - Update existing chapter
- `db.deleteChapter(id)` - Delete chapter

**Scenes:**
- `db.getAllScenes()` - Get all scenes
- `db.getScene(id)` - Get single scene
- `db.createScene(data)` - Create new scene
- `db.updateScene(id, data)` - Update existing scene
- `db.deleteScene(id)` - Delete scene

### Creating New List Views

When creating a new list view, follow this pattern:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { db } from '@loke/shared/database';
  import type { Chapter } from '@loke/shared';
  import { Plus, BookOpen } from 'lucide-svelte';

  let items: Chapter[] = [];
  let loading = true;

  // Extract load logic into separate function
  async function loadItems() {
    loading = true;
    try {
      items = await db.getAllChapters();
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      loading = false;
    }
  }

  // Load on mount
  onMount(() => {
    loadItems();
  });

  // Reload after navigation (important for SvelteKit!)
  afterNavigate(() => {
    loadItems();
  });
</script>

<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Items</h1>
    <a href="/cards/items/new" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
      <Plus size={20} />
      New Item
    </a>
  </div>

  {#if loading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  {:else if items.length === 0}
    <div class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
      <BookOpen size={64} class="text-gray-400" />
      <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No items yet</h3>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Get started by creating your first item</p>
    </div>
  {:else}
    <div class="grid gap-4">
      {#each items as item}
        <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <!-- Item content -->
        </div>
      {/each}
    </div>
  {/if}
</div>
```

### RESTful Routing Conventions

All routes follow RESTful conventions for consistency:

**Resource List:**
```
/cards/scenes          → List all scenes
/cards/chapters        → List all chapters
```

**Create New:**
```
/cards/scenes/new      → Create new scene
/cards/chapters/new    → Create new chapter
```

**Edit Existing:**
```
/cards/scenes/edit/[id]    → Edit scene by ID
/cards/chapters/edit/[id]  → Edit chapter by ID
```

### Accessing Route Parameters

Use SvelteKit's `$page.params` to access URL parameters:

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { db } from '@loke/shared/database';

  let item = null;

  onMount(async () => {
    const id = $page.params.id;  // Get [id] from URL

    if (!id) {
      console.error('No ID provided');
      return;
    }

    item = await db.getChapter(id);
  });
</script>
```

### Navigation After Save

After creating or updating items, redirect to list view:

```typescript
import { goto } from '$app/navigation';

async function handleSubmit() {
  await db.createChapter(data);
  goto('/cards/chapters');  // Redirect to list
}
```

### Why This Pattern Works

1. **Single Source of Truth**: One `db` interface for all data access
2. **No Duplication**: No need for multiple wrappers or stores
3. **Consistent API**: Same methods everywhere
4. **Easy Testing**: Mock `db` in tests
5. **SvelteKit Integration**: Proper use of `afterNavigate()` for data refresh
6. **RESTful Routes**: Predictable URL structure
7. **Type Safety**: Full TypeScript support with imported types

### Common Pitfalls to Avoid

❌ **Don't create wrapper functions**:
```typescript
// WRONG
function getChapters() {
  return db.getAllChapters();
}
```

❌ **Don't use Svelte stores for database data**:
```typescript
// WRONG
import { writable } from 'svelte';
const chaptersStore = writable([]);
```

❌ **Don't use query parameters for IDs**:
```typescript
// WRONG
/cards/editor?id=123

// CORRECT
/cards/scenes/edit/123
```

❌ **Don't forget `afterNavigate()` in list views**:
```typescript
// WRONG - only loads once
onMount(() => {
  loadItems();
});

// CORRECT - reloads after navigation
onMount(() => {
  loadItems();
});

afterNavigate(() => {
  loadItems();
});
```

### Backend Integration

The `db` singleton automatically handles:
- API requests to backend (localhost:3000 in dev)
- localStorage fallback for offline support
- Response format normalization
- Error handling

Backend uses SQLite with JSON blob storage:
```sql
CREATE TABLE chapters (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
```

The API client handles both response formats:
- Wrapped: `{id: "chapter01", data: "{\"name\":\"Chapter 1\"}"}`
- Direct: `{id: "chapter01", name: "Chapter 1"}`

## Technology Stack

### Frontend

- **SvelteKit** - PWA framework with SSR/SSG capabilities
- **Svelte 5** - Reactive UI components
- **TypeScript** - Type-safe development
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Custom SVG Icons** - Local Lucide-based icon components
- **pnpm** - Fast, disk-efficient package manager
- **Workspaces** - Monorepo structure for micro-frontends

### State & Storage

- **localStorage** - Simple browser storage (via `apps/shared/database.ts`)
- No external state management needed (Svelte's reactivity is sufficient)

### Backend

- **C++ HTTP Server** - Custom REST API (httplib.h)
- **SQLite** - Lightweight database
- **Port 3000** - Backend API endpoint

### Removed Complexity

- ❌ No Comlink (was overkill for simple CRUD)
- ❌ No Web Workers (not needed without heavy computation)
- ❌ No LocalForage (localStorage is sufficient)
- ❌ No External Icon Libraries (custom SVG icons more reliable)

## Features (Planned)

### MVP (Phase 1)

- ✅ Project setup and infrastructure
- ⏳ Scene Card Editor with form fields
- ⏳ Real-time C code preview
- ⏳ Chapter management
- ⏳ Scene list view
- ⏳ Server integration (loke-engine API)
- ⏳ PWA offline support

### Future Enhancements (Phase 2+)

- Visual scene graph
- Syntax highlighting
- Scene templates
- State variable tracker
- Bulk operations
- Collaboration features

## Development Workflow

This project follows **TDD (Test-Driven Development)**:

1. Code small, testable units
2. Test with build/compile/test commands
3. Refactor with respect for existing code
4. Iterate until robust

### Critical Process Rules

- **Source of truth**: `TODO-CARDS.md` - work tasks **sequentially**
- **Track changes**: Log all changes to `CHANGELOG.md` (repo root)
- **Document tests**: Add test proofs to `doc/TEST-PROOF.md`
- **Git workflow**:
  - NEVER develop in main branch
  - Commit and push frequently
  - Before release: merge to main with full documentation

### Testing locally

#### Run only the navigation stability test

Option A — with dev server already running (recommended):

Terminal 1 - run app + backend:

```bash
npm run dev:full:watch
```

Terminal 2 - run the single test:

```bash
npm test tests/navigation-stability.spec.js
```

Option B — let Playwright manage the server:

```bash
PW_WEB_SERVER=1 PW_BASE_URL=http://127.0.0.1:8081   npm test tests/navigation-stability.spec.js
```

Notes:

- The test repeats Scenes ⇄ Dashboard transitions to catch intermittent issues.
- Proxy noise (when backend is offline) is ignored by this test.
- Ensure the dev server is running on the same port as Playwright’s baseURL.
- Override the test base URL with: `PW_BASE_URL=http://127.0.0.1:8081 npm test`.
- Or let Playwright start the server: `PW_WEB_SERVER=1 PW_BASE_URL=http://127.0.0.1:8081 npm test`.

## Loke Engine Integration

Loke Cards generates C code that interfaces with the loke-engine scene API:

```c
#include <loke/scene.h>

void scene_forest_entrance(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "You stand at the forest entrance.\n");
    scene_add_option(ctx, "Enter forest", scene_forest_path, true);
    scene_add_option(ctx, "Return to village", scene_village, true);
}
```

See **LOKE-FORMAT-REFERENCE.md** for complete format documentation.

### Compile generated C locally (optional)

The dev backend can export generated scenes as `.c` files to `server/output/` via:

```bash
curl -X POST http://127.0.0.1:3000/api/build
```

To compile these `.c` files (only to object files), point `LOKE_ENGINE_INC` to your Loke Engine headers and run:

```bash
cd server
export LOKE_ENGINE_INC=/opt/homebrew/include
make build-scenes
```

To compile these `.c` files (only to object files), point `LOKE_ENGINE_INC` to your Loke Engine headers and run:

```bash
cd server
export LOKE_ENGINE_INC=/opt/homebrew/include   # path containing loke/scene.h
make build-scenes
```

Objects are created in `server/build/`. This validates includes; linking a full binary requires the actual Loke Engine libs and is out of scope for the dev server.

## API Endpoints (Server Side)

Loke Cards connects to a loke-engine server with REST API:

- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project metadata + scenes
- `POST /api/projects/:id/chapters` - Create chapter
- `POST /api/projects/:id/chapters/:chapter/scenes` - Create/update scene
- `GET /api/projects/:id/chapters/:chapter/scenes/:scene` - Get scene
- `DELETE /api/projects/:id/chapters/:chapter/scenes/:scene` - Delete scene
- `POST /api/projects/:id/build` - Trigger project rebuild

## Environment Variables

```bash
# .env file
VITE_APP_URL=https://loke.tail2d448.ts.net/cards  # Production URL (fixed)
VITE_LOKE_ENGINE_API=https://loke.tail2d448.ts.net:3000  # Backend API URL
VITE_PROJECT_NAME=my-adventure  # Project name (optional)

# Backend CORS (dev server)
# Allow frontend origin during development (default "*")
# CORS_ALLOW_ORIGIN=http://127.0.0.1:8081
```

## Deployment

Designed for **LXC containers** on **Tailscale network**.

### Production Build

The app uses **@sveltejs/adapter-node** for Node.js deployment:

```bash
pnpm build
```

This creates:

- `.svelte-kit/output/server/` - Node.js server bundle (SSR)
- `.svelte-kit/output/client/` - Static assets
- `.svelte-kit/output/server/index.js` - Entry point (145 KB)

### Run Production Server

```bash
cd apps/front
node .svelte-kit/output/server/index.js
```

Or use the preview command:

```bash
pnpm preview
```

### Docker Deployment

Build container:

```bash
docker build -t loke-cards:latest .
```

Run container:

```bash
docker run -d \
  -p 8080:8080 \
  -e VITE_LOKE_ENGINE_API=http://loke-engine:3000 \
  --name loke-cards-project-a \
  loke-cards:latest
```

Each project gets its own loke-cards instance paired with its own loke-engine instance.

### Systemd (optional)

An example unit file is provided at `server/systemd/loke-cards-backend.service`.

Steps (adapt paths as needed):

1. Copy files to server: `/opt/loke-cards/`
2. Build backend:
   ```bash
   cd /opt/loke-cards/server && make
   ```
3. Install unit:
   ```bash
   sudo cp /opt/loke-cards/server/systemd/loke-cards-backend.service /etc/systemd/system/
   ```
4. Reload units:
   ```bash
   sudo systemctl daemon-reload
   ```
5. Enable + start:
   ```bash
   sudo systemctl enable --now loke-cards-backend
   ```
6. Check logs:
   ```bash
   journalctl -u loke-cards-backend -f
   ```

Set `CORS_ALLOW_ORIGIN` in the unit file to match your frontend origin.

## Icon Policy

**Use Custom SVG Icons Only**

This project uses a custom SVG icon system instead of external icon libraries or emoji:

### ✅ What to Use

- **Custom SVG icons** from `packages/ui/src/icons/`
- **Lucide-based design** - Consistent stroke-based icons
- **Fully customizable** with Tailwind classes (size, color, stroke-width)
- **Svelte components** with `{...$$props}` for flexibility

### ❌ What to Avoid

- **Emoji icons** (📝, 📄, 📚, etc.) - Inconsistent across platforms
- **ASCII icons** - Poor accessibility and styling
- **External icon libraries** - Dependency and compatibility issues

### Adding New Icons

1. Download SVG from [Lucide](https://lucide.dev/icons/)
2. Save to `packages/ui/src/icons/IconName.svg`
3. Create Svelte component:

```svelte
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-icon-name"
  {...$$props}
>
  <!-- SVG paths from downloaded file -->
</svg>
```

4. Import and use: `import IconName from '@loke/ui/icons/IconName.svelte';`

### Benefits

- 🚀 **No external dependencies** - No compatibility issues
- 🎨 **Consistent design** - All icons follow same visual style
- 🔧 **Fully customizable** - Size, color, stroke with Tailwind
- 📦 **Small bundle size** - Only icons we use are included
- ♿ **Better accessibility** - Proper SVG structure with semantic markup

## Documentation

- **CLAUDE.md** - Development guidance for Claude Code
- **TODO-CARDS.md** - Project tasks and roadmap
- **LOKE-FORMAT-REFERENCE.md** - C code format reference
- **CHANGELOG.md** (repo root) - Change history
- **doc/TEST-PROOF.md** - Test documentation

## Related Projects

- **loke-engine** (`/home/ubuntu/loke-engine/`) - Framework this generates content for
- **loke-docs** (`/home/ubuntu/loke-docs/`) - Shared documentation

## License

ISC

## Author

LokeGames
