<script lang="ts">
  import ThemeToggle from '@shared/lib/components/ThemeToggle.svelte';
  import NetworkToggle from '@shared/lib/components/NetworkToggle.svelte';
</script>

<h2 class="text-xl font-semibold mb-3">Settings</h2>

<div class="space-y-3">
  <div class="flex items-center gap-2">
    <span class="text-sm">Theme</span>
    <ThemeToggle />
  </div>
  <div class="flex items-center gap-2">
    <span class="text-sm">Network</span>
    <NetworkToggle />
  </div>
</div>

