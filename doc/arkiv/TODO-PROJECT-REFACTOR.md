# TODO: Multi-Project Architecture - v0.2.0 (Pointer Method)

## Status - ✅ IMPLEMENTATION COMPLETE!
- ✅ v0.1.0 Released: Single-project MVP with SQLite
- ✅ **v0.2.0 Multi-project architecture IMPLEMENTED**
- ✅ Backend Phase 1: Complete (all endpoints working)
- ✅ Frontend Phase 2: Complete (ProjectPicker integrated)
- ✅ Build & Testing: Frontend builds, backend tested
- 🔄 **Next**: Integration testing in browser & merge to dev

**Branch**: `feature/multi-project-architecture`
**Commits**: 7 commits ready for merge
**Status**: Ready for final testing and merge

## Key Insight: The Pointer Method 💡

Instead of refactoring all API endpoints, we simply:
1. **Backend**: Change database path pointer based on current project
2. **Frontend**: Add project picker to switch current project
3. **Everything else**: Business as usual - NO API changes!

## Current Architecture (v0.1.0)

```
server/
├── dev.db                    # Single SQLite database
├── output/                   # Mixed C output files
└── main.cpp
```

**Database Schema** (stays the same):
```sql
CREATE TABLE chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE scenes   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE states   (id TEXT PRIMARY KEY, data TEXT NOT NULL);
```

## Target Architecture (v0.2.0)

```
server/
└── projects/
    ├── default/
    │   ├── data/
    │   │   └── default.db           # SQLite database (same schema)
    │   ├── output/                   # Generated C files
    │   └── assets/                   # Future: images, sounds
    │
    ├── adventure-game/
    │   ├── data/
    │   │   └── adventure-game.db
    │   ├── output/
    │   └── assets/
    │
    └── horror-story/
        ├── data/
        │   └── horror-story.db
        ├── output/
        └── assets/
```

**Key Change**: Global pointer determines which database to use!

```cpp
// Backend state
static std::string current_project = "default";
static sqlite3* db = nullptr;

// Helper function
std::string get_db_path() {
    return "projects/" + current_project + "/data/" + current_project + ".db";
}

// When switching project: close old db, open new db
```

## Benefits of Pointer Method

- ✅ **Zero API changes** - All existing endpoints work unchanged
- ✅ **Minimal backend code** - Just path management + one endpoint
- ✅ **Minimal frontend code** - Just project picker component
- ✅ **Fast implementation** - Days, not weeks
- ✅ **Easy to test** - Small surface area
- ✅ **Backwards compatible** - Existing code keeps working
- ✅ **Simple to understand** - No complex routing logic

## Implementation Plan

### Phase 1: Backend (1-2 days)

#### 1.1 Project Directory Management
**File**: `server/main.cpp`

Add helper functions (no HTTP endpoints yet):

```cpp
// Global state
static std::string current_project = "default";
static std::mutex project_mutex;

// Project management functions
std::string sanitize_project_name(const std::string& name) {
    // Convert to lowercase, replace spaces with dashes, remove special chars
    std::string result;
    for (char c : name) {
        if (std::isalnum(c)) result += std::tolower(c);
        else if (c == ' ' || c == '_') result += '-';
    }
    return result;
}

std::string get_project_dir(const std::string& project) {
    return "projects/" + project;
}

std::string get_project_db_path(const std::string& project) {
    return get_project_dir(project) + "/data/" + project + ".db";
}

std::string get_project_output_path(const std::string& project) {
    return get_project_dir(project) + "/output";
}

std::string get_project_assets_path(const std::string& project) {
    return get_project_dir(project) + "/assets";
}

bool create_project_dirs(const std::string& project) {
    // Create: projects/{name}/data/
    // Create: projects/{name}/output/
    // Create: projects/{name}/assets/
    std::string base = get_project_dir(project);

    mkdir(base.c_str(), 0755);
    mkdir((base + "/data").c_str(), 0755);
    mkdir((base + "/output").c_str(), 0755);
    mkdir((base + "/assets").c_str(), 0755);

    return true;
}

bool project_exists(const std::string& project) {
    struct stat info;
    std::string path = get_project_dir(project);
    return (stat(path.c_str(), &info) == 0 && S_ISDIR(info.st_mode));
}

std::vector<std::string> list_projects() {
    std::vector<std::string> projects;
    DIR* dir = opendir("projects");
    if (!dir) return projects;

    struct dirent* entry;
    while ((entry = readdir(dir)) != nullptr) {
        if (entry->d_type == DT_DIR &&
            strcmp(entry->d_name, ".") != 0 &&
            strcmp(entry->d_name, "..") != 0) {
            projects.push_back(entry->d_name);
        }
    }
    closedir(dir);
    return projects;
}

int count_records(const std::string& table) {
    // Helper to count scenes/chapters/states in current project
    std::lock_guard<std::mutex> lock(db_mutex);
    sqlite3_stmt* stmt = nullptr;
    std::string sql = "SELECT COUNT(*) FROM " + table;

    if (sqlite3_prepare_v2(db, sql.c_str(), -1, &stmt, nullptr) != SQLITE_OK) {
        return 0;
    }

    int count = 0;
    if (sqlite3_step(stmt) == SQLITE_ROW) {
        count = sqlite3_column_int(stmt, 0);
    }
    sqlite3_finalize(stmt);
    return count;
}
```

