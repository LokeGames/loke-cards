<template>
  <div class="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
    <header class="h-12 flex items-center justify-between px-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div class="font-semibold text-gray-900 dark:text-gray-100">Loke Graph</div>
      <nav class="text-sm text-gray-600 dark:text-gray-400">
        <a href="/" @click.prevent="$router.push('/')" class="hover:underline">Global</a>
      </nav>
    </header>
    <main class="flex-1 overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
</style>

