<template>
  <div id="app" class="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <AppHeader />

    <!-- Main Layout: Sidebar + Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <RouterView v-slot="{ Component }">
          <component :is="Component" :key="$route.fullPath" />
        </RouterView>
        <ToastContainer />
        <DevErrorOverlay v-if="isDev" />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@shared/components/AppHeader.vue'
import AppSidebar from '@shared/components/AppSidebar.vue'
import DevErrorOverlay from './components/DevErrorOverlay.vue'
import ToastContainer from './components/ToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
const isDev = import.meta.env.DEV
</script>

<style>
/* Global styles handled by Tailwind */
/* page transition disabled for stability */
</style>