**Tasks:**
- [x] Add project path helper functions
- [x] Add project directory creation
- [x] Add project existence check
- [x] Add project listing
- [x] Add record counting per table

#### 1.2 Update Database Opening
**File**: `server/main.cpp`

Change `open_db()` to use project path:

```cpp
static int open_db(const std::string &project_name) {
    std::lock_guard<std::mutex> lock(db_mutex);

    // Close existing connection if open
    if (db) {
        sqlite3_close(db);
        db = nullptr;
    }

    // Get path for this project
    std::string db_path = get_project_db_path(project_name);

    // Ensure project directories exist
    create_project_dirs(project_name);

    // Open database
    int rc = sqlite3_open(db_path.c_str(), &db);
    if (rc != SQLITE_OK) return rc;

    // Create tables (same schema as before)
    const char* ddl_chapters = "CREATE TABLE IF NOT EXISTS chapters (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_scenes   = "CREATE TABLE IF NOT EXISTS scenes (id TEXT PRIMARY KEY, data TEXT NOT NULL);";
    const char* ddl_states   = "CREATE TABLE IF NOT EXISTS states (id TEXT PRIMARY KEY, data TEXT NOT NULL);";

    char* errmsg = nullptr;
    if (sqlite3_exec(db, ddl_chapters, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_scenes, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }
    if (sqlite3_exec(db, ddl_states, nullptr, nullptr, &errmsg) != SQLITE_OK) {
        std::cerr << "DB error: " << errmsg << std::endl;
        sqlite3_free(errmsg);
    }

    return SQLITE_OK;
}
```

**Tasks:**
- [x] Update `open_db()` to accept project name
- [x] Auto-create project directories on open
- [x] Close old connection before opening new

#### 1.3 Add Project Management Endpoints
**File**: `server/main.cpp`

Add MINIMAL new endpoints (only 4 needed):

```cpp
// GET /api/projects - List all projects
svr.Get("/api/projects", [&](const httplib::Request &req, httplib::Response &res) {
    auto projects = list_projects();

    std::ostringstream json;
    json << "[";
    bool first = true;

    for (const auto& proj : projects) {
        // Temporarily switch to get stats
        open_db(proj);

        int scenes = count_records("scenes");
        int chapters = count_records("chapters");
        int states = count_records("states");

        if (!first) json << ",";
        first = false;

        json << "{"
             << "\"id\":\"" << proj << "\","
             << "\"name\":\"" << proj << "\","
             << "\"sceneCount\":" << scenes << ","
             << "\"chapterCount\":" << chapters << ","
             << "\"stateCount\":" << states
             << "}";
    }
    json << "]";

    // Switch back to current project
    open_db(current_project);

    res.set_content(json.str(), "application/json");
});

// POST /api/projects - Create new project
svr.Post("/api/projects", [&](const httplib::Request &req, httplib::Response &res) {
    std::string name = json_get_string_field(req.body, "name");
    if (name.empty()) {
        res.status = 400;
        res.set_content("{\"message\":\"Project name required\"}", "application/json");
        return;
    }

    std::string project_id = sanitize_project_name(name);

    if (project_exists(project_id)) {
        res.status = 409;
        res.set_content("{\"message\":\"Project already exists\"}", "application/json");
        return;
    }

    create_project_dirs(project_id);
    open_db(project_id);

    std::ostringstream json;
    json << "{"
         << "\"id\":\"" << project_id << "\","
         << "\"name\":\"" << name << "\","
         << "\"sceneCount\":0,"
         << "\"chapterCount\":0,"
         << "\"stateCount\":0"
         << "}";

    res.set_content(json.str(), "application/json");
});

// POST /api/projects/switch - Switch current project
svr.Post("/api/projects/switch", [&](const httplib::Request &req, httplib::Response &res) {
    std::string project = json_get_string_field(req.body, "project");

    if (project.empty()) {
        res.status = 400;
        res.set_content("{\"message\":\"Project name required\"}", "application/json");
        return;
    }

    if (!project_exists(project)) {
        res.status = 404;
        res.set_content("{\"message\":\"Project not found\"}", "application/json");
        return;
    }

    std::lock_guard<std::mutex> lock(project_mutex);
    current_project = project;
    open_db(current_project);

    res.set_content("{\"message\":\"Switched to project: " + project + "\"}", "application/json");
});

// GET /api/projects/current - Get current project
svr.Get("/api/projects/current", [&](const httplib::Request &req, httplib::Response &res) {
    int scenes = count_records("scenes");
    int chapters = count_records("chapters");
    int states = count_records("states");

    std::ostringstream json;
    json << "{"
         << "\"id\":\"" << current_project << "\","
         << "\"name\":\"" << current_project << "\","
         << "\"sceneCount\":" << scenes << ","
         << "\"chapterCount\":" << chapters << ","
         << "\"stateCount\":" << states
         << "}";

    res.set_content(json.str(), "application/json");
});
```

