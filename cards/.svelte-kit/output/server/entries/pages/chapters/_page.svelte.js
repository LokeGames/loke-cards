import "clsx";
import "../../../chunks/storage.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { B as BaseButton } from "../../../chunks/BaseSkeletonList.svelte_svelte_type_style_lang.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<h2 class="text-xl font-semibold mb-3">Chapters</h2> <div class="mb-4"><a href="/chapter/new">`);
    BaseButton($$renderer2, {
      variant: "primary",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->New Chapter`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></a></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p>Loading…</p>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
