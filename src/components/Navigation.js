/**
 * Navigation Component
 * Main navigation bar for loke-cards
 */

export function createNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg';

  nav.innerHTML = `
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
          <img src="/icons/icon.svg" alt="Loke Cards" class="w-10 h-10">
          <div>
            <h1 class="text-2xl font-bold">Loke Cards</h1>
            <p class="text-xs text-blue-100">Interactive Fiction Editor</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <a href="#scenes" class="nav-link hover:text-blue-200 transition-colors">
            📝 Scenes
          </a>
          <a href="#chapters" class="nav-link hover:text-blue-200 transition-colors">
            📚 Chapters
          </a>
          <a href="#preview" class="nav-link hover:text-blue-200 transition-colors">
            👁️ Preview
          </a>
        </div>

        <!-- Status Indicator -->
        <div id="sync-status" class="flex items-center space-x-2">
          <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span class="text-sm">Synced</span>
        </div>
      </div>
    </div>
  `;

  return nav;
}

export function updateSyncStatus(status) {
  const statusElement = document.getElementById('sync-status');
  if (!statusElement) return;

  const statuses = {
    synced: { color: 'bg-green-400', text: 'Synced', animate: '' },
    syncing: { color: 'bg-yellow-400', text: 'Syncing...', animate: 'animate-pulse' },
    offline: { color: 'bg-gray-400', text: 'Offline', animate: '' },
    error: { color: 'bg-red-400', text: 'Error', animate: 'animate-pulse' }
  };

  const config = statuses[status] || statuses.offline;

  statusElement.innerHTML = `
    <div class="w-2 h-2 rounded-full ${config.color} ${config.animate}"></div>
    <span class="text-sm">${config.text}</span>
  `;
}
