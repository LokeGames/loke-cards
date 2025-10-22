# TODO-PORTING: Vue to Svelte Migration Tasks

This document outlines all the tasks needed to port the complete Vue functionality from `cards-vue/` to the Svelte implementation in `/apps`. Each task includes expectations and benefits for the migration.

## Phase 1: Foundation & Setup

### [x] Make cards-vue Runnable

**Expectations:**

- Install dependencies and resolve any build errors
- Get the Vue app running on a local dev server
- Verify all Vue components are functional
  **Benefits:**
- Provides a complete working reference for all features
- Allows side-by-side comparison during development
- Accelerates porting decisions by showing exact behavior

---

## Phase 2: Dashboard Implementation

### [ ] Create Dashboard Component Structure

**Expectations:**

- Create `apps/front/src/lib/components/dashboard/` directory
- Set up base dashboard layout component
- Implement responsive grid system matching Vue design
  **Benefits:**
- Establishes the main entry point for users
- Provides project overview and quick access to all features

### [ ] Implement Quick Actions Section

**Expectations:**

- Create `QuickActions.svelte` with "New Scene" and "New Chapter" buttons
- Style to match Vue card-based design with hover states
- Connect to existing routes or create new ones
  **Benefits:**
- Improves user workflow by providing fast access to common tasks
- Reduces navigation friction for content creation

### [ ] Implement Project Stats Section

**Expectations:**

- Create `ProjectStats.svelte` showing total chapters and scenes count
- Fetch data from the data worker via RPC calls
- Display in grid layout with proper styling
  **Benefits:**
- Gives users immediate project scope understanding
- Helps with project management and progress tracking

### [ ] Implement Recent Chapters List

**Expectations:**

- Create `RecentChapters.svelte` component
- Fetch and display recently modified chapters
- Include links to edit each chapter
  **Benefits:**
- Enables quick access to recently worked on content
- Improves navigation efficiency for ongoing projects

### [ ] Implement Recent Scenes List

**Expectations:**

- Create `RecentScenes.svelte` component
- Fetch and display recently modified scenes
- Include chapter context and edit links
  **Benefits:**
- Provides quick access to recent scene work
- Helps users maintain context across editing sessions

### [ ] Integrate Dashboard into Main Route

**Expectations:**

- Replace placeholder content in `apps/front/src/routes/+page.svelte`
- Import and use all dashboard components
- Ensure proper data loading and error handling
  **Benefits:**
- Completes the main entry point experience
- Establishes the app's primary navigation hub

---

## Phase 3: Scene Management Enhancement

### [ ] Enhance Scene List View

**Expectations:**

- Upgrade `apps/front/src/routes/cards/scenes/+page.svelte`
- Add search functionality with real-time filtering
- Implement sorting options (by title, chapter, modified date)
- Add delete functionality with confirmation
- Style to match Vue design with proper spacing and interactions
  **Benefits:**
- Provides comprehensive scene management capabilities
- Improves content discoverability and organization

### [ ] Create Scene Edit Routes

**Expectations:**

- Create `apps/front/src/routes/scene/[id]/+page.svelte`
- Implement proper scene loading from data worker
- Handle scene not found states
- Add breadcrumb navigation
  **Benefits:**
- Enables direct scene editing from any context
- Provides proper navigation structure for scene workflow

### [ ] Integrate SceneEditorView Properly

**Expectations:**

- Ensure `apps/cards/src/components/SceneEditorView.svelte` is fully integrated
- Connect all form fields to data worker RPC calls
- Implement proper save/cancel functionality
- Add loading states and error handling
  **Benefits:**
- Completes the core scene editing functionality
- Ensures data consistency across the application

### [ ] Implement Scene Deletion

**Expectations:**

- Add delete functionality to scene list and editor
- Implement confirmation dialog
- Handle cascade deletion of scene references
- Update data worker to support scene deletion
  **Benefits:**
- Provides complete CRUD operations for scenes
- Prevents orphaned data and maintains data integrity

---

## Phase 4: Chapter Management Enhancement

### [ ] Create Chapter List View

**Expectations:**

- Create `apps/front/src/routes/chapters/+page.svelte` with full list functionality
- Implement drag-and-drop reordering
- Add move up/down buttons as alternative
- Include edit/delete actions for each chapter
- Show scene count per chapter
  **Benefits:**
