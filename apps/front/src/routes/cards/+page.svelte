<script lang="ts">
  // Cards home page - overview of cards functionality
</script>

<div class="p-6">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Cards</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Scenes Card -->
    <a href="/cards/scenes" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <span class="text-4xl mr-4">📄</span>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Scenes</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">View and manage all scenes in your project</p>
    </a>

    <!-- Chapters Card -->
    <a href="/cards/chapters" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <span class="text-4xl mr-4">📚</span>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Chapters</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Organize your content into chapters</p>
    </a>

    <!-- Editor Card -->
    <a href="/cards/editor" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <span class="text-4xl mr-4">✏️</span>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Editor</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Edit scenes with full code preview</p>
    </a>

    <!-- Table of Contents Card -->
    <a href="/cards/toc" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <span class="text-4xl mr-4">📋</span>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Table of Contents</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Overview of your project structure</p>
    </a>
  </div>

  <!-- Quick Actions -->
  <div class="mt-8">
    <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
    <div class="flex gap-4">
      <a href="/cards/scene/new" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        ➕ New Scene
      </a>
      <a href="/cards/chapter/new" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
        ➕ New Chapter
      </a>
    </div>
  </div>
</div>
