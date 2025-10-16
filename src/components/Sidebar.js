/**
 * Sidebar Component
 * Quick actions and project info sidebar
 */

import { createSceneEditor } from './SceneEditor.js';
import { getAllScenes, getAllChapters, getCurrentProject } from '../lib/storage.js';

export function createSidebar() {
  const sidebar = document.createElement('aside');
  // TEST: Always show sidebar (no translate)
  sidebar.className = 'fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-white border-l border-gray-200 shadow-xl z-40 overflow-y-auto';
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

  // Setup event listeners
  setupSidebarEvents(sidebar);

  // Update project info
  updateProjectInfo();

  return sidebar;
}

function setupSidebarEvents(sidebar) {
  // New Scene button
  const btnNewScene = sidebar.querySelector('#btn-new-scene');
  btnNewScene.addEventListener('click', async () => {
    await createSceneEditor();
    // Close mobile sidebar after creating scene
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  });

  // New Chapter button (placeholder for now)
  const btnNewChapter = sidebar.querySelector('#btn-new-chapter');
  btnNewChapter.addEventListener('click', () => {
    // TODO: Implement chapter creation in Phase 3
    alert('Chapter creation coming in Phase 3!');
  });

  // Mobile close button
  const closeBtn = sidebar.querySelector('#sidebar-close');
  closeBtn.addEventListener('click', closeSidebar);
}

export function setupSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!sidebar || !overlay) return;

  // Close sidebar
  window.closeSidebar = closeSidebar;

  // Open sidebar (can be called from other components)
  window.openSidebar = () => {
    sidebar.classList.remove('translate-x-full');
    overlay.classList.remove('hidden');
  };

  // Close on overlay click
  overlay.addEventListener('click', closeSidebar);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (sidebar) {
    sidebar.classList.add('translate-x-full');
  }
  if (overlay) {
    overlay.classList.add('hidden');
  }
}

export async function updateProjectInfo(data = null) {
  const projectName = document.getElementById('project-name');
  const sceneCount = document.getElementById('scene-count');
  const chapterCount = document.getElementById('chapter-count');

  try {
    // If data is provided, use it directly (from state management)
    if (data) {
      if (projectName) {
        projectName.textContent = data.name || 'My Adventure';
      }
      if (sceneCount) {
        sceneCount.textContent = data.scenes || 0;
      }
      if (chapterCount) {
        chapterCount.textContent = data.chapters || 0;
      }
    } else {
      // Otherwise, fetch data from storage
      const [project, scenes, chapters] = await Promise.all([
        getCurrentProject(),
        getAllScenes(),
        getAllChapters()
      ]);

      if (projectName) {
        projectName.textContent = project?.name || 'My Adventure';
      }
      if (sceneCount) {
        sceneCount.textContent = scenes.length;
      }
      if (chapterCount) {
        chapterCount.textContent = chapters.length;
      }
    }
  } catch (error) {
    console.error('Error updating project info:', error);
  }
}
