import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
  state: () => ({
    isSidebarOpen: false,
    currentProject: null,
    stats: {
      scenes: 0,
      chapters: 0,
    },
  }),
  actions: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    openSidebar() {
      this.isSidebarOpen = true;
    },
    closeSidebar() {
      this.isSidebarOpen = false;
    },
    setCurrentProject(project) {
      this.currentProject = project;
    },
    updateStats(stats) {
      this.stats = { ...this.stats, ...stats };
    },
  },
});
