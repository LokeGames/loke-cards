# TODO: Server Refactor - Project-based Database Architecture

## Overview

Refactor server from single `dev.db` to project-isolated architecture where each project is self-contained with its own database and output directory.

## Current Architecture ❌

```
server/
├── dev.db                    # Single database for all projects
└── output/                   # Mixed output from all projects
    ├── scene_forest.c
    ├── scene_village.c
    └── chapter01.h
```

**Problems:**
- All projects share one database
- No project isolation
- Output files mixed together
- Cannot backup/version individual projects
- Cannot transport projects independently

## Target Architecture ✅

```
server/
└── projects/
    ├── adventure-game/
    │   ├── adventure-game.db       # Project database
    │   └── output/                  # Generated C files
    │       ├── chapter01/
    │       │   ├── scene_forest.c
    │       │   └── scene_village.c
    │       ├── chapter02/
    │       │   └── scene_town.c
    │       └── headers/
    │           ├── chapter01.h
    │           └── chapter02.h
    ├── horror-story/
    │   ├── horror-story.db
    │   └── output/
    └── tutorial-demo/
        ├── tutorial-demo.db
        └── output/
```

**Benefits:**
- ✅ Complete project isolation
- ✅ Each project is self-contained
- ✅ Easy backup: `tar -czf adventure-game.tar.gz adventure-game/`
- ✅ Git-friendly: One repo per project
- ✅ Portable: Move entire project folder
- ✅ Multi-project support: Run multiple projects simultaneously

## Implementation Tasks

### Phase 1: Backend Server Refactor

#### 1.1 Update Database Layer
- [ ] Add project management functions
  - [ ] `create_project(name)` - Create project directory + database
  - [ ] `get_project(name)` - Load project database
  - [ ] `list_projects()` - List all projects
  - [ ] `delete_project(name)` - Remove project
- [ ] Change database path from `server/dev.db` to `server/projects/{project}/project.db`
- [ ] Add project context to all database operations
- [ ] Update SQLite connection pool to support multiple databases

#### 1.2 Update API Endpoints
Add project parameter to all endpoints:

**Current:**
```
GET  /api/scenes
POST /api/scenes
GET  /api/chapters
```

**New:**
```
GET  /api/projects                           # List all projects
POST /api/projects                           # Create new project
GET  /api/projects/:project                  # Get project info
DELETE /api/projects/:project                # Delete project

GET  /api/projects/:project/scenes           # List scenes
POST /api/projects/:project/scenes           # Create scene
GET  /api/projects/:project/scenes/:id       # Get scene
PUT  /api/projects/:project/scenes/:id       # Update scene
DELETE /api/projects/:project/scenes/:id     # Delete scene

GET  /api/projects/:project/chapters         # List chapters
POST /api/projects/:project/chapters         # Create chapter
GET  /api/projects/:project/chapters/:id     # Get chapter
PUT  /api/projects/:project/chapters/:id     # Update chapter
DELETE /api/projects/:project/chapters/:id   # Delete chapter

POST /api/projects/:project/build            # Build project
GET  /api/projects/:project/build/artifacts  # List generated files
```

#### 1.3 Update Code Generator
- [ ] Change output path from `server/output/` to `server/projects/{project}/output/`
- [ ] Organize by chapters: `output/chapter01/scene_forest.c`
- [ ] Generate headers in `output/headers/chapter01.h`
- [ ] Add project metadata to generated files (comments with project name)

#### 1.4 Migration Script
- [ ] Create migration tool: `scripts/migrate-to-projects.sh`
- [ ] Read existing `dev.db`
- [ ] Group scenes/chapters by `projectId` field
- [ ] Create project folders for each unique project
- [ ] Copy data to new project databases
- [ ] Backup old `dev.db` → `dev.db.backup`

### Phase 2: Frontend Integration

#### 2.1 Update API Client (`apps/shared/src/api-client.ts`)
- [ ] Add project parameter to all methods
- [ ] Add project management methods:
  - [ ] `createProject(name)`
  - [ ] `getProject(name)`
  - [ ] `listProjects()`
  - [ ] `deleteProject(name)`
- [ ] Update scene/chapter methods to include project:
  - [ ] `getAllScenes(project)` instead of `getAllScenes()`
  - [ ] `createScene(project, scene)` instead of `createScene(scene)`

#### 2.2 Update Database Layer (`apps/shared/src/database.ts`)
- [ ] Add current project tracking: `private currentProject: string`
- [ ] Add `setCurrentProject(name)` method
- [ ] Update all operations to use current project
- [ ] Add project switching support

#### 2.3 Update TypeScript Types (`apps/shared/src/types.ts`)
- [ ] Add `Project` interface:
  ```typescript
  export interface Project {
    id: string;
    name: string;
    description?: string;
    created: string;
    modified: string;
    sceneCount: number;
    chapterCount: number;
  }
  ```
- [ ] Remove `projectId` from Scene/Chapter (implied by project context)

#### 2.4 Update UI Components

##### 2.4.1 Project Picker Component
**Location**: `packages/ui/src/components/ProjectPicker.svelte`

