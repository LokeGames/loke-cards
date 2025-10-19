<script setup>
import { ref, watchEffect } from 'vue'
const dark = ref(
  localStorage.theme === 'dark' || (
    !('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
)
watchEffect(() => {
  document.documentElement.classList.toggle('dark', dark.value)
  localStorage.theme = dark.value ? 'dark' : 'light'
})
</script>
<template>
  <button @click="dark=!dark" class="px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
    <span v-if="dark">🌙</span><span v-else>☀️</span>
  </button>
</template>
