# TODO: Multi-Project Architecture - v0.2.0

## Status
- ✅ v0.1.0 Released: Single-project MVP with SQLite
- 🔄 Next: Multi-project support with isolated databases

## Current Architecture (v0.1.0)

```
server/
├── dev.db                    # Single SQLite database
├── output/                   # Mixed C output files
└── main.cpp
```

**Database Schema** (simple document-store):
```sql
CREATE TABLE chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE scenes   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE states   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
```

**Problems:**
- ❌ All data in one database
- ❌ No project isolation
- ❌ Cannot backup individual projects
- ❌ Cannot version projects separately
- ❌ Output files mixed together

## Target Architecture (v0.2.0)

```
server/
└── projects/
    ├── adventure-game/
    │   ├── data/
    │   │   └── adventure-game.db    # Project database (id+data tables)
    │   ├── output/                   # Generated C files
    │   │   ├── chapter01/
    │   │   │   ├── scene_forest.c
    │   │   │   └── scene_village.c
    │   │   └── headers/
    │   │       └── chapter01.h
    │   └── assets/                   # Future: images, sounds
    │
    ├── horror-story/
    │   ├── data/
    │   │   └── horror-story.db
    │   ├── output/
    │   └── assets/
    │
    └── tutorial-demo/
        ├── data/
        │   └── tutorial-demo.db
        ├── output/
        └── assets/
```

**Benefits:**
- ✅ Complete project isolation
- ✅ Each project is self-contained folder
- ✅ Easy backup: `tar -czf adventure-game.tar.gz adventure-game/`
- ✅ Git-friendly: One repo per project
- ✅ Portable: Move/share entire project folder
- ✅ Simple database schema remains (id + JSON data)

## Implementation Plan

### Phase 1: Backend Server (C++)

#### 1.1 Project Directory Management
**File**: `server/main.cpp`

- [ ] Add project management functions:
  ```cpp
  std::string create_project(const std::string& project_name);
  bool project_exists(const std::string& project_name);
  std::vector<std::string> list_projects();
  bool delete_project(const std::string& project_name);
  std::string get_project_db_path(const std::string& project_name);
  ```

- [ ] Add directory creation:
  ```cpp
  // Create: server/projects/{name}/data/
  // Create: server/projects/{name}/output/
  // Create: server/projects/{name}/assets/
  mkdir_p("server/projects/" + name + "/data");
  mkdir_p("server/projects/" + name + "/output");
  mkdir_p("server/projects/" + name + "/assets");
  ```

- [ ] Update database open function:
  ```cpp
  // OLD: open_db("dev.db")
  // NEW: open_db("projects/" + project + "/data/" + project + ".db")
  ```

#### 1.2 Multi-Database Support
- [ ] Change from single `sqlite3* db` to database pool:
  ```cpp
  std::unordered_map<std::string, sqlite3*> db_pool;
  sqlite3* get_project_db(const std::string& project_name);
  ```

- [ ] Keep same simple schema per project:
  ```sql
  -- No schema changes needed!
  CREATE TABLE chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  CREATE TABLE scenes   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  CREATE TABLE states   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
  ```

#### 1.3 New API Endpoints
Add project context to all endpoints:

**Project Management:**
```
GET    /api/projects                    # List all projects
POST   /api/projects                    # Create new project (body: {name: "project-name"})
GET    /api/projects/:project           # Get project info (scene/chapter counts)
DELETE /api/projects/:project           # Delete project + all files
```

**Scenes (project-scoped):**
```
GET    /api/projects/:project/scenes    # List scenes
POST   /api/projects/:project/scenes    # Create scene
GET    /api/projects/:project/scenes/:id
PUT    /api/projects/:project/scenes/:id
DELETE /api/projects/:project/scenes/:id
```

**Chapters (project-scoped):**
```
GET    /api/projects/:project/chapters
POST   /api/projects/:project/chapters
GET    /api/projects/:project/chapters/:id
PUT    /api/projects/:project/chapters/:id
DELETE /api/projects/:project/chapters/:id
```

**States (project-scoped):**
```
GET    /api/projects/:project/states
POST   /api/projects/:project/states
GET    /api/projects/:project/states/:id
PUT    /api/projects/:project/states/:id
DELETE /api/projects/:project/states/:id
```

**Code Generation:**
```
POST   /api/projects/:project/build     # Generate C files to output/
GET    /api/projects/:project/output    # List generated files
```

#### 1.4 Update Code Generator
**File**: `server/include/codegen.hpp` and implementation