**Tasks:**
- [x] `GET /api/projects` - List all projects with stats
- [x] `POST /api/projects` - Create new project
- [x] `POST /api/projects/switch` - Switch current project pointer
- [x] `GET /api/projects/current` - Get current project info

#### 1.4 Update Code Generator Output Path
**File**: `server/include/codegen.hpp` or wherever code generation happens

```cpp
std::string get_output_path(const std::string& chapter_id, const std::string& scene_id) {
    return get_project_output_path(current_project) + "/" + chapter_id + "/" + scene_id + ".c";
}

std::string get_header_path(const std::string& chapter_id) {
    return get_project_output_path(current_project) + "/headers/" + chapter_id + ".h";
}
```

**Tasks:**
- [x] Update code generator to use `current_project` in paths
- [x] Output goes to project-specific directory
- [x] Build artifacts organized per project

#### 1.5 Migration from v0.1.0
**File**: Run once at startup or via script

```cpp
void migrate_from_v0_1_0() {
    struct stat info;

    // Check if old dev.db exists
    if (stat("dev.db", &info) != 0 || !S_ISREG(info.st_mode)) {
        return; // No migration needed
    }

    std::cout << "Migrating v0.1.0 database to v0.2.0..." << std::endl;

    // Create default project
    create_project_dirs("default");

    // Copy dev.db to default project
    std::string dest = get_project_db_path("default");
    std::ifstream src("dev.db", std::ios::binary);
    std::ofstream dst(dest, std::ios::binary);
    dst << src.rdbuf();

    // Move output files if they exist
    if (stat("output", &info) == 0 && S_ISDIR(info.st_mode)) {
        system("mv output/* projects/default/output/ 2>/dev/null");
    }

    // Backup old database
    std::rename("dev.db", "dev.db.v0.1.0.backup");

    std::cout << "Migration complete! Old database backed up to dev.db.v0.1.0.backup" << std::endl;
}

// In main():
int main() {
    migrate_from_v0_1_0();  // Run migration if needed

    // Ensure projects directory exists
    mkdir("projects", 0755);

    // Create default project if none exist
    if (list_projects().empty()) {
        create_project_dirs("default");
    }

    // Open default project
    current_project = "default";
    open_db(current_project);

    // Start server...
}
```

**Tasks:**
- [x] Auto-detect v0.1.0 database
- [x] Copy to `projects/default/`
- [x] Backup old database
- [x] Ensure default project exists on startup

### Phase 2: Frontend (2-3 days)

#### 2.1 Add Project Types
**File**: `apps/shared/src/types.ts`

```typescript
export interface Project {
  id: string;              // project-slug
  name: string;            // Display name
  sceneCount: number;
  chapterCount: number;
  stateCount: number;
}
```

**Tasks:**
- [x] Add Project interface
- [x] Keep all existing types unchanged

#### 2.2 Add Project API Client Methods
**File**: `apps/shared/src/api-client.ts` (create if needed) or add to existing client

```typescript
const API_BASE = 'http://localhost:8080/api';

export async function listProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`);
  return res.json();
}

export async function getCurrentProject(): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects/current`);
  return res.json();
}

export async function createProject(name: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function switchProject(projectId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ project: projectId })
  });

  if (!res.ok) {
    throw new Error('Failed to switch project');
  }
}
```

**Tasks:**
- [x] Add project API methods
- [x] Keep all existing scene/chapter/state methods unchanged
- [x] No changes needed to existing API calls!

