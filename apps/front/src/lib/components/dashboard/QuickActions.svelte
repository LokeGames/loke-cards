<script lang="ts">
  import { goto } from '$app/navigation';

  function createNewScene() {
    goto('/scene/new');
  }

  function createNewChapter() {
    goto('/chapter/new');
  }
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
  <div class="space-y-3">
    <button 
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      on:click={createNewScene}
    >
      New Scene
    </button>
    <button 
      class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
      on:click={createNewChapter}
    >
      New Chapter
    </button>
  </div>
</div>