**Features**:
- [ ] Dropdown/select menu showing all projects
- [ ] Display current project name prominently
- [ ] Quick-switch between projects (instant switch, no page reload)
- [ ] Search/filter projects (if many projects)
- [ ] Show project metadata on hover (scene count, last modified)
- [ ] "Create New Project" button at bottom of dropdown
- [ ] Keyboard shortcuts (Ctrl+P to open picker)
- [ ] Recent projects at top of list
- [ ] Project favorites/pinning

**Placement**:
- [ ] **Primary**: Header (next to logo) - Always visible
- [ ] **Secondary**: Sidebar top section - Expanded view
- [ ] **Mobile**: Hamburger menu - Full screen overlay

**UI States**:
- [ ] Loading state (fetching projects)
- [ ] Empty state ("No projects yet, create one!")
- [ ] Error state (backend unavailable)
- [ ] Selected state (current project highlighted)

**Interactions**:
```
User clicks project name in header
  → Dropdown opens with all projects
  → User selects different project
  → App switches context (reload scenes/chapters)
  → Dashboard updates with new project stats
  → URL updates: /projects/{new-project}/scenes
```

##### 2.4.2 Project Management Page
**Location**: `apps/front/src/routes/projects/+page.svelte`

**Layout**: Card grid showing all projects

**Features**:
- [ ] **List View**:
  - Project cards with thumbnail/icon
  - Project name, description, stats
  - Last modified date
  - Scene count, chapter count
  - Quick actions (Open, Edit, Delete, Export)

- [ ] **Create Project**:
  - Modal/dialog with form
  - Project name (required)
  - Description (optional)
  - Choose template (optional: blank, starter, RPG)
  - Color/icon picker (optional)

- [ ] **Edit Project**:
  - Rename project
  - Update description
  - Change icon/color

- [ ] **Delete Project**:
  - Confirmation dialog: "Delete 'Adventure Game'? This cannot be undone."
  - Show stats: "This will delete 24 scenes and 5 chapters"
  - Type project name to confirm

- [ ] **Export Project**:
  - Download as .tar.gz or .zip
  - Include database + output files + metadata
  - Show download progress

- [ ] **Import Project**:
  - Drag-and-drop or file picker
  - Upload .tar.gz or .zip
  - Validate project structure
  - Handle name conflicts (rename or overwrite)
  - Show import progress

- [ ] **Search & Filter**:
  - Search by name/description
  - Filter by date created/modified
  - Sort by name, date, size, scene count

##### 2.4.3 Header Integration
**Location**: `packages/ui/src/components/AppHeader.svelte`

**Current project display**:
```
┌─────────────────────────────────────────────────┐
│ 🎮 Loke Cards | [Adventure Game ▾] | 🌙 Settings│
└─────────────────────────────────────────────────┘
```

**With project picker open**:
```
┌─────────────────────────────────────────────────┐
│ 🎮 Loke Cards | [Adventure Game ▾]              │
│              ┌───────────────────────────────┐  │
│              │ 🔍 Search projects...        │  │
│              ├───────────────────────────────┤  │
│              │ ⭐ Recent                     │  │
│              │ ✓ Adventure Game (24 scenes) │  │
│              │   Horror Story (12 scenes)   │  │
│              │   Tutorial Demo (5 scenes)   │  │
│              ├───────────────────────────────┤  │
│              │ 📁 All Projects              │  │
│              │   Fantasy Quest              │  │
│              │   Sci-Fi Odyssey             │  │
│              ├───────────────────────────────┤  │
│              │ ➕ Create New Project        │  │
│              └───────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

##### 2.4.4 Sidebar Integration
**Location**: `packages/ui/src/components/AppSidebar.svelte`

**Project info section** (top of sidebar):
```
┌─────────────────────────┐
│ 📦 Adventure Game       │
│ ────────────────────    │
│ 24 scenes, 5 chapters   │
│ Modified: 2 hours ago   │
│                         │
│ [Switch Project ▾]      │
└─────────────────────────┘
```

##### 2.4.5 Dashboard Updates
**Location**: `apps/front/src/routes/+page.svelte`

- [ ] Show current project name in page title
- [ ] Filter stats by current project only
- [ ] Add "Project Overview" card:
  - Project description
  - Creation date
  - Total scenes/chapters
  - Last build date
  - Quick actions (Build, Export, Settings)

##### 2.4.6 URL Routing
**New URL structure** after refactor:
```
/                              → Redirect to /projects (if no project selected)
/projects                      → Project list/management page
/projects/:project             → Project dashboard
/projects/:project/scenes      → Scene list
/projects/:project/scenes/:id  → Scene editor
/projects/:project/chapters    → Chapter list
/projects/:project/chapters/:id→ Chapter editor
/projects/:project/build       → Build output view
/projects/:project/settings    → Project settings
```

**Current project persistence**:
- [ ] Store in localStorage: `loke-current-project`
- [ ] Update on project switch
- [ ] Restore on app load
- [ ] Show project name in browser tab: "Scene Editor - Adventure Game | Loke Cards"

##### 2.4.7 Context/State Management
**Project store** (`apps/shared/src/stores/project.ts`):
```typescript
import { writable } from 'svelte/store';

