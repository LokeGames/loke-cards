<script lang="ts">
  import { AppHeader } from '@loke/ui';
</script>

<div class="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
  <AppHeader title="Cards Editor" showProjectPicker={true} />
  <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
    <slot />
  </main>
</div>

