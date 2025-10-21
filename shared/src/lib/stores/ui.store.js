// Minimal UI store for drawer/sidebar state
// Uses Svelte's writable store API (consumer app must provide `svelte` dep)
import { writable } from 'svelte/store';

export const isSidebarOpen = writable(false);
export const toggleSidebar = () => {
  isSidebarOpen.update((v) => !v);
};
export const openSidebar = () => isSidebarOpen.set(true);
export const closeSidebar = () => isSidebarOpen.set(false);

