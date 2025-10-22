<script lang="ts">
  import { goto } from '$app/navigation';
  import ChapterManager from '$lib/components/ChapterManager.svelte';

  function openCards() {
    goto('/cards/scenes');
  }
</script>

<ChapterManager showList />
