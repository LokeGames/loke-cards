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
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
          </Transition>
        </RouterView>
        <ToastContainer />
        <DevErrorOverlay v-if="isDev" />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppSidebar from './components/AppSidebar.vue'
import DevErrorOverlay from './components/DevErrorOverlay.vue'
import ToastContainer from './components/ToastContainer.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
const isDev = import.meta.env.DEV
</script>

<style>
/* Global styles handled by Tailwind */
.page-enter-from { opacity: 0; transform: translateY(6px); }
.page-enter-to { opacity: 1; transform: translateY(0); }
.page-enter-active { transition: all 160ms ease-out; }
.page-leave-from { opacity: 1; transform: translateY(0); }
.page-leave-to { opacity: 0; transform: translateY(-6px); }
.page-leave-active { transition: all 140ms ease-in; }
</style>
