<template>
  <RouterLink :to="to" custom v-slot="{ href, navigate, isActive }">
    <a :href="href" :class="['nav-item', baseClass, isActive ? activeClass : '']" @click.prevent="onClick(navigate)">
      <slot />
    </a>
  </RouterLink>
</template>

<script setup>
import { nextTick } from 'vue'
import { useUiStore } from '../stores/ui'

const props = defineProps({
  to: { type: [String, Object], required: true },
  baseClass: { type: String, default: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block' },
  activeClass: { type: String, default: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' },
})

const ui = useUiStore()

async function onClick(navigate) {
  try { ui.closeSidebar() } catch {}
  await nextTick()
  requestAnimationFrame(() => navigate())
}
</script>

<style scoped>
</style>