- [ ] Change output path:
  ```cpp
  // OLD: "output/scene_forest.c"
  // NEW: "projects/" + project + "/output/chapter01/scene_forest.c"
  ```

- [ ] Organize by chapters:
  ```cpp
  output_dir = "projects/" + project + "/output/" + chapter_id + "/";
  header_dir = "projects/" + project + "/output/headers/";
  ```

- [ ] Add project name to generated files:
  ```c
  // Generated by Loke Cards v0.2.0
  // Project: adventure-game
  // Chapter: chapter01
  // Scene: scene_forest
  ```

### Phase 2: Frontend Integration

#### 2.1 Update API Client
**File**: `apps/shared/src/api-client.ts` (create if not exists)

- [ ] Add project parameter to all methods:
  ```typescript
  // Project management
  async listProjects(): Promise<Project[]>
  async createProject(name: string): Promise<Project>
  async getProject(name: string): Promise<Project>
  async deleteProject(name: string): Promise<void>

  // Scenes (project-scoped)
  async getScenes(project: string): Promise<Scene[]>
  async createScene(project: string, scene: Omit<Scene, 'id'>): Promise<Scene>
  async updateScene(project: string, id: string, updates: Partial<Scene>): Promise<Scene>
  async deleteScene(project: string, id: string): Promise<void>

  // Same pattern for chapters and states
  ```

#### 2.2 Update Database Layer
**File**: `apps/shared/src/database.ts`

- [ ] Add current project tracking:
  ```typescript
  class Database {
    private currentProject: string | null = null;

    setCurrentProject(name: string) {
      this.currentProject = name;
      localStorage.setItem('loke-current-project', name);
    }

    getCurrentProject(): string | null {
      if (!this.currentProject) {
        this.currentProject = localStorage.getItem('loke-current-project');
      }
      return this.currentProject;
    }
  }
  ```

- [ ] Update all methods to use current project:
  ```typescript
  async getAllScenes(): Promise<Scene[]> {
    const project = this.getCurrentProject();
    if (!project) throw new Error('No project selected');
    // Use API or localStorage with project prefix
  }
  ```

#### 2.3 Add TypeScript Types
**File**: `apps/shared/src/types.ts`

- [ ] Add Project interface:
  ```typescript
  export interface Project {
    id: string;              // project-name (slug)
    name: string;            // Display name
    description?: string;
    created: string;         // ISO date
    modified: string;        // ISO date
    sceneCount: number;
    chapterCount: number;
    stateCount: number;
  }
  ```

- [ ] Keep existing Scene/Chapter/State types (no changes needed)

#### 2.4 Project Picker Component
**File**: `packages/ui/src/components/ProjectPicker.svelte` (create new)

- [ ] Create dropdown component:
  ```svelte
  <script lang="ts">
    import { currentProject, projects, switchProject } from '@loke/shared/stores/project';

    let isOpen = false;
  </script>

  <div class="project-picker">
    <button on:click={() => isOpen = !isOpen}>
      {$currentProject || 'Select Project'} ▾
    </button>

    {#if isOpen}
      <div class="dropdown">
        <input type="search" placeholder="Search projects..." />

        <div class="recent">
          <h4>Recent</h4>
          {#each $projects as project}
            <button on:click={() => switchProject(project.id)}>
              {project.name} ({project.sceneCount} scenes)
            </button>
          {/each}
        </div>

        <button class="create-new" on:click={createNewProject}>
          + Create New Project
        </button>
      </div>
    {/if}
  </div>
  ```

**Features:**
- [ ] Display current project name
- [ ] Dropdown with all projects
- [ ] Search/filter projects
- [ ] Recent projects at top
- [ ] Create new project button
- [ ] Show project stats (scene count)

**Placement:**
- [ ] Header (next to logo) - always visible
- [ ] Sidebar top section (expanded view)

#### 2.5 Project Management Page
**File**: `apps/front/src/routes/projects/+page.svelte` (create new)

- [ ] Project list view (card grid):
  ```svelte
  <div class="project-grid">
    {#each projects as project}
      <div class="project-card">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div class="stats">
          <span>{project.sceneCount} scenes</span>
          <span>{project.chapterCount} chapters</span>
        </div>
        <div class="actions">
          <button on:click={() => openProject(project.id)}>Open</button>
          <button on:click={() => editProject(project.id)}>Edit</button>
          <button on:click={() => deleteProject(project.id)}>Delete</button>
        </div>
      </div>
    {/each}
  </div>
  ```

- [ ] Create project modal/dialog
- [ ] Edit project dialog
- [ ] Delete confirmation with stats
- [ ] Empty state: "No projects yet, create one!"

