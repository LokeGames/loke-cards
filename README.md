# Loke Cards

> Migration note: The project is being ported from Vue to SvelteKit. The new app lives in `cards/` and is the active target for development, build, and tests. Legacy Vue folders (`cards-vue`, `graph-vue`, `shared-vue`) are archived artifacts and excluded from the toolchain until the port is complete.

**Progressive Web App (PWA) for authoring interactive fiction content in loke-engine format.**

Loke Cards provides simple form-based "cards" for writing scenes and chapters directly in C format, which are then saved to a loke-engine server.

## Quick Start (Svelte)

```bash
# Install dependencies (root workspaces)
npm install

# Start Svelte app (SvelteKit on 5173)
npm run dev

# Build/Preview Svelte app
npm run build
npm run preview
```

## Production URL

**https://loke.tail2d448.ts.net:8443/** (Installed in macOS dock)

Default dev server (Svelte): **http://127.0.0.1:5173**.

### Running legacy Vue apps (optional)
- Cards (Vue): `npm install -C cards-vue && npm run dev -C cards-vue`
- Graph (Vue): `npx vite --config graph-vue/vite.config.js`
Legacy apps are not part of the active toolchain and are kept read‑only during the port.

## Project Structure

```
loke-cards/
├── src/
│   ├── components/      # UI components
│   ├── lib/             # Utilities and libraries
│   ├── styles/          # CSS files
│   └── main.js          # Application entry point
├── public/
│   ├── icons/           # PWA icons
│   └── assets/          # Static assets
├── doc/
│   ├── CHANGELOG.md     # Project changelog
│   └── TEST-PROOF.md    # Test documentation
├── tests/               # Test files
├── index.html           # Main HTML file
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── package.json         # Project dependencies
```

## Technology Stack

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No framework overhead
- **Tailwind CSS** - Utility-first CSS framework
- **LocalForage** - Offline storage (IndexedDB/localStorage)
- **PWA** - Progressive Web App with Service Worker
- **Workbox** - Service Worker management

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

```
# Terminal 1: run app + backend (fixed 8081)
npm run dev:full:watch

# Terminal 2: run the single test
npm test tests/navigation-stability.spec.js
```

Option B — let Playwright manage the server:

```
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

Designed for **LXC containers** on **Tailscale network**:

```bash
# Build container
docker build -t loke-cards:latest .

# Run container
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
2. Build backend: `cd /opt/loke-cards/server && make`
3. Install unit: `sudo cp /opt/loke-cards/server/systemd/loke-cards-backend.service /etc/systemd/system/`
4. Reload units: `sudo systemctl daemon-reload`
5. Enable + start: `sudo systemctl enable --now loke-cards-backend`
6. Check logs: `journalctl -u loke-cards-backend -f`

Set `CORS_ALLOW_ORIGIN` in the unit file to match your frontend origin.

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
