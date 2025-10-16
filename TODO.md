# TODO - Loke Cards MVP

## Phase 0: Project Setup & Infrastructure ✅ COMPLETED

### 0.1 Initial Project Structure ✅ DONE
- [x] Initialize npm/yarn project with package.json
- [x] Setup Vite with vanilla JS template
- [x] Configure Tailwind CSS
- [x] Install vite-plugin-pwa for PWA support
- [x] Install LocalForage for offline storage
- [x] Create basic folder structure (src/, public/, tests/)
- [x] Setup .gitignore for node_modules, dist, etc.

### 0.2 Git & Documentation Setup ✅ DONE
- [x] Initialize git repository
- [x] Create development branch (dev)
- [x] Create doc/ folder for documentation
- [x] Create CHANGELOG.md
- [x] Create TEST-PROOF.md
- [x] Create docs/api.json for API compatibility tracking
- [x] Initial commit on dev branch on org LokeGames with gh (its logget in)
- [x] Push to GitHub: https://github.com/LokeGames/loke-cards

### 0.3 Development Environment ✅ DONE
- [x] Configure Vite dev server
- [x] Setup hot module reloading
- [x] Configure build scripts in package.json
- [x] Test basic Vite + Tailwind setup works
- [x] Document build commands in README.md

SERVER: Setup server environment for tailscale server and https. the url is  https://loke.tail2d448.ts.net/cards DONE

## Phase 1: Core Architecture

### 1.1 PWA Foundation
- [ ] Create PWA manifest.json (app name, icons, theme)
- [ ] Configure Service Worker with Workbox
- [ ] Setup offline-first caching strategy
- [ ] Create install prompt handler
- [ ] Test PWA installation on mobile/desktop

### 1.2 Basic UI Structure
- [ ] Create main HTML layout (index.html)
- [ ] Setup navigation structure (header, sidebar, main content)
- [ ] Create CSS utility classes with Tailwind
- [ ] Implement responsive design foundation
- [ ] Create basic component structure (cards, forms, buttons)

### 1.3 State Management
- [ ] Design LocalForage schema for drafts
- [ ] Create state management utility (state.js)
- [ ] Implement draft save/load functions
- [ ] Implement auto-save functionality (debounced)
- [ ] Create sync status indicator (online/offline/syncing)

## Phase 2: Scene Card Editor

### 2.1 Text Editor Integration
- [ ] Research lightweight editor options (CodeMirror 6, Monaco, or custom)
- [ ] Install and configure chosen editor
- [ ] Create editor component wrapper
- [ ] Configure syntax highlighting (optional for scene text)
- [ ] Add editor toolbar (basic formatting if needed)
- [ ] Test editor performance and bundle size

### 2.2 Scene Form Components
- [ ] Create Scene ID input field with validation
- [ ] Create Chapter selector/dropdown
- [ ] Integrate text editor for Scene Text field
- [ ] Create dynamic Choices list component
  - [ ] Add choice button
  - [ ] Remove choice button
  - [ ] Choice text input
  - [ ] Next scene dropdown/autocomplete
  - [ ] Enabled checkbox per choice
- [ ] Create State Changes section
  - [ ] Add state change button
  - [ ] Variable input field
  - [ ] Operator selector (=, +=, -=, etc.)
  - [ ] Value input field
  - [ ] Remove state change button

### 2.3 Form Validation
- [ ] Validate Scene ID format (valid C function name)
- [ ] Validate required fields (Scene ID, Chapter, Scene Text)
- [ ] Validate scene references exist
- [ ] Show validation errors inline
- [ ] Disable save button when invalid
- [ ] Create validation utility functions

### 2.4 C Code Generator
- [ ] Create C code template system
- [ ] Implement scene function generator
- [ ] Implement choices code generation
- [ ] Implement state changes code generation
- [ ] Add proper C escaping for strings
- [ ] Create code preview component

### 2.5 Real-time Preview
- [ ] Create C code preview pane (toggle on/off)
- [ ] Implement live code generation on form change
- [ ] Add syntax highlighting for C code preview
- [ ] Add copy-to-clipboard button for generated code
- [ ] Toggle preview pane (show/hide)

## Phase 3: Chapter & Scene Management

### 3.1 Chapter Management
- [ ] Create chapter list view
- [ ] Create "New Chapter" form/modal
- [ ] Implement chapter creation
- [ ] Implement chapter selection/switching
- [ ] Store chapters in LocalForage
- [ ] Display active chapter in UI

### 3.2 Scene List View
- [ ] Create scene list component for current chapter
- [ ] Display scene cards in list (ID, preview text)
- [ ] Implement scene search/filter functionality
- [ ] Add "New Scene" button
- [ ] Implement scene click-to-edit
- [ ] Show scene count per chapter

### 3.3 Scene CRUD Operations
- [ ] Create new scene (blank form)
- [ ] Load existing scene into form
- [ ] Update existing scene
- [ ] Delete scene (with confirmation)
- [ ] Duplicate scene functionality
- [ ] Scene draft management (save locally before server sync)

## Phase 4: Server Integration