#### 2.3 Add Project Store
**File**: `apps/shared/src/stores/project.ts` (create new)

```typescript
import { writable, get } from 'svelte/store';
import type { Project } from '../types';
import { listProjects, getCurrentProject, createProject, switchProject as apiSwitchProject } from '../api-client';

export const currentProject = writable<Project | null>(null);
export const projects = writable<Project[]>([]);
export const isLoadingProjects = writable(false);

export async function loadProjects() {
  isLoadingProjects.set(true);
  try {
    const list = await listProjects();
    projects.set(list);

    // Load current project
    const current = await getCurrentProject();
    currentProject.set(current);
  } finally {
    isLoadingProjects.set(false);
  }
}

export async function switchProject(projectId: string) {
  await apiSwitchProject(projectId);

  // Reload current project info
  const current = await getCurrentProject();
  currentProject.set(current);

  // Trigger page reload to refresh data
  window.location.reload();
}

export async function createNewProject(name: string) {
  const project = await createProject(name);

  // Add to list
  projects.update(list => [...list, project]);

  // Switch to new project
  await switchProject(project.id);

  return project;
}
```

**Tasks:**
- [x] Create project store with Svelte 5 runes
- [x] Add load/switch/create functions
- [x] Auto-reload page on project switch

#### 2.4 Project Picker Component
**File**: `packages/ui/src/components/ProjectPicker.svelte` (create new)

```svelte
<script lang="ts">
  import { currentProject, projects, switchProject, createNewProject, loadProjects } from '@loke/shared/stores/project';
  import { onMount } from 'svelte';

  let isOpen = $state(false);
  let searchQuery = $state('');
  let isCreating = $state(false);
  let newProjectName = $state('');

  onMount(() => {
    loadProjects();
  });

  $: filteredProjects = $projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleSwitch(projectId: string) {
    isOpen = false;
    await switchProject(projectId);
  }

  async function handleCreate() {
    if (!newProjectName.trim()) return;

    await createNewProject(newProjectName);
    newProjectName = '';
    isCreating = false;
    isOpen = false;
  }
</script>

<div class="project-picker">
  <button class="picker-trigger" onclick={() => isOpen = !isOpen}>
    <span class="project-icon">📁</span>
    <span class="project-name">{$currentProject?.name || 'Select Project'}</span>
    <span class="chevron">▾</span>
  </button>

  {#if isOpen}
    <div class="picker-dropdown">
      <input
        type="search"
        bind:value={searchQuery}
        placeholder="Search projects..."
        class="search-input"
      />

      <div class="projects-list">
        {#each filteredProjects as project}
          <button
            class="project-item"
            class:active={$currentProject?.id === project.id}
            onclick={() => handleSwitch(project.id)}
          >
            <span class="project-name">{project.name}</span>
            <span class="project-stats">{project.sceneCount} scenes</span>
          </button>
        {/each}
      </div>

      {#if isCreating}
        <div class="create-form">
          <input
            type="text"
            bind:value={newProjectName}
            placeholder="Project name..."
            class="create-input"
          />
          <button onclick={handleCreate}>Create</button>
          <button onclick={() => isCreating = false}>Cancel</button>
        </div>
      {:else}
        <button class="create-button" onclick={() => isCreating = true}>
          ➕ Create New Project
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .project-picker {
    position: relative;
  }

  .picker-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    cursor: pointer;
  }

  .picker-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 0.25rem;
    min-width: 16rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 50;
  }

  .search-input {
    width: 100%;
    padding: 0.5rem;
    border: none;
    border-bottom: 1px solid var(--border-color);
  }

  .projects-list {
    max-height: 20rem;
    overflow-y: auto;
  }

  .project-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    background: transparent;
    cursor: pointer;
    text-align: left;
  }

  .project-item:hover {
    background: var(--bg-secondary);
  }

  .project-item.active {
    background: var(--accent-color);
    color: white;
  }

  .create-button {
    width: 100%;
    padding: 0.75rem;
    border-top: 1px solid var(--border-color);
    background: transparent;
    cursor: pointer;
  }
</style>
```

**Tasks:**
- [x] Create ProjectPicker.svelte component
- [x] Add search/filter functionality
- [x] Show current project prominently
- [x] Inline create new project form
- [x] Close on project switch

#### 2.5 Update Header
**File**: `packages/ui/src/components/AppHeader.svelte`

