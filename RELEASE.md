# Loke Cards v0.1.0 - Release Notes

## MVP Release: Single Project Database Architecture

This is the first MVP release of **Loke Cards**, a Progressive Web App for authoring interactive fiction content in loke-engine format.

**Release Date**: October 23, 2025
**Version**: 0.1.0
**Key Principle**: One SQLite database = One project

---

## What's New

### Core Features
- ✅ **Scene Management** - Create, edit, and organize scenes with choices and state changes
- ✅ **Chapter Management** - Organize content into chapters
- ✅ **State Variables** - Type-safe state management with global/chapter scope
- ✅ **Table of Contents** - Visual project structure overview
- ✅ **SQLite Backend** - Project data stored in portable SQLite database files

### Technical Stack
- **Backend**: C++ server with SQLite3
- **Frontend**: SvelteKit 2.0 + Svelte 5 + TypeScript
- **Database**: SQLite 3 with JSON blob storage
- **API**: RESTful HTTP API

---

## Installation

### Prerequisites

- **Node.js** 18+ and pnpm
- **C++ compiler** (g++ or clang)
- **SQLite3** development libraries
- **Git**

#### Install Dependencies (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install build-essential libsqlite3-dev git nodejs npm
npm install -g pnpm
```

#### Install Dependencies (macOS)
```bash
brew install sqlite3
brew install node
npm install -g pnpm
```

---

## Clone and Setup

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/loke-cards.git
cd loke-cards
git checkout v0.1.0
```

### 2. Install Frontend Dependencies
```bash
pnpm install
```

### 3. Build Backend Server
```bash
cd server
make clean
make
```

This will compile the C++ backend server with SQLite support.

---

## Running Loke Cards

### Start Backend Server
```bash
cd server
./server
```

Server will start on `http://localhost:3000`

### Start Frontend (Development Mode)
In a new terminal:
```bash
cd /path/to/loke-cards
pnpm run dev:front
```

Frontend will start on `http://localhost:5173`

### Start Frontend (Production Mode)
```bash
pnpm run build
pnpm run preview
```

---

## Project Structure

```
loke-cards/
├── server/                 # C++ backend server
│   ├── main.cpp           # Server entry point
│   ├── dev.db             # SQLite database (created on first run)
│   ├── Makefile           # Build configuration
│   └── include/           # Header files
├── apps/
│   ├── cards/             # Cards business logic (shared)
│   ├── front/             # SvelteKit frontend app
│   └── shared/            # Shared types and utilities
├── packages/
│   └── ui/                # Shared UI components
└── RELEASE.md             # This file
```

---

## Using Loke Cards

### Quick Start

1. **Open browser**: Navigate to `http://localhost:5173`
2. **Create a chapter**: Go to Chapters → New Chapter
3. **Create a scene**: Go to Scenes → New Scene
4. **Add states**: Go to States → New State (optional)
5. **View structure**: Check Table of Contents

### Creating Content

#### Scenes
- Navigate to **Scenes** → **+ New Scene**
- Fill in:
  - Title (human-readable name)
  - Scene ID (C identifier, e.g., `forest_entrance`)
  - Chapter (select from dropdown)
  - Scene Text (narrative description)
  - Choices (player options with next scene links)
  - State Changes (modify game state when scene is entered)

#### Chapters
- Navigate to **Chapters** → **+ New Chapter**
- Fill in:
  - Chapter ID (e.g., `chapter01`)
  - Title (e.g., "The Beginning")
  - Description (optional)

#### State Variables
- Navigate to **States** → **+ New State**
- Fill in:
  - Name (e.g., "Health", "Gold", "Has Key")
  - Type (number, boolean, or string)
  - Scope (global or chapter-specific)
  - Default Value

---

## Database File

### Location
The project database is stored at:
```
server/dev.db
```

### Sharing Projects
To share your project with others:
1. Copy `server/dev.db` to another location
2. Send the file to collaborators
3. They place it in their `server/` directory
4. Restart the backend server

### Backup
```bash
cp server/dev.db server/backup-$(date +%Y%m%d).db
```

---

## API Reference

### Endpoints

#### Health Check
```
GET /api/health
```

#### Scenes
```
GET    /api/scenes           # List all scenes
GET    /api/scenes/:id       # Get scene by ID
POST   /api/scenes           # Create scene
PUT    /api/scenes/:id       # Update scene
DELETE /api/scenes/:id       # Delete scene
```

#### Chapters
```
GET    /api/chapters         # List all chapters
GET    /api/chapters/:id     # Get chapter by ID
POST   /api/chapters         # Create chapter
PUT    /api/chapters/:id     # Update chapter
DELETE /api/chapters/:id     # Delete chapter
```

#### States
```
GET    /api/states           # List all states
GET    /api/states/:id       # Get state by ID
POST   /api/states           # Create state
PUT    /api/states/:id       # Update state
DELETE /api/states/:id       # Delete state
```

---

## Troubleshooting

### Backend won't start
- Check if SQLite3 is installed: `sqlite3 --version`
- Check if port 3000 is available: `lsof -i :3000`
- Check server logs for errors

### Frontend can't connect to backend
- Ensure backend is running on `http://localhost:3000`
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` in environment

### Database file missing
- The server creates `dev.db` automatically on first run
- Check file permissions in `server/` directory

### Build errors
- Run `make clean && make` to rebuild backend
- Run `pnpm install` to reinstall frontend dependencies
- Check that all prerequisites are installed

---

## Development

### Backend Development
```bash
cd server
make clean
make
./server
```

### Frontend Development
```bash
pnpm run dev:front
```

### Running Tests
```bash
pnpm run test
```

---

## Known Limitations

- **Single Project**: Only one project per database file
- **No Authentication**: Designed for local/Tailscale network use
- **No Real-time Collaboration**: Last write wins
- **Basic Validation**: Limited C code compilation checks

---

## Roadmap (v0.2.0+)

- Multi-project support (project selector)
- Project templates
- Import/export functionality
- Enhanced validation
- Visual scene graph editor
- Syntax highlighting for generated code

---

## Support

- **Issues**: https://github.com/yourusername/loke-cards/issues
- **Docs**: See `CLAUDE.md` and `README.md`
- **Changelog**: See `CHANGELOG.md`

---

## License

See LICENSE file for details.

---

## Credits

Built with:
- [SvelteKit](https://kit.svelte.dev/)
- [SQLite](https://www.sqlite.org/)
- [cpp-httplib](https://github.com/yhirose/cpp-httplib)
- [Lucide Icons](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Happy authoring! 🎮📖**
