import './styles/main.css';
import { createLayout, setMainContent } from './components/Layout.js';
import { initState, on } from './lib/state.js';
import { getAllScenes, getAllChapters } from './lib/storage.js';

// Initialize application
async function init() {
  console.log('🚀 Loke Cards initializing...');

  // Create layout
  createLayout();

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
async function loadDashboard() {
  const scenes = await getAllScenes();
  const chapters = await getAllChapters();

  const content = `
    <div class="max-w-6xl mx-auto">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8 mb-6 shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Welcome to Loke Cards</h1>
        <p class="text-blue-100">Interactive Fiction Scene Editor for Loke Engine</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Scenes</p>
              <p class="text-3xl font-bold text-blue-600">${scenes.length}</p>
            </div>
            <div class="text-4xl">📝</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Chapters</p>
              <p class="text-3xl font-bold text-purple-600">${chapters.length}</p>
            </div>
            <div class="text-4xl">📚</div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">Status</p>
              <p class="text-lg font-semibold text-green-600">Online</p>
            </div>
            <div class="text-4xl">✓</div>
          </div>
        </div>
      </div>

      <!-- Recent Scenes -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">Recent Scenes</h2>
        ${scenes.length > 0 ? `
          <div class="space-y-2">
            ${scenes.slice(0, 5).map(scene => `
              <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div>
                  <p class="font-medium text-gray-900">${scene.sceneId || scene.id}</p>
                  <p class="text-sm text-gray-500">${scene.chapter || 'No chapter'}</p>
                </div>
                <button class="text-blue-600 hover:text-blue-700">Edit →</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <p class="text-gray-500 text-center py-8">No scenes yet. Create your first scene!</p>
        `}
      </div>

      <!-- Getting Started -->
      <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 class="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
        <ul class="space-y-2 text-blue-800">
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
