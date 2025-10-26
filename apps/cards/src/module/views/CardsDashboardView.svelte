<script lang="ts">
  import { File, BookOpen, Settings, List } from "lucide-svelte";
</script>

<div class="h-full overflow-auto p-6">
  <h1 class="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Cards</h1>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
    <a
      href="/cards/scenes"
      class="block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div class="mb-4 flex items-center">
        <File size={32} class="mr-4 text-blue-600 dark:text-blue-400" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Scenes</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">View and manage all scenes in your project</p>
    </a>

    <a
      href="/cards/chapters"
      class="block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div class="mb-4 flex items-center">
        <BookOpen size={32} class="mr-4 text-green-600 dark:text-green-400" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Chapters</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Organize your content into chapters</p>
    </a>

    <a
      href="/cards/states"
      class="block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div class="mb-4 flex items-center">
        <Settings size={32} class="mr-4 text-purple-600 dark:text-purple-400" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">States</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Manage state variables and game data</p>
    </a>

    <a
      href="/cards/toc"
      class="block rounded-lg border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <div class="mb-4 flex items-center">
        <List size={32} class="mr-4 text-orange-600 dark:text-orange-400" />
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Table of Contents</h2>
      </div>
      <p class="text-gray-600 dark:text-gray-400">Overview of your project structure</p>
    </a>
  </div>
</div>
