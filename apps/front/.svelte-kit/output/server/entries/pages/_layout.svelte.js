import { s as store_get, a as attr_class, b as attr, u as unsubscribe_stores, c as bind_props, e as ensure_array_like, d as clsx, f as slot } from "../../chunks/index2.js";
import { f as fallback } from "../../chunks/utils.js";
import { e as escape_html } from "../../chunks/context.js";
import { w as writable, g as get } from "../../chunks/index.js";
import "../../chunks/storage.js";
const isSidebarOpen = writable(false);
const status = writable("idle");
const pending = writable(0);
const lastSync = writable(null);
const error = writable(null);
function markOffline() {
  status.set("offline");
}
function markSynced() {
  status.set("synced");
  lastSync.set(Date.now());
}
function setStatus(s) {
  status.set(s);
}
function StatusPill($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let state = fallback($$props["state"], void 0);
    let effective;
    let label;
    let tooltip;
    let p = 0;
    p = Number(store_get($$store_subs ??= {}, "$pending", pending) || 0);
    effective = state || store_get($$store_subs ??= {}, "$status", status) || "idle";
    {
      if (effective === "synced") label = p > 0 ? `Pending ${p}` : "Synced";
      else if (effective === "syncing") label = p > 0 ? `Syncing… ${p}` : "Syncing…";
      else if (effective === "offline") label = "Offline";
      else if (effective === "error") label = "Sync error";
      else label = p > 0 ? `Pending ${p}` : "Idle";
    }
    {
      if (effective === "synced" && store_get($$store_subs ??= {}, "$lastSync", lastSync)) {
        const d = new Date(store_get($$store_subs ??= {}, "$lastSync", lastSync));
        tooltip = `Last sync: ${d.toLocaleString()}`;
      } else if (effective === "error" && store_get($$store_subs ??= {}, "$error", error)) {
        tooltip = String(store_get($$store_subs ??= {}, "$error", error));
      } else tooltip = "Sync status";
    }
    $$renderer2.push(`<span${attr_class("text-sm px-3 py-1 rounded-full text-white", void 0, {
      "bg-green-500": effective === "synced",
      "bg-blue-500": effective === "syncing",
      "bg-yellow-500": effective === "idle",
      "bg-red-500": effective === "error",
      "bg-gray-500": effective === "offline"
    })}${attr("title", tooltip)}>${escape_html(label)}</span>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { state });
  });
}
function NetworkToggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const online = () => get(status) !== "offline";
    function apply(forceOffline) {
      try {
        localStorage.setItem("LC_FORCE_OFFLINE", forceOffline ? "1" : "0");
      } catch {
      }
      if (forceOffline) {
        markOffline();
      } else {
        if (get(pending) > 0) setStatus("idle");
        else markSynced();
      }
    }
    const handleNavigatorOnline = () => apply(false);
    const handleNavigatorOffline = () => apply(true);
    if (typeof window !== "undefined") {
      try {
        if (localStorage.getItem("LC_FORCE_OFFLINE") === "1") apply(true);
      } catch {
      }
      window.addEventListener("online", handleNavigatorOnline);
      window.addEventListener("offline", handleNavigatorOffline);
    }
    $$renderer2.push(`<button${attr_class("inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full border transition-colors", void 0, {
      "!bg-emerald-600": online(),
      "!text-white": online(),
      "!border-emerald-700": online(),
      "hover:!bg-emerald-700": online(),
      "bg-gray-600": !online(),
      "text-white": !online(),
      "border-gray-700": !online(),
      "hover:bg-gray-700": !online()
    })}${attr("aria-pressed", !online())}>`);
    if (online()) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`Online`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Offline`);
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
function ThemeToggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<button class="px-2 py-1 rounded border border-gray-200 dark:border-gray-700" aria-label="Toggle theme">`);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`☀️`);
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
const currentProject = writable(null);
const projects = writable([]);
function ProjectPicker($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentId = "";
    currentId = store_get($$store_subs ??= {}, "$currentProject", currentProject)?.id || "default";
    $$renderer2.push(`<div class="flex items-center gap-2"><label class="text-xs text-gray-500 dark:text-gray-400" for="project-picker">Project</label> `);
    $$renderer2.select(
      {
        id: "project-picker",
        value: currentId,
        class: "px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$projects", projects));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let p = each_array[$$index];
          $$renderer3.option({ value: p.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(p.name || p.id)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` <button class="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white" title="New project" aria-label="New project">+</button></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AppHeader($$renderer, $$props) {
  let title = fallback($$props["title"], "Loke Cards");
  $$renderer.push(`<header class="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60"><button class="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle menu"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6.75a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd"></path></svg></button> <h1 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${escape_html(title)}</h1> <div class="ml-auto flex items-center gap-2">`);
  StatusPill($$renderer, {});
  $$renderer.push(`<!----> `);
  NetworkToggle($$renderer);
  $$renderer.push(`<!----> `);
  ProjectPicker($$renderer);
  $$renderer.push(`<!----> `);
  ThemeToggle($$renderer);
  $$renderer.push(`<!----></div></header>`);
  bind_props($$props, { title });
}
function NavLink($$renderer, $$props) {
  let isActive, className;
  let to = fallback($$props["to"], "/");
  let baseClass = fallback($$props["baseClass"], "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded block");
  let activeClass = fallback($$props["activeClass"], "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white");
  let currentPath = "";
  if (typeof window !== "undefined") {
    currentPath = window.location.pathname;
  }
  isActive = currentPath === to;
  className = `nav-item ${baseClass} ${isActive ? activeClass : ""}`;
  $$renderer.push(`<a${attr("href", to)}${attr_class(clsx(className))}><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></a>`);
  bind_props($$props, { to, baseClass, activeClass });
}
function SidebarMenu($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let stats = { scenes: 0, chapters: 0 };
    $$renderer2.push(`<div><ul class="space-y-1 text-sm"><li>`);
    NavLink($$renderer2, {
      to: "/",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Dashboard`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/scenes",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Scenes`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/chapters",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Chapters`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/graph",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Graph`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/toc",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Story Map`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/code",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->C code`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/settings",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->Settings`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li></ul> <div class="mt-6 px-3"><h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Project Info</h3> <div class="text-sm text-gray-700 dark:text-gray-300"><p class="font-semibold">${escape_html(store_get($$store_subs ??= {}, "$currentProject", currentProject)?.name || "No Project")}</p> <p>Scenes: ${escape_html(stats.scenes)}</p> <p>Chapters: ${escape_html(stats.chapters)}</p></div></div> <div class="mt-6 px-3"><h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Quick Actions</h3> <ul class="space-y-1 text-sm"><li>`);
    NavLink($$renderer2, {
      to: "/scene/new",
      class: "group flex items-center gap-2",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->New Scene`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li> <li>`);
    NavLink($$renderer2, {
      to: "/chapter/new",
      class: "group flex items-center gap-2",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->New Chapter`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></li></ul></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function AppSidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let open;
    isSidebarOpen.subscribe((v) => open = v);
    $$renderer2.push(`<aside class="hidden md:flex md:flex-col md:w-60 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"><div class="p-3 text-sm text-gray-700 dark:text-gray-300">`);
    SidebarMenu($$renderer2);
    $$renderer2.push(`<!----></div> <div class="mt-auto p-3 text-xs text-gray-500">Sidebar</div></aside> `);
    if (open) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="md:hidden fixed inset-0 z-40 bg-black/40" role="button" tabindex="0" aria-label="Close menu overlay"></div> <aside class="md:hidden fixed z-50 inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-3"><button class="mb-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Close menu">Close</button> <div class="text-sm text-gray-700 dark:text-gray-300">`);
      SidebarMenu($$renderer2);
      $$renderer2.push(`<!----></div></aside>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
const toasts = writable([]);
function AppToasts($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    $$renderer2.push(`<div class="fixed z-50 bottom-4 right-4 space-y-2"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let t = each_array[$$index];
      $$renderer2.push(`<div${attr_class("px-3 py-2 rounded shadow text-white", void 0, {
        "bg-blue-600": t.type === "info",
        "bg-green-600": t.type === "success",
        "bg-yellow-600": t.type === "warn",
        "bg-red-600": t.type === "error"
      })}><div class="flex items-start gap-2"><div class="flex-1">${escape_html(t.message)}</div> <button class="opacity-80 hover:opacity-100">×</button></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.push(`<div class="h-screen w-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">`);
  AppSidebar($$renderer);
  $$renderer.push(`<!----> <div class="flex-1 flex flex-col min-w-0 overflow-hidden">`);
  AppHeader($$renderer, { title: "Loke Shell" });
  $$renderer.push(`<!----> <main class="flex-1 overflow-auto p-4 sm:p-6 lg:p-8"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></main></div> `);
  AppToasts($$renderer);
  $$renderer.push(`<!----></div>`);
}
export {
  _layout as default
};
