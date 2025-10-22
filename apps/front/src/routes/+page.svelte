<script lang="ts">
  import Dashboard from '$lib/components/dashboard/Dashboard.svelte';
  import { onMount } from 'svelte';
  
  // Handle direct navigation to cards/graph routes
  onMount(() => {
    const path = window.location.pathname;
    
    if (path.startsWith('/cards/') || path.startsWith('/graph/')) {
      // For now, redirect to dashboard with info
      // In future: lazy load the specific app component
      console.log('Navigation to:', path);
    }
  });
</script>

<Dashboard />