#### 2.6 Update Header
**File**: `packages/ui/src/components/AppHeader.svelte`

- [ ] Add ProjectPicker component:
  ```svelte
  <header>
    <div class="logo">🎮 Loke Cards</div>
    <ProjectPicker />
    <div class="actions">
      <ThemeToggle />
      <Settings />
    </div>
  </header>
  ```

#### 2.7 Update Sidebar
**File**: `packages/ui/src/components/AppSidebar.svelte`

- [ ] Add project info section at top:
  ```svelte
  <aside>
    <div class="project-info">
      <h4>{$currentProject?.name}</h4>
      <p>{$currentProject?.sceneCount} scenes, {$currentProject?.chapterCount} chapters</p>
      <p class="modified">Modified: {formatRelativeTime($currentProject?.modified)}</p>
      <button on:click={openProjectPicker}>Switch Project ▾</button>
    </div>

    <!-- Existing menu items -->
    <nav>...</nav>
  </aside>
  ```

#### 2.8 Project Store
**File**: `apps/shared/src/stores/project.ts` (create new)

- [ ] Create Svelte stores:
  ```typescript
  import { writable, derived } from 'svelte/store';
  import type { Project } from '../types';

  export const currentProject = writable<Project | null>(null);
  export const projects = writable<Project[]>([]);

  export async function loadProjects() {
    const list = await apiClient.listProjects();
    projects.set(list);

    // Restore last selected project
    const lastProject = localStorage.getItem('loke-current-project');
    if (lastProject) {
      const project = list.find(p => p.id === lastProject);
      if (project) currentProject.set(project);
    }
  }

  export async function switchProject(projectId: string) {
    const list = get(projects);
    const project = list.find(p => p.id === projectId);
    if (project) {
      currentProject.set(project);
      localStorage.setItem('loke-current-project', projectId);
      // Trigger reload of scenes/chapters
      await reloadProjectData(projectId);
    }
  }

  export async function createProject(name: string, description?: string) {
    const project = await apiClient.createProject(name);
    projects.update(list => [...list, project]);
    await switchProject(project.id);
    return project;
  }
  ```

#### 2.9 Update Routing
**File**: `apps/front/src/routes/+layout.svelte`

- [ ] New URL structure:
  ```
  /                                    → Project list or redirect to last project
  /projects                            → Project management page
  /projects/:project                   → Project dashboard
  /projects/:project/scenes            → Scene list
  /projects/:project/scenes/new        → Create scene
  /projects/:project/scenes/edit/:id   → Edit scene
  /projects/:project/chapters          → Chapter list
  /projects/:project/chapters/new      → Create chapter
  /projects/:project/chapters/edit/:id → Edit chapter
  /projects/:project/states            → State list
  /projects/:project/states/new        → Create state
  /projects/:project/states/edit/:id   → Edit state
  /projects/:project/build             → Build output view
  ```

- [ ] Update all existing routes to include `:project` parameter

#### 2.10 Update All Views
Update existing views to use project context:

- [ ] `apps/front/src/routes/cards/scenes/+page.svelte` → `/projects/:project/scenes/+page.svelte`
- [ ] `apps/front/src/routes/cards/chapters/+page.svelte` → `/projects/:project/chapters/+page.svelte`
- [ ] `apps/front/src/routes/cards/states/+page.svelte` → `/projects/:project/states/+page.svelte`
- [ ] Dashboard → Show current project stats only

### Phase 3: Migration & Testing

#### 3.1 Migration Script
**File**: `scripts/migrate-to-v0.2.0.sh` (create new)

- [ ] Read existing `server/dev.db`
- [ ] Create default project: `server/projects/default-project/`
- [ ] Copy all data to new project database
- [ ] Move output files to `projects/default-project/output/`
- [ ] Backup original: `server/dev.db.backup`
- [ ] Update localStorage to use `default-project`

```bash
#!/bin/bash
# Migration script from v0.1.0 to v0.2.0

echo "Migrating to multi-project architecture..."

# 1. Create projects directory
mkdir -p server/projects/default-project/{data,output,assets}

# 2. Copy database
cp server/dev.db server/projects/default-project/data/default-project.db

# 3. Move output files
mv server/output/* server/projects/default-project/output/ 2>/dev/null || true

# 4. Backup old database
mv server/dev.db server/dev.db.backup

echo "Migration complete! Default project created."
echo "Old database backed up to: server/dev.db.backup"
```

