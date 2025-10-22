<script lang="ts">
  export let variant: 'default' | 'compact' | 'interactive' | 'clickable' = 'default';
  export let onClick: (() => void) | undefined = undefined;

  const baseClass = 'card';
  const variantClasses = {
    default: 'card',
    compact: 'card-compact',
    interactive: 'card-interactive',
    clickable: 'card-clickable'
  };

  $: className = variantClasses[variant];
</script>

{#if onClick}
  <button type="button" class="{className} w-full text-left" on:click={onClick}>
    <slot />
  </button>
{:else}
  <div class={className}>
    <slot />
  </div>
{/if}
