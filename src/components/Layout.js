/**
 * Layout Component
 * Main application layout structure
 */

import { createNavigation } from './Navigation.js';

export function createLayout() {
  const app = document.getElementById('app');
  if (!app) return;

  // Clear existing content
  app.innerHTML = '';

  // Create navigation
  const nav = createNavigation();
  app.appendChild(nav);

  // Create main content area
  const main = document.createElement('main');
  main.className = 'container mx-auto px-4 py-6';
  main.id = 'main-content';
  app.appendChild(main);

  // Create sidebar (initially hidden on mobile)
  const sidebar = document.createElement('aside');
  sidebar.className = 'fixed right-0 top-16 h-full w-80 bg-white shadow-lg transform translate-x-full transition-transform duration-300 ease-in-out md:translate-x-0 z-10';
  sidebar.id = 'sidebar';
  sidebar.innerHTML = `
    <div class="p-4">
      <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
      <div class="space-y-2">
        <button id="btn-new-scene" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          ➕ New Scene
        </button>
        <button id="btn-new-chapter" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          📚 New Chapter
        </button>
      </div>

      <div class="mt-6">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">Current Project</h3>
        <div id="project-info" class="text-sm text-gray-700">
          <p class="mb-1">📁 <span id="project-name">Loading...</span></p>
          <p class="mb-1">📝 <span id="scene-count">0</span> scenes</p>
          <p>📚 <span id="chapter-count">0</span> chapters</p>
        </div>
      </div>
    </div>
  `;
  app.appendChild(sidebar);

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

export function updateProjectInfo(info) {
  const projectName = document.getElementById('project-name');
  const sceneCount = document.getElementById('scene-count');
  const chapterCount = document.getElementById('chapter-count');

  if (projectName) projectName.textContent = info.name || 'Unnamed Project';
  if (sceneCount) sceneCount.textContent = info.scenes || 0;
  if (chapterCount) chapterCount.textContent = info.chapters || 0;
}
