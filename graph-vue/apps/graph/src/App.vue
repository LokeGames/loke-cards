<template>
  <div id="app" class="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <GraphAppHeader />

    <!-- Main Layout: Sidebar + Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <GraphAppSidebar />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import GraphAppHeader from './components/GraphAppHeader.vue'
import GraphAppSidebar from './components/GraphAppSidebar.vue'
</script>

<style>
</style>