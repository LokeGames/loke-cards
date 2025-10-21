import { writable, type Writable } from 'svelte/store';

export const isSidebarOpen: Writable<boolean> = writable(false);
export const toggleSidebar = (): void => { isSidebarOpen.update((v) => !v); };
export const openSidebar = (): void => isSidebarOpen.set(true);
export const closeSidebar = (): void => isSidebarOpen.set(false);