```svelte
<script lang="ts">
  import ProjectPicker from './ProjectPicker.svelte';
  import ThemeToggle from './ThemeToggle.svelte';
</script>

<header>
  <div class="logo">
    🎮 Loke Cards
  </div>

  <ProjectPicker />

  <div class="actions">
    <ThemeToggle />
  </div>
</header>
```

**Tasks:**
- [x] Import and add ProjectPicker to header
- [x] Position between title and theme toggle

#### 2.6 Optional: Project Management Page
**File**: `apps/front/src/routes/projects/+page.svelte` (optional, can be added later)

Simple page showing all projects in grid view with create/delete actions.

**Tasks:**
- [ ] Create projects page (optional for MVP)
- [ ] Can be added in future iteration

### Phase 3: Testing (1 day)

#### 3.1 Backend Tests
- [x] Server starts, creates `projects/` directory
- [x] Migration runs on first start (if dev.db exists)
- [x] `GET /api/projects` returns projects list
- [x] `POST /api/projects {name: "Adventure Game"}` creates project
- [x] Project directory structure exists: `projects/adventure-game/data/`, `output/`, `assets/`
- [x] Database file created: `projects/adventure-game/data/adventure-game.db`
- [x] `POST /api/projects/switch {project: "adventure-game"}` switches pointer
- [x] `GET /api/scenes` now returns scenes from test project
- [x] `POST /api/scenes` saves to test project database
- [x] `GET /api/projects/current` returns correct project stats

#### 3.2 Frontend Tests
- [x] Frontend builds successfully with Vite
- [x] ProjectPicker component uses Svelte 5 runes
- [x] All TypeScript types validated
- [x] Layout integration in both apps complete
- [x] No compilation errors

#### 3.3 Integration Test (COMPLETED via Agentic Testing)
- [x] Start full stack (backend + frontend)
- [x] Test ProjectPicker UI in browser (via agentic test)
- [x] Verified project list displays correctly
- [x] Found and fixed Icon_2 error in AppSidebar
- [x] Found and fixed backend project scanner bug
- [x] Verified project isolation (5 clean projects)
- [ ] Create project via UI (manual test pending)
- [ ] Switch between projects via UI (manual test pending)
- [ ] Add scenes to different projects (manual test pending)
- [ ] Test build command for each project (pending)

### Phase 4: Documentation (1 day)

- [x] Update `README.md` - Added Agentic Testing section (COMPLETE)
- [x] Update `CHANGELOG.md` - v0.2.0 changes (COMPLETE)
- [ ] Update `CLAUDE.md` - New API endpoints (TODO)
- [x] Migration guide included in CHANGELOG.md
- [x] Added doc/ai-ui-test.md - Agentic testing guide (COMPLETE)
- [x] Added tests/agent/AGENTIC-TEST-FINDINGS.md - Bug report (COMPLETE)

## Total Timeline: ~1 Week! 🚀

- **Day 1-2**: Backend implementation
- **Day 3-4**: Frontend implementation
- **Day 5**: Testing
- **Day 6**: Documentation + polish
- **Day 7**: Buffer/release

## Breaking Changes

⚠️ **Minimal breaking changes:**
- Old `dev.db` automatically migrated to `projects/default/`
- All existing API endpoints work exactly the same
- Frontend just needs project picker added

## Success Criteria

✅ **Backend:**
- Can create multiple projects
- Each project has isolated database + directories
- Pointer correctly switches between projects
- Migration from v0.1.0 works automatically

✅ **Frontend:**
- Project picker shows all projects
- Can switch projects seamlessly
- All existing UI works with current project
- No broken functionality

✅ **Data Integrity:**
- No data loss during migration
- Projects completely isolated
- Database per project works correctly

## Next Steps After v0.2.0

Future enhancements (v0.3.0+):
- Project export/import (tar.gz)
- Project templates
- Project settings/metadata
- Assets management
- Project sharing

---

## Start Implementation?

Proposed first task: **Backend Phase 1.1 - Project Directory Management**

Ready to start coding? 🎯


## Future Enhancements (v0.3.0+)

### Cloud Backup Integration
- [ ] Dropbox sync for project backups
- [ ] JottaCloud integration
- [ ] GitHub repository sync (version control)
- [ ] Auto-backup on project changes
- [ ] Backup restore functionality
- [ ] Conflict resolution for cloud sync

### Project Metadata Enhancements
- [ ] Add `created_at` timestamp to projects
- [ ] Add `updated_at` timestamp (track last modification)
- [ ] Add `description` field for project notes
- [ ] Track `last_opened` for recent projects sorting
- [ ] Add project tags/categories
- [ ] Project statistics (total words, avg scene length, etc.)

