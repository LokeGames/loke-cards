<script lang="ts">
  import { goto } from '$app/navigation';
  import BaseButton from '@shared/lib/components/BaseButton.svelte';

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
    <BaseButton 
      variant="primary" 
      size="md" 
      on:click={createNewScene}
      class="w-full justify-center"
    >
      New Scene
    </BaseButton>
    <BaseButton 
      variant="secondary" 
      size="md" 
      on:click={createNewChapter}
      class="w-full justify-center"
    >
      New Chapter
    </BaseButton>
  </div>
</div>