import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import "../../chunks/database.js";
import { y as ensure_array_like } from "../../chunks/index2.js";
function QuickActions($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2> <div class="space-y-3"><button class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">New Scene</button> <button class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors">New Chapter</button></div></div>`);
  });
}
function ProjectStats($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Stats</h2> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-3"><div class="animate-pulse"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div> <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div></div> <div class="animate-pulse"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div> <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function RecentChapters($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Chapters</h2> <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View All</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(Array(3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="animate-pulse"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div> <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function RecentScenes($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Scenes</h2> <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">View All</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array = ensure_array_like(Array(3));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$renderer2.push(`<div class="animate-pulse"><div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div> <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Dashboard($$renderer) {
  $$renderer.push(`<div class="p-6 space-y-6"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1> <p class="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's an overview of your project.</p></div> <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">`);
  QuickActions($$renderer);
  $$renderer.push(`<!----> `);
  ProjectStats($$renderer);
  $$renderer.push(`<!----></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">`);
  RecentChapters($$renderer);
  $$renderer.push(`<!----> `);
  RecentScenes($$renderer);
  $$renderer.push(`<!----></div></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    Dashboard($$renderer2);
  });
}
export {
  _page as default
};
