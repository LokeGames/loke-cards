# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Loke Cards** is a Progressive Web App (PWA) for authoring interactive fiction content in loke-engine format. It provides simple form-based "cards" for writing scenes and chapters directly in C format, which are then saved to a loke-engine server.

**Use Case**: Distributed authoring via Tailscale network - each project gets its own loke-cards instance running in an LXC container.

**Key Constraint**: Writes directly to loke-engine C format (`.c` files in project/chapter/scene structure).

## Language and Communication

- **User communication**: Danish
- **Code, variables, functions**: English
- **Documentation and comments**: English

## Development Workflow

This project follows **TDD (Test-Driven Development)**:

1. Code small, testable units
2. Test with build/compile/test commands
3. Refactor with respect for existing code
4. Iterate until robust and fulfilling requirements

### Critical Process Rules

- **Source of truth**: `TODO.md` - work tasks **sequentially**
- **Track changes**: Log all completed/tested changes to `CHANGELOG.md`
- **Document tests**: Add test proofs to `TEST-PROOF.md` when phases complete
- **Check before starting**: Review `doc/`, `TODO.md`, `TEST-PROOF.md`, and `CHANGELOG.md`
- **Mark tasks done**: Update `TODO.md` as tasks are completed (use DONE/COMPLETED markers)
- **Git workflow**:
  - NEVER develop in main branch
  - Commit and push frequently
  - Before release: commit to main with full manual
- **Manual requirements**: All releases must include fully edited manual in framework and tarball/deb package
- **API compatibility**: Maintain `docs/api.json` with functions, versions, deprecations for backwards compatibility until v1

## Architecture

### Content Structure

Loke Cards creates content that maps to loke-engine project structure:

```
/project_name/              # Root project
├── chapter01/              # Chapter (folder)
│   ├── scene01.c          # Scene/section (file)
│   ├── scene02.c
│   └── scene03.c
├── chapter02/
│   ├── scene01.c
│   └── scene02.c
└── metadata.json          # Project metadata
```

### Card Types

Each card corresponds to a loke-engine scene function:

**Scene Card** → `.c` file with scene function:

```c
#include <loke/scene.h>

void scene_forest_entrance(GameState* state) {
    SceneContext* ctx = get_current_context();

    scene_set_text(ctx, "You stand at the forest entrance.\n");
    scene_add_option(ctx, "Enter forest", scene_forest_path, true);
    scene_add_option(ctx, "Return to village", scene_village, true);
}
```

### Form Fields per Card

1. **Scene ID** (function name): `scene_forest_entrance`
2. **Chapter**: Select from existing or create new
3. **Scene Text**: Multi-line textarea for description
4. **Choices**: Dynamic list of options
   - Choice text: "Enter forest"
   - Next scene: Dropdown/autocomplete of existing scenes
   - Enabled: Boolean (conditional logic placeholder)
5. **State Changes**: Optional modifications
   - `state->health += 10`
   - `state->has_key = true`
   - `state->gold -= 50`

### Server Integration

**Save Workflow**:

1. User fills out card form
2. PWA generates C code from form data
3. POST to loke-engine server API endpoint
4. Server writes `.c` file to correct project/chapter directory
5. Server optionally triggers rebuild of project

**API Endpoints** (to be implemented on loke-engine side):

- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project metadata + scene list
- `POST /api/projects/:id/chapters` - Create new chapter
- `POST /api/projects/:id/chapters/:chapter/scenes` - Create/update scene
- `GET /api/projects/:id/chapters/:chapter/scenes/:scene` - Get scene source
- `DELETE /api/projects/:id/chapters/:chapter/scenes/:scene` - Delete scene
- `POST /api/projects/:id/build` - Trigger project rebuild

## Technology Stack

### Frontend (PWA)

- **Framework**: TBD (Vue.js, React, Svelte, or vanilla JS)
- **UI Library**: TBD (Tailwind CSS, Bootstrap, or custom)
- **PWA**: Service Worker for offline support
- **Storage**: LocalStorage for draft cards, sync to server when online
- **Code Generation**: Template engine for C code generation