- Provides comprehensive chapter organization capabilities
- Enables flexible content structure management

### [ ] Create Chapter Edit Routes

**Expectations:**

- Create `apps/front/src/routes/chapter/[id]/+page.svelte`
- Implement full chapter editing with ID validation
- Add meta field support
- Include proper validation and error handling
  **Benefits:**
- Enables complete chapter lifecycle management
- Ensures data consistency and proper validation

### [ ] Enhance Chapter Creation Form

**Expectations:**

- Upgrade `ChapterManager.svelte` to match Vue functionality
- Add ID validation with real-time feedback
- Include meta field and additional properties
- Implement proper form validation
  **Benefits:**
- Provides comprehensive chapter creation experience
- Reduces data entry errors and improves data quality

### [ ] Implement "New Scene per Chapter" Feature

**Expectations:**

- Add "New Scene" button to each chapter in list view
- Pre-populate scene form with chapter selection
- Streamline scene creation workflow
  **Benefits:**
- Improves content creation efficiency
- Reduces navigation steps for common workflows

---

## Phase 5: Table of Contents (TOC) Implementation

### [ ] Create TOC Component Structure

**Expectations:**

- Create `apps/front/src/lib/components/toc/` directory
- Implement `BookToc.svelte` as main TOC component
- Set up responsive grid layout matching Vue design
  **Benefits:**
- Provides comprehensive project navigation overview
- Enables quick access to any part of the project

### [ ] Implement TOC Search and Filter

**Expectations:**

- Add search functionality for chapters and scenes
- Implement chapter filtering capabilities
- Provide real-time search results
- Style to match Vue design with proper visual feedback
  **Benefits:**
- Improves content discoverability in large projects
- Enables quick navigation to specific content

### [ ] Implement Chapter Grouping with Scene Lanes

**Expectations:**

- Group scenes under their respective chapters
- Create visual lanes for each chapter's scenes
- Implement proper spacing and visual hierarchy
- Add scene count indicators per chapter
  **Benefits:**
- Provides clear project structure visualization
- Helps users understand content organization

### [ ] Implement TOC Row Components

**Expectations:**

- Create `TocRow.svelte` components for chapters and scenes
- Add color coding for different content types
- Implement click-to-edit navigation
- Include hover states and proper interactions
  **Benefits:**
- Provides intuitive navigation interface
- Improves user experience with visual feedback

### [ ] Integrate TOC into Route

**Expectations:**

- Replace placeholder in `apps/front/src/routes/toc/+page.svelte`
- Connect to data worker for real-time data
- Implement proper loading and error states
  **Benefits:**
- Completes the navigation overview functionality
- Provides essential project management tool

---

## Phase 6: Form Validation & Error Handling

### [ ] Create Validation Composables

**Expectations:**

- Create `apps/front/src/lib/composables/useSceneValidation.ts`
- Create `apps/front/src/lib/composables/useChapterValidation.ts`
- Implement real-time validation logic
- Provide field-specific error messages
  **Benefits:**
- Ensures data quality and consistency
- Improves user experience with immediate feedback

### [ ] Implement Toast Notification System

**Expectations:**

- Create `apps/front/src/lib/components/Toast.svelte`
- Implement toast store for managing notifications
- Add success, error, and warning variants
- Include auto-dismiss functionality
  **Benefits:**
- Provides consistent user feedback system
- Improves user experience with clear communication

### [ ] Add Error Boundaries

**Expectations:**

- Implement error boundaries for route components
- Add graceful error handling for data worker failures
- Provide user-friendly error messages
- Include recovery options where possible
  **Benefits:**
- Prevents app crashes from affecting user experience
- Provides better debugging and user support

---

## Phase 7: Navigation & Routing Enhancement

### [ ] Implement Breadcrumbs Navigation

**Expectations:**

- Create `apps/front/src/lib/components/Breadcrumbs.svelte`
- Add breadcrumbs to all relevant routes
- Implement proper navigation hierarchy
- Include current page context
  **Benefits:**
- Improves navigation orientation
- Helps users understand their location in the app

### [ ] Enhance Sidebar Navigation

**Expectations:**

- Update `apps/front/src/lib/components/AppSidebar.svelte`
- Ensure all links work properly
- Add active state indicators
- Include quick actions matching Vue implementation
  **Benefits:**
- Provides consistent navigation experience
- Improves app usability and discoverability

