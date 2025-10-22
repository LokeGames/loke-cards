<script lang="ts">
  export let variant: 'primary' | 'success' | 'danger' | 'secondary' = 'primary';
  export let size: 'default' | 'sm' = 'default';
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
  export let href: string | undefined = undefined;

  const variantClasses = {
    primary: 'btn-primary',
    success: 'btn-success',
    danger: 'btn-danger',
    secondary: 'btn-secondary'
  };

  const sizeClasses = {
    default: '',
    sm: 'btn-sm'
  };

  $: className = `${variantClasses[variant]} ${sizeClasses[size]}`.trim();
</script>

{#if href}
  <a {href} class={className}>
    <slot />
  </a>
{:else}
  <button {type} {disabled} class={className} on:click>
    <slot />
  </button>
{/if}