### Backend Requirements

- **Server**: Loke-engine instance with REST API (to be implemented)
- **Authentication**: Tailscale network-based (trusted network)
- **File System**: Direct write access to loke-engine project directories
- **Build Integration**: Optional automatic rebuild after changes

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│ Tailscale Network (Private)                        │
│                                                      │
│  ┌──────────────┐      ┌──────────────────────┐   │
│  │ LXC Container│      │ LXC Container        │   │
│  │              │      │                      │   │
│  │ loke-cards   │◄────►│ loke-engine         │   │
│  │ PWA          │ HTTP │ + REST API          │   │
│  │ (port 8080)  │      │ (port 3000)         │   │
│  │              │      │                      │   │
│  │ Project: A   │      │ /projects/A/        │   │
│  └──────────────┘      └──────────────────────┘   │
│                                                      │
│  ┌──────────────┐      ┌──────────────────────┐   │
│  │ LXC Container│      │ LXC Container        │   │
│  │              │      │                      │   │
│  │ loke-cards   │◄────►│ loke-engine         │   │
│  │ PWA          │      │ + REST API          │   │
│  │              │      │                      │   │
│  │ Project: B   │      │ /projects/B/        │   │
│  └──────────────┘      └──────────────────────┘   │
│                                                      │
│  Each project gets its own isolated loke-cards     │
│  instance paired with its own loke-engine instance │
└─────────────────────────────────────────────────────┘
```

## Build Commands

### Development Server

```bash
# Install dependencies
npm install
# or
yarn install

# Run development server
npm run dev
# or
yarn dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker/LXC Deployment

```bash
# Build container image
docker build -t loke-cards:latest .

# Run container
docker run -d \
  -p 8080:8080 \
  -e LOKE_ENGINE_API=http://loke-engine:3000 \
  --name loke-cards-project-a \
  loke-cards:latest

# LXC container setup (if using LXC instead of Docker)
# TBD - container provisioning scripts
```

## Development Tasks

### MVP Features (Phase 1)

1. **Scene Card Editor**
   - Form with all scene fields
   - Real-time C code preview
   - Validation (scene ID, required fields)
   - Save to localStorage as draft

2. **Chapter Management**
   - Create new chapters
   - List existing chapters
   - Navigate between chapters

3. **Scene List View**
   - Show all scenes in current chapter
   - Filter/search scenes
   - Click to edit

4. **Server Integration**
   - POST scene data to loke-engine API
   - Handle success/error responses
   - Show save status

5. **PWA Setup**
   - Service Worker for offline capability
   - App manifest
   - Install prompt

### Future Enhancements (Phase 2+)

- **Visual Scene Graph**: Flow diagram of scene connections
- **Syntax Highlighting**: C code preview with syntax colors
- **Templates**: Pre-built scene templates (combat, dialogue, exploration)
- **State Variable Tracker**: Visual list of all state variables used across scenes
- **Bulk Operations**: Import/export multiple scenes
- **Collaboration**: Multi-user editing with conflict resolution
- **Version History**: Git integration for scene history
- **Validation**: Check for orphaned scenes, unreachable choices

## Loke-Engine Format Reference

### Scene Function Template

```c
#include <loke/scene.h>

void scene_{{SCENE_ID}}(GameState* state) {
    SceneContext* ctx = get_current_context();

    // Scene description
    scene_set_text(ctx, "{{SCENE_TEXT}}\n");

    // Choices
    {{#each CHOICES}}
    scene_add_option(ctx, "{{this.text}}", {{this.next_scene}}, {{this.enabled}});
    {{/each}}

    // State modifications
    {{#each STATE_CHANGES}}
    state->{{this.variable}} {{this.operator}} {{this.value}};
    {{/each}}
}
```

### GameState Structure

```c
typedef struct {
    // Basic stats
    int health;
    int gold;
    int karma;

    // Common item flags
    bool has_key;
    bool has_sword;
    bool has_map;

    // Custom flags (use for anything)
    bool custom_flags[32];
} GameState;
```

