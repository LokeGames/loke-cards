import "clsx";
import { T as ThemeToggle, N as NetworkToggle } from "../../../chunks/ThemeToggle.js";
function _page($$renderer) {
  $$renderer.push(`<h2 class="text-xl font-semibold mb-3">Settings</h2> <div class="space-y-3"><div class="flex items-center gap-2"><span class="text-sm">Theme</span> `);
  ThemeToggle($$renderer);
  $$renderer.push(`<!----></div> <div class="flex items-center gap-2"><span class="text-sm">Network</span> `);
  NetworkToggle($$renderer);
  $$renderer.push(`<!----></div></div>`);
}
export {
  _page as default
};
