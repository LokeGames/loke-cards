<template>
  <component :is="resolved ? 'RouterLink' : 'span'" v-bind="linkProps">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  to: { type: [String, Object], required: true },
});

const resolved = computed(() => {
  if (typeof props.to === 'string') return true;
  if (props.to && typeof props.to === 'object' && 'name' in props.to) {
    const name = props.to.name;
    const params = props.to.params || {};
    if ((name === 'EditScene' || name === 'EditChapter') && !params.id) return false;
  }
  return true;
});

const linkProps = computed(() => (resolved.value ? { to: props.to } : {}));
</script>

<style scoped>
</style>

