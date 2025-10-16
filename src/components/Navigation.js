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
          <img src="/icons/icon.svg" alt="Loke Cards" class="w-8 h-8 sm:w-10 sm:h-10">
          <div>
            <h1 class="text-xl sm:text-2xl font-bold">Loke Cards</h1>
            <p class="text-xs text-blue-100 hidden sm:block">Interactive Fiction Editor</p>
          </div>
        </div>

        <!-- Desktop Navigation Links -->
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

        <!-- Mobile: Menu button + Status -->
        <div class="flex items-center gap-3">
          <!-- PWA Install Button -->
          <button id="pwa-install-button" class="hidden bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Install App
          </button>

          <!-- Status Indicator -->
          <div id="sync-status" class="flex items-center space-x-2">
            <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span class="text-sm hidden sm:inline">Synced</span>
          </div>

          <!-- Mobile Menu Button -->
          <button id="mobile-menu-btn" class="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors touch-manipulation">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Setup mobile menu toggle
  setTimeout(() => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    menuBtn?.addEventListener('click', () => {
      if (window.openSidebar) {
        window.openSidebar();
      }
    });
  }, 0);

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
