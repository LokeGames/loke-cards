/**
 * Layout Component
 * Main application layout structure
 */

import { createNavigation } from './Navigation.js';
import { createSceneEditor } from './SceneEditor.js';

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
  main.className = 'flex-1 w-full lg:w-auto lg:max-w-none px-4 py-6 lg:mr-80';
  main.id = 'main-content';
  wrapper.appendChild(main);

  // Create sidebar (fixed on desktop, drawer on mobile)
  const sidebar = document.createElement('aside');
  sidebar.className = `
    fixed top-16 right-0 h-[calc(100vh-4rem)] w-80
    bg-white border-l border-gray-200 shadow-xl
    transform translate-x-full lg:translate-x-0
    transition-transform duration-300 ease-in-out
    z-40 overflow-y-auto
  `.replace(/\s+/g, ' ').trim();
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `
    <!-- Mobile close button -->
    <button id="sidebar-close" class="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <div class="p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
      <div class="space-y-3">
        <button id="btn-new-scene" class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 touch-manipulation">
          <span class="text-xl">➕</span>
          <span>New Scene</span>
        </button>
        <button id="btn-new-chapter" class="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center justify-center gap-2 touch-manipulation">
          <span class="text-xl">📚</span>
          <span>New Chapter</span>
        </button>
      </div>

      <div class="mt-8 pt-6 border-t border-gray-200">
        <h3 class="text-sm font-semibold text-gray-600 mb-3">Current Project</h3>
        <div id="project-info" class="space-y-2 text-sm text-gray-700">
          <div class="flex items-center gap-2">
            <span class="text-lg">📁</span>
            <span id="project-name" class="font-medium">Loading...</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg">📝</span>
            <span><span id="scene-count" class="font-semibold">0</span> scenes</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg">📚</span>
            <span><span id="chapter-count" class="font-semibold">0</span> chapters</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Mobile overlay
  const overlay = document.createElement('div');
  overlay.id = 'sidebar-overlay';
  overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 hidden lg:hidden';

  app.appendChild(wrapper);
  app.appendChild(sidebar);
  app.appendChild(overlay);

  // Add event listeners
  sidebar.querySelector('#btn-new-scene').addEventListener('click', async () => {
    await createSceneEditor();
  });

  // Add event listeners for mobile sidebar
  setupSidebarToggle();

  return { nav, main, sidebar };
}

function setupSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const closeBtn = document.getElementById('sidebar-close');

  // Close sidebar
  const closeSidebar = () => {
    sidebar?.classList.add('translate-x-full');
    overlay?.classList.add('hidden');
  };

  // Open sidebar (can be called from other components)
  window.openSidebar = () => {
    sidebar?.classList.remove('translate-x-full');
    overlay?.classList.remove('hidden');
  };

  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
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

export function updateProjectInfo(info) {
  const projectName = document.getElementById('project-name');
  const sceneCount = document.getElementById('scene-count');
  const chapterCount = document.getElementById('chapter-count');

  if (projectName) projectName.textContent = info.name || 'Unnamed Project';
  if (sceneCount) sceneCount.textContent = info.scenes || 0;
  if (chapterCount) chapterCount.textContent = info.chapters || 0;
}