export const currentProject = writable<string | null>(null);
export const projects = writable<Project[]>([]);

export async function switchProject(projectId: string) {
  currentProject.set(projectId);
  localStorage.setItem('loke-current-project', projectId);
  // Trigger reload of scenes/chapters for new project
}

export async function loadProjects() {
  const list = await apiClient.listProjects();
  projects.set(list);
}
```

**Usage in components**:
```svelte
<script>
  import { currentProject } from '@loke/shared/stores/project';

  $: if ($currentProject) {
    loadScenesForProject($currentProject);
  }
</script>
```

##### 2.4.8 Migration UX
- [ ] **First-time user** (no projects):
  - Show welcome screen
  - Prompt to create first project
  - Offer templates

- [ ] **Existing user** (after migration):
  - Show migration success message
  - Explain new project structure
  - Offer tutorial/tour of new features

### Phase 3: Advanced Features (Future)

#### 3.1 Project Templates
- [ ] Create project templates: `server/templates/`
  - `starter-template/` - Basic adventure
  - `tutorial-template/` - Step-by-step guide
  - `rpg-template/` - RPG with stats/inventory
- [ ] API: `POST /api/projects?template=starter`

#### 3.2 Project Export/Import
- [ ] `GET /api/projects/:project/export` - Download as .tar.gz
- [ ] `POST /api/projects/import` - Upload and extract project
- [ ] Include database + output files + metadata

#### 3.3 Project Metadata
- [ ] Add `project.json` to each project folder:
  ```json
  {
    "name": "Adventure Game",
    "description": "A fantasy adventure",
    "created": "2025-10-23T12:00:00Z",
    "modified": "2025-10-23T15:30:00Z",
    "version": "1.0.0",
    "author": "Developer Name",
    "tags": ["fantasy", "adventure", "rpg"]
  }
  ```

#### 3.4 Multi-project Development
- [ ] Open multiple projects in tabs
- [ ] Copy scenes/chapters between projects
- [ ] Project comparison view
- [ ] Merge projects

## Implementation Order

1. **Week 1: Backend Refactor**
   - Tasks 1.1, 1.2, 1.3 (project-based database + API)
   - Migration script (1.4)
   - Test with existing data

2. **Week 2: Frontend Integration**
   - Tasks 2.1, 2.2, 2.3 (API client + types)
   - Project Picker UI (2.4)
   - Test project switching

3. **Week 3: Polish & Testing**
   - Project Management page
   - Update all Cards components
   - E2E tests for multi-project workflow

4. **Future: Advanced Features**
   - Phase 3 tasks as needed

## Testing Strategy

### Backend Tests
- [ ] Create project: `POST /api/projects` with name
- [ ] List projects: `GET /api/projects` returns array
- [ ] Get project: `GET /api/projects/adventure-game` returns metadata
- [ ] Add scene to project: `POST /api/projects/adventure-game/scenes`
- [ ] Build project: `POST /api/projects/adventure-game/build`
- [ ] Verify output: Check `server/projects/adventure-game/output/`
- [ ] Delete project: `DELETE /api/projects/adventure-game`
- [ ] Migration: Run script, verify all data moved correctly

### Frontend Tests
- [ ] Project picker shows all projects
- [ ] Switch project updates dashboard stats
- [ ] Create new project creates folder + database
- [ ] Scenes list filtered by current project
- [ ] Cannot see scenes from other projects
- [ ] Delete project removes from list

### Integration Tests
- [ ] Create project → add scenes → build → verify C files
- [ ] Switch projects → verify data isolation
- [ ] Export project → import to different server → verify works
- [ ] Backup project → delete → restore → verify intact

## Breaking Changes

⚠️ **API Changes:**
- All endpoints now require `:project` parameter
- Frontend must track current project
- Old bookmarks/URLs will break

⚠️ **Data Migration:**
- Existing `dev.db` data must be migrated
- One-time migration script required
- Backup recommended before migration

## Rollback Plan

If refactor fails:
1. Restore `dev.db.backup`
2. Revert API endpoints to old format
3. Keep frontend on old database layer
4. Document issues and retry

## Documentation Updates

- [ ] Update `README.md` with project-based architecture
- [ ] Update `CLAUDE.md` with new API endpoints
- [ ] Create `docs/PROJECT-ARCHITECTURE.md`
- [ ] Update backend API documentation
- [ ] Add migration guide for existing users

## Benefits Summary

✅ **Better Organization**: Projects completely isolated
✅ **Version Control**: Each project can be a Git repo
✅ **Portability**: Copy/move entire project folders
✅ **Backups**: Simple `tar` or `zip` per project
✅ **Scalability**: Support unlimited projects
✅ **Collaboration**: Share individual projects easily
✅ **Multi-tenancy**: Multiple users can have separate projects (future)

---

## Decision

**Should we proceed with this refactor?**

Vote: ✅ YES - This is the right architecture for loke-cards

**Priority**: High - Implement before adding more features

**Timeline**: 3 weeks (phased approach)

**Risk**: Medium - Requires database migration and API changes

**Value**: High - Makes project much more usable and scalable
