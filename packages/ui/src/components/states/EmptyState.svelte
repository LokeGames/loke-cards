<script lang="ts">
  export let icon: string;
  export let title: string;
  export let description: string;
</script>

<div class="empty-state">
  <span class="empty-state-icon">{icon}</span>
  <h3 class="empty-state-title">{title}</h3>
  <p class="empty-state-description">{description}</p>
  <div class="mt-4">
    <slot />
  </div>
</div>
