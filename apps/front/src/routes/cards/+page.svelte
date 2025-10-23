<script lang="ts">
  import { File, BookOpen, Settings, List } from 'lucide-svelte';
</script>

<div class="p-6">
  <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Cards</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Scenes Card -->
    <a href="/cards/scenes" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <File size={32} class="text-blue-600 dark:text-blue-400 mr-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Scenes</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">View and manage all scenes in your project</p>
    </a>

    <!-- Chapters Card -->
    <a href="/cards/chapters" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <BookOpen size={32} class="text-green-600 dark:text-green-400 mr-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Chapters</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Organize your content into chapters</p>
    </a>

    <!-- States Card -->
    <a href="/cards/states" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <Settings size={32} class="text-purple-600 dark:text-purple-400 mr-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">States</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Manage state variables and game data</p>
    </a>

    <!-- Table of Contents Card -->
    <a href="/cards/toc" class="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div class="flex items-center mb-4">
        <List size={32} class="text-orange-600 dark:text-orange-400 mr-4" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Table of Contents</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Overview of your project structure</p>
    </a>
  </div>
</div>