### 4.1 API Client Setup
- [ ] Create API client module (api.js)
- [ ] Configure API base URL from environment variable
- [ ] Implement fetch wrapper with error handling
- [ ] Add request/response logging (dev mode)
- [ ] Implement timeout handling
- [ ] Add retry logic for failed requests

### 4.2 API Endpoints Implementation
- [ ] POST /api/projects - Create project (if needed)
- [ ] GET /api/projects/:id - Get project metadata + scenes
- [ ] POST /api/projects/:id/chapters - Create chapter
- [ ] POST /api/projects/:id/chapters/:chapter/scenes - Create/update scene
- [ ] GET /api/projects/:id/chapters/:chapter/scenes/:scene - Get scene
- [ ] DELETE /api/projects/:id/chapters/:chapter/scenes/:scene - Delete scene
- [ ] POST /api/projects/:id/build - Trigger rebuild (optional)

### 4.3 Sync Logic
- [ ] Implement save-to-server function
- [ ] Handle online/offline detection
- [ ] Queue changes when offline
- [ ] Sync queued changes when back online
- [ ] Show sync status in UI (saved, syncing, error)
- [ ] Handle merge conflicts (last-write-wins for MVP)

### 4.4 Error Handling
- [ ] Display API error messages to user
- [ ] Implement retry mechanism for failed saves
- [ ] Fallback to local storage on server failure
- [ ] Show connection status indicator
- [ ] Log errors for debugging

## Phase 5: Testing & Quality

### 5.1 Unit Tests
- [ ] Test C code generation functions
- [ ] Test Scene ID validation
- [ ] Test state change parsing
- [ ] Test API request formatting
- [ ] Test LocalForage storage/retrieval
- [ ] Document test results in TEST-PROOF.md

### 5.2 Integration Tests
- [ ] Test full save workflow (form → API → verify)
- [ ] Test scene retrieval and editing
- [ ] Test chapter management
- [ ] Test offline mode functionality
- [ ] Test sync when coming back online
- [ ] Document test results in TEST-PROOF.md

### 5.3 Manual Testing
- [ ] Test on desktop browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile browsers (iOS Safari, Chrome Android)
- [ ] Test PWA installation
- [ ] Test offline functionality
- [ ] Test with slow network connection
- [ ] Document test results in TEST-PROOF.md

## Phase 6: UI/UX Polish

### 6.1 Visual Design
- [ ] Design color scheme and branding
- [ ] Create consistent button styles
- [ ] Add proper spacing and typography
- [ ] Create loading states for async operations
- [ ] Add animations/transitions (subtle)
- [ ] Ensure accessibility (ARIA labels, keyboard navigation)

### 6.2 User Feedback
- [ ] Toast notifications for save success/error
- [ ] Confirmation dialogs for destructive actions
- [ ] Loading spinners for API calls
- [ ] Autosave indicator
- [ ] Help text/tooltips for form fields

### 6.3 Mobile Optimization
- [ ] Optimize touch targets (minimum 44px)
- [ ] Improve mobile keyboard handling
- [ ] Test on small screens (responsive breakpoints)
- [ ] Optimize text editor for mobile
- [ ] Test PWA on mobile devices

## Phase 7: Documentation & Deployment

### 7.1 User Documentation
- [ ] Write user guide for loke-cards
- [ ] Document card creation workflow
- [ ] Document chapter management
- [ ] Add screenshots/examples
- [ ] Create quick start guide

### 7.2 Developer Documentation
- [ ] Document code architecture
- [ ] Comment complex functions
- [ ] Document API client usage
- [ ] Create CONTRIBUTING.md
- [ ] Document build and deployment process

### 7.3 Deployment Setup
- [ ] Create Dockerfile for containerization
- [ ] Test Docker build locally
- [ ] Create LXC provisioning scripts (if needed)
- [ ] Document deployment steps
- [ ] Create environment variable template (.env.example)
- [ ] Test deployment on Tailscale network

### 7.4 Release Preparation
- [ ] Update CHANGELOG.md with all changes
- [ ] Verify all tests pass
- [ ] Build production bundle
- [ ] Test production build
- [ ] Create release branch
- [ ] Merge to main with full documentation
- [ ] Tag release (v0.1.0)

## Phase 8: Future Enhancements (Post-MVP)

- [ ] Visual scene graph/flowchart
- [ ] Syntax highlighting in text preview
- [ ] Scene templates (combat, dialogue, exploration)
- [ ] State variable tracker across all scenes
- [ ] Bulk import/export functionality
- [ ] Version history integration with Git
- [ ] Validation for orphaned scenes
- [ ] AI-assisted writing suggestions

---

## Notes

- Work tasks **sequentially** - complete each task before moving to next
- Mark tasks as DONE/COMPLETED when finished
- Test and build after each phase
- Commit and push frequently to dev branch
- Document all tests in TEST-PROOF.md
- Log all changes in CHANGELOG.md
- NEVER develop in main branch
- Maintain docs/api.json for API compatibility

## Current Phase: Phase 0 - Project Setup & Infrastructure
