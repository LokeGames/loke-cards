import './styles/main.css';
import { createLayout, setMainContent } from './components/Layout.js';
import { initState, on } from './lib/state.js';
import { getAllScenes, getAllChapters } from './lib/storage.js';
import { handleInstallPrompt } from './lib/pwa.js';
import { createSceneEditor } from './components/SceneEditor.js';

// Initialize application
async function init() {
  console.log('🚀 Loke Cards initializing...');

  // Create layout
  createLayout();

  // PWA install prompt
  const installButton = document.getElementById('pwa-install-button');
  if (installButton) {
    installButton.addEventListener('click', handleInstallPrompt);
  }

  // Initialize state management
  await initState();

  // Listen for state changes
  on('initialized', (state) => {
    console.log('✓ State initialized:', state);
  });

  on('projectChanged', (project) => {
    console.log('Project changed:', project);
  });

  on('syncStatusChanged', (status) => {
    console.log('Sync status:', status);
  });

  // Load initial view
  await loadDashboard();

  console.log('✓ Loke Cards ready!');
}

// Dashboard view
export async function loadDashboard() {
  const scenes = await getAllScenes();
  const chapters = await getAllChapters();

  const content = `
    <div class="w-full max-w-7xl mx-auto">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 sm:p-8 mb-6 shadow-lg">
        <h1 class="text-2xl sm:text-3xl font-bold mb-2">Welcome to Loke Cards</h1>
        <p class="text-sm sm:text-base text-blue-100">Interactive Fiction Scene Editor for Loke Engine</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm">Scenes</p>
              <p class="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">${scenes.length}</p>
            </div>
            <div class="text-3xl sm:text-4xl">📝</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm">Chapters</p>
              <p class="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">${chapters.length}</p>
            </div>
            <div class="text-3xl sm:text-4xl">📚</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-5 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-xs sm:text-sm">Status</p>
              <p class="text-base sm:text-lg font-semibold text-green-600 mt-1">Online</p>
            </div>
            <div class="text-3xl sm:text-4xl">✓</div>
          </div>
        </div>
      </div>

      <!-- Recent Scenes -->
      <div class="bg-white rounded-lg shadow-md p-5 sm:p-6 mb-6">
        <h2 class="text-lg sm:text-xl font-semibold mb-4">Recent Scenes</h2>
        ${scenes.length > 0 ? `
          <div class="space-y-2">
            ${scenes.slice(0, 5).map(scene => `
              <div class="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation">
                <div class="flex-1 min-w-0 mr-2">
                  <p class="font-medium text-gray-900 text-sm sm:text-base truncate">${scene.sceneId || scene.id}</p>
                  <p class="text-xs sm:text-sm text-gray-500 truncate">${scene.chapter || 'No chapter'}</p>
                </div>
                <button class="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base whitespace-nowrap">Edit →</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-gray-500 text-center py-8">No scenes yet. Create your first scene!</p>
        `}
      </div>

      <!-- Getting Started -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 sm:p-6 rounded-lg">
        <h3 class="text-base sm:text-lg font-semibold text-blue-900 mb-3">Getting Started</h3>
        <ul class="space-y-2 text-sm sm:text-base text-blue-800">
          <li>✓ PWA with offline support</li>
          <li>✓ Auto-save functionality</li>
          <li>✓ Real-time C code preview</li>
          <li>✓ Tailscale secure access</li>
        </ul>
      </div>

      <!-- Auto-save indicator -->
      <div id="autosave-indicator" class="hidden fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        ✓ Saved
      </div>
    </div>
  `;

  setMainContent(content);
}



// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