### Scene Header Template

```c
#ifndef {{CHAPTER_ID_UPPER}}_H
#define {{CHAPTER_ID_UPPER}}_H

#include <loke/scene.h>

{{#each SCENES}}
void {{this.function_name}}(GameState* state);
{{/each}}

#endif // {{CHAPTER_ID_UPPER}}_H
```

## API Design (loke-engine server side)

### Request/Response Examples

**Create Scene**:

```http
POST /api/projects/my-adventure/chapters/chapter01/scenes
Content-Type: application/json

{
  "scene_id": "scene_forest_entrance",
  "scene_text": "You stand at the forest entrance.",
  "choices": [
    {
      "text": "Enter forest",
      "next_scene": "scene_forest_path",
      "enabled": true
    },
    {
      "text": "Return to village",
      "next_scene": "scene_village",
      "enabled": true
    }
  ],
  "state_changes": [
    {
      "variable": "health",
      "operator": "+=",
      "value": 10
    }
  ]
}
```

**Response**:

```json
{
  "success": true,
  "file_path": "/projects/my-adventure/chapter01/forest_entrance.c",
  "scene_id": "scene_forest_entrance",
  "message": "Scene created successfully"
}
```

## Security Considerations

- **Tailscale only**: No public internet access
- **No authentication**: Trust network layer (Tailscale)
- **Input validation**: Sanitize scene IDs, prevent code injection
- **File path validation**: Prevent directory traversal attacks
- **Rate limiting**: Prevent abuse even on trusted network

## Configuration

### Environment Variables

```bash
# loke-cards PWA
VITE_LOKE_ENGINE_API=http://loke-engine:3000  # Backend API URL
VITE_PROJECT_NAME=my-adventure                 # Project name (optional)

# loke-engine server (when API is implemented)
LOKE_PROJECTS_DIR=/home/loke/projects         # Root directory for projects
LOKE_AUTO_BUILD=true                           # Auto-rebuild on save
LOKE_ALLOWED_ORIGINS=http://loke-cards:8080   # CORS origins
```

## Testing Strategy

### Unit Tests

- C code generation from form data
- Scene ID validation
- State change parsing
- API request formatting

### Integration Tests

- Full save workflow (form → API → file system)
- Scene retrieval and editing
- Chapter management
- Error handling

### E2E Tests

- Complete authoring workflow
- Offline mode (PWA)
- Multi-device sync via server

## Known Limitations

- **No Git integration**: Direct file writes (consider adding git commits later)
- **Single project per instance**: No multi-project support in MVP
- **No real-time collaboration**: Last write wins (consider OT/CRDT later)
- **Limited validation**: Basic syntax checking only (no full C compilation check)

## Related Documentation

- **loke-engine**: `/home/ubuntu/loke-engine/` - Framework this generates content for
- **loke-docs**: `/home/ubuntu/loke-docs/` - Shared documentation
- **Scene API**: See loke-engine `include/loke/scene.h` for complete API reference

## Future Integration

### Potential Features

1. **AI-Assisted Writing**: Generate scene descriptions and choices using local LLM (cppnn integration?)
2. **Narrative Linting**: Check for plot holes, unreachable scenes, unbalanced choices
3. **Playtesting Mode**: Test scenes directly in the editor without full build
4. **Analytics**: Track which scenes are most edited, completion rates
5. **Export**: Generate standalone game bundle from cards

## Development Checklist

- [ ] Choose frontend framework (Vue.js recommended for simplicity)
- [ ] Design card form UI/UX
- [ ] Implement C code generator
- [ ] Create PWA manifest and service worker
- [ ] Design REST API for loke-engine backend
- [ ] Implement loke-engine API endpoints
- [ ] Test Tailscale network communication
- [ ] Create Docker/LXC container setup
- [ ] Write deployment documentation
- [ ] Create example project with sample cards
- game-format se @doc/LOKE-FORMAT-REFERENCE.md
- all dev is TDD before uder presentation it is vital