### [ ] Implement Route Guards

**Expectations:**

- Add route guards for project scoping
- Implement proper authentication checks if needed
- Handle unauthorized access gracefully
- Add meta titles and scroll behavior
  **Benefits:**
- Ensures proper access control
- Improves SEO and user experience

### [ ] Unify Routing Structure

**Expectations:**

- Consolidate fragmented routes between front and cards apps
- Create consistent routing patterns
- Implement proper redirects where needed
- Ensure all routes follow the same conventions
  **Benefits:**
- Simplifies navigation structure
- Reduces maintenance complexity

---

## Phase 8: Data Management Enhancement

### [ ] Implement Offline-First Strategy

**Expectations:**

- Enhance data worker with offline capabilities
- Implement LocalForage fallback for browser storage
- Add sync conflict resolution
- Provide offline status indicators
  **Benefits:**
- Enables working without internet connection
- Improves app reliability and performance

### [ ] Add Live Updates

**Expectations:**

- Implement event system for data changes
- Update UI components to react to data changes
- Add real-time collaboration features if needed
- Ensure data consistency across components
  **Benefits:**
- Provides responsive user experience
- Enables real-time data synchronization

### [ ] Enhance Data Worker API

**Expectations:**

- Add missing CRUD operations for all data types
- Implement proper error handling in worker
- Add data validation in worker layer
- Include proper TypeScript types
  **Benefits:**
- Ensures data integrity and consistency
- Provides robust data management foundation

---

## Phase 9: Responsive Design & Mobile Optimization

### [ ] Implement Mobile-First Design

**Expectations:**

- Review all components for mobile responsiveness
- Add proper breakpoints for different screen sizes
- Implement touch-friendly controls
- Add collapsible sections for mobile
  **Benefits:**
- Ensures app works on all devices
- Improves mobile user experience

### [ ] Add Mobile Navigation Patterns

**Expectations:**

- Implement mobile-optimized sidebar
- Add mobile-specific navigation patterns
- Ensure all interactions work on touch devices
- Add proper mobile gestures where appropriate
  **Benefits:**
- Provides complete mobile experience
- Expands app usability across devices

---

## Phase 10: Testing & Documentation

### [ ] Add Unit Tests for All Components

**Expectations:**

- Create comprehensive unit tests for all new components
- Test validation logic and error handling
- Ensure proper test coverage for critical paths
- Add integration tests for data worker interactions
  **Benefits:**
- Ensures code quality and reliability
- Prevents regressions during development

### [ ] Add E2E Tests for User Workflows

**Expectations:**

- Create Playwright tests for all major user workflows
- Test dashboard functionality
- Verify scene and chapter CRUD operations
- Test navigation and responsive design
  **Benefits:**
- Ensures complete user experience works correctly
- Provides confidence in deployment

### [ ] Update Documentation

**Expectations:**

- Update AGENTS.md with new patterns and conventions
- Document component architecture and data flow
- Add API documentation for data worker
- Update CHANGELOG.md with migration progress
  **Benefits:**
- Maintains project documentation quality
- Helps future development and maintenance

---

## Success Criteria

The migration is considered complete when:

1. **Parity Achieved:** All Vue functionality is available in Svelte version
2. **User Experience Consistent:** Navigation, interactions, and workflows match Vue version
3. **Data Integrity:** All CRUD operations work correctly with proper validation
4. **Responsive Design:** App works seamlessly on all device sizes
5. **Performance:** App loads and performs as well or better than Vue version
6. **Testing Coverage:** All critical functionality has proper test coverage

## Estimated Timeline

- **Phase 1-2 (Foundation & Dashboard):** 1-2 weeks
- **Phase 3-4 (CRUD Enhancement):** 2-3 weeks
- **Phase 5 (TOC Implementation):** 1-2 weeks
- **Phase 6-7 (Validation & Navigation):** 1-2 weeks
- **Phase 8-9 (Data & Mobile):** 2-3 weeks
- **Phase 10 (Testing & Docs):** 1 week

**Total Estimated Time:** 8-13 weeks depending on team size and complexity

## Priority Order

1. **High Priority:** Phases 1-4 (Core functionality)
2. **Medium Priority:** Phases 5-7 (Navigation and validation)
3. **Lower Priority:** Phases 8-10 (Enhancements and polish)

This prioritization ensures that users have a functional application early, with enhancements added incrementally.
