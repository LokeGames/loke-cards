<script lang="ts">
  export let width: 'default' | 'wide' | 'narrow' = 'default';

  const classes = {
    default: 'page-container',
    wide: 'page-container-wide',
    narrow: 'page-container-narrow'
  };
</script>

<div class={classes[width]}>
  <slot />
</div>
