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
        <Suspense>
          <template #default>
            <RouterView v-slot="{ Component }">
              <component :is="Component" :key="$route.fullPath" />
            </RouterView>
          </template>
          <template #fallback>
            <div class="p-6 text-sm text-gray-600 dark:text-gray-400">Loading…</div>
          </template>
        </Suspense>
        <DevErrorOverlay v-if="isDev" />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import DevErrorOverlay from './components/DevErrorOverlay.vue'
const isDev = import.meta.env.DEV
</script>

<style>
/* Global styles handled by Tailwind */
</style>