#### 3.2 Backend Tests
- [ ] Create project: `POST /api/projects {name: "test-game"}`
- [ ] Verify directory structure created
- [ ] Add scene: `POST /api/projects/test-game/scenes`
- [ ] Verify scene in correct database
- [ ] List projects: `GET /api/projects`
- [ ] Build project: `POST /api/projects/test-game/build`
- [ ] Verify output in correct folder
- [ ] Delete project: `DELETE /api/projects/test-game`
- [ ] Verify all files removed

#### 3.3 Frontend Tests
- [ ] Project picker shows all projects
- [ ] Switch project updates scene list
- [ ] Create new project via UI
- [ ] Cannot see scenes from other projects
- [ ] Delete project confirmation works
- [ ] URL updates when switching projects

#### 3.4 Integration Tests
- [ ] Create project → add scenes → build → verify C files
- [ ] Switch projects → verify data isolation
- [ ] Backup project folder → restore → verify works
- [ ] localStorage persistence across browser reload

### Phase 4: Documentation

#### 4.1 Update Documentation Files
- [ ] Update `README.md` with multi-project info
- [ ] Update `RELEASE.md` with new structure
- [ ] Update `CLAUDE.md` with new API endpoints
- [ ] Create `docs/PROJECT-ARCHITECTURE.md`
- [ ] Add migration guide in `CHANGELOG.md`

#### 4.2 API Documentation
- [ ] Document all new `/api/projects/*` endpoints
- [ ] Add examples for each endpoint
- [ ] Document project folder structure

## Breaking Changes

⚠️ **API Changes:**
- All `/api/scenes`, `/api/chapters`, `/api/states` endpoints removed
- New endpoints require `:project` parameter
- Frontend must track current project

⚠️ **Database Migration:**
- `server/dev.db` → `server/projects/default-project/data/default-project.db`
- Migration script required (one-time)
- Backup recommended before upgrade

⚠️ **URL Structure:**
- All URLs now include project name
- Old bookmarks will break
- localStorage key changes

## Implementation Order

### Week 1: Backend Foundation
- [ ] 1.1 Project directory management
- [ ] 1.2 Multi-database support
- [ ] 1.3 Project management API endpoints
- [ ] Test: Create/list/delete projects

### Week 2: Backend Integration
- [ ] 1.3 Update scene/chapter/state endpoints with `:project`
- [ ] 1.4 Update code generator paths
- [ ] 3.1 Migration script
- [ ] Test: Full backend workflow

### Week 3: Frontend Foundation
- [ ] 2.1 Update API client
- [ ] 2.2 Update database layer
- [ ] 2.3 Add Project types
- [ ] 2.8 Project store
- [ ] Test: API integration

### Week 4: Frontend UI
- [ ] 2.4 Project Picker component
- [ ] 2.5 Project Management page
- [ ] 2.6 Update Header
- [ ] 2.7 Update Sidebar
- [ ] Test: UI workflow

### Week 5: Frontend Integration
- [ ] 2.9 Update routing
- [ ] 2.10 Update all views
- [ ] 3.3 Frontend tests
- [ ] Test: E2E workflow

### Week 6: Polish & Release
- [ ] 3.4 Integration tests
- [ ] 4.1 Documentation
- [ ] 4.2 API docs
- [ ] Release v0.2.0

## Success Criteria

✅ **Backend:**
- Multiple project databases can be created
- Each project has isolated data/output/assets folders
- API correctly routes to project-specific databases
- Code generator outputs to correct project folder

✅ **Frontend:**
- Project picker shows all projects
- Can switch between projects seamlessly
- All CRUD operations scoped to current project
- URL reflects current project
- localStorage persists project selection

✅ **Data Integrity:**
- No data loss during migration
- Projects completely isolated (no cross-contamination)
- Backup/restore works for individual projects

## Rollback Plan

If issues arise:
1. Stop server
2. Restore `server/dev.db.backup` → `server/dev.db`
3. Git checkout v0.1.0 tag
4. Restart server
5. Document issues for retry

## Future Enhancements (v0.3.0+)

- [ ] Project templates (starter, RPG, tutorial)
- [ ] Project export/import (tar.gz)
- [ ] Project settings page
- [ ] Project metadata file (`project.json`)
- [ ] Multi-project tabs
- [ ] Copy scenes between projects
- [ ] Project search/filter
- [ ] Project tags/categories
- [ ] Assets management (images, audio)

---

## Next Step

**Ready to start?**

Proposed first task: **Backend Phase 1.1 - Project Directory Management**

Create the foundation for multi-project support in `server/main.cpp`:
- Add project directory creation functions
- Add project listing functions
- Add project validation functions

Skal jeg starte der?
