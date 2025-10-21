import { a as attr_class, b as attr } from "./index2.js";
import { w as writable, g as get } from "./index.js";
import "clsx";
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
export {
  NetworkToggle as N,
  ThemeToggle as T,
  error as e,
  lastSync as l,
  pending as p,
  status as s
};
