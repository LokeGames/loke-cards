<template>
  <RouterLink :to="to" custom v-slot="{ href, navigate, isActive }">
    <a
      :href="href"
      :class="['nav-item', baseClass, isActive ? activeClass : '']"
      @click.prevent="onClick(navigate)"
    >
      <slot />
    </a>
  </RouterLink>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import { useUiStore } from "../stores/ui";

type ToType = string | Record<string, any>;
const props = withDefaults(
  defineProps<{ to: ToType; baseClass?: string; activeClass?: string }>(),
  {
    baseClass:
      "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block",
    activeClass: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",
  },
);

const ui = useUiStore();

function onClick(navigate: () => void) {
  try {
    ui.closeSidebar();
  } catch {}
  navigate();
}
</script>

<style scoped></style>
