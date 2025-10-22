<template>
  <div
    class="relative z-40 md:hidden"
    role="dialog"
    aria-modal="true"
    v-if="ui.isSidebarOpen"
  >
    <div
      class="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
      @click="ui.closeSidebar()"
    ></div>

    <div class="fixed inset-0 flex z-40">
      <div
        class="relative flex-1 flex flex-col max-w-xs w-full bg-gray-50 dark:bg-gray-950"
      >
        <div class="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            @click="ui.closeSidebar()"
          >
            <span class="sr-only">Close sidebar</span>
            <svg
              class="h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <aside class="h-full overflow-auto p-3">
          <SidebarMenu />
        </aside>
      </div>
    </div>
  </div>

  <!-- Desktop Sidebar -->
  <aside
    class="h-full overflow-auto p-3 bg-gray-50 dark:bg-gray-950 block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 relative z-20"
  >
    <SidebarMenu />
  </aside>
</template>

<script setup>
import { useUiStore } from "../stores/ui";
import NavLink from "./NavLink.vue";
import SidebarMenu from "./SidebarMenu.vue";

const ui = useUiStore();
</script>

<style scoped>
/* Active link styling */
.nav-item.router-link-active {
  @apply bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white;
}
</style>
