/**
 * Layout Component
 * Main application layout structure
 */

import { createNavigation } from './Navigation.js';
import { createSidebar, setupSidebarToggle } from './Sidebar.js';

export function createLayout() {
  const app = document.getElementById('app');
  if (!app) return;

  // Clear existing content
  app.innerHTML = '';

  // Create navigation
  const nav = createNavigation();
  app.appendChild(nav);

  // Create wrapper for responsive layout
  const wrapper = document.createElement('div');
  wrapper.className = 'flex min-h-screen bg-gray-50';
  wrapper.id = 'layout-wrapper';

  // Create main content area (responsive width based on sidebar)
  const main = document.createElement('main');
  // Always reserve space for sidebar on desktop (md breakpoint and up)
  main.className = 'flex-1 w-full md:w-auto md:max-w-none px-4 py-6 md:mr-80';
  main.id = 'main-content';
  wrapper.appendChild(main);

  // Create sidebar
  const sidebar = createSidebar();

  // Mobile overlay
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 hidden lg:hidden';

  app.appendChild(wrapper);
  app.appendChild(sidebar);
  app.appendChild(overlay);

  // Setup sidebar toggle functionality
  setupSidebarToggle();

  return { nav, main, sidebar };
}

export function setMainContent(content) {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (typeof content === 'string') {
    main.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    main.innerHTML = '';
    main.appendChild(content);
  }
}
