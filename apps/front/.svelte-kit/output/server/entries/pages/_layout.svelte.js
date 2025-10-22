import { w as bind_props, x as stringify, y as ensure_array_like, z as attr_class, F as slot } from "../../chunks/index2.js";
import { e as escape_html } from "../../chunks/escaping.js";
import { a as attr } from "../../chunks/attributes.js";
import { k as fallback } from "../../chunks/utils2.js";
function AppHeader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let title = fallback($$props["title"], "");
    let theme = "system";
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      theme = stored || "system";
      updateTheme();
    }
    function updateTheme() {
      if (typeof document !== "undefined") {
        const root = document.documentElement;
        if (theme === "system") {
          const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
          root.classList.toggle("dark", systemTheme === "dark");
        } else {
          root.classList.toggle("dark", theme === "dark");
        }
        localStorage.setItem("theme", theme);
      }
    }
    if (typeof window !== "undefined") {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateTheme);
    }
    $$renderer2.push(`<header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"><div class="flex items-center justify-between"><h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">${escape_html(title)}</h1> <button type="button" class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"${attr("title", `Toggle theme (current: ${stringify(theme)})`)}>`);
    if (theme === "light") {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (theme === "dark") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></button></div></header>`);
    bind_props($$props, { title });
  });
}
function AppSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let cardsMenuItems = [];
    let graphMenuItems = [];
    $$renderer2.push(`<aside class="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4"><nav class="space-y-6"><div><h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Main</h3> <div class="space-y-1"><a href="/" class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">📊 Dashboard</a> <a href="/settings" class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">⚙️ Settings</a></div></div> `);
    if (cardsMenuItems.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div><h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cards</h3> <div class="space-y-1"><!--[-->`);
      const each_array = ensure_array_like(cardsMenuItems);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        $$renderer2.push(`<a${attr("href", item.href)} class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">${escape_html(item.icon)} ${escape_html(item.label)}</a>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (graphMenuItems.length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div><h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Graph</h3> <div class="space-y-1"><!--[-->`);
      const each_array_1 = ensure_array_like(graphMenuItems);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        $$renderer2.push(`<a${attr("href", item.href)} class="block px-3 py-2 rounded-md text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700">${escape_html(item.icon)} ${escape_html(item.label)}</a>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></nav></aside>`);
  });
}
function AppToasts($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let toasts = [];
    function addToast(message, type = "info") {
      const id = Date.now().toString();
      toasts = [...toasts, { id, message, type }];
      setTimeout(
        () => {
          toasts = toasts.filter((t) => t.id !== id);
        },
        3e3
      );
    }
    $$renderer2.push(`<div class="fixed bottom-4 right-4 z-50 space-y-2"><!--[-->`);
    const each_array = ensure_array_like(toasts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class("px-4 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out", void 0, {
        "bg-blue-500": toast.type === "info",
        "bg-green-500": toast.type === "success",
        "bg-red-500": toast.type === "error"
      })}>${escape_html(toast.message)}</div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { addToast });
  });
}
function _layout($$renderer, $$props) {
  $$renderer.push(`<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">`);
  AppSidebar($$renderer);
  $$renderer.push(`<!----> <div class="flex-1 flex flex-col min-w-0 overflow-hidden">`);
  AppHeader($$renderer, { title: "Loke Cards" });
  $$renderer.push(`<!----> <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></main></div> `);
  AppToasts($$renderer, {});
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
