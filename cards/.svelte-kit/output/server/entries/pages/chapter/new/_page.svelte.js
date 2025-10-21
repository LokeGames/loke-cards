import "clsx";
import "../../../../chunks/storage.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { B as BaseButton } from "../../../../chunks/BaseSkeletonList.svelte_svelte_type_style_lang.js";
import { B as BaseInput } from "../../../../chunks/BaseInput.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let id = "";
    let name = "";
    let order = 1;
    let error = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<h2 class="text-xl font-semibold mb-3">New Chapter</h2> <div class="max-w-xl space-y-3">`);
      BaseInput($$renderer3, {
        id: "chapter-id",
        label: "Chapter ID",
        error,
        get value() {
          return id;
        },
        set value($$value) {
          id = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      BaseInput($$renderer3, {
        id: "chapter-name",
        label: "Name",
        get value() {
          return name;
        },
        set value($$value) {
          name = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      BaseInput($$renderer3, {
        id: "chapter-order",
        label: "Order",
        get value() {
          return order;
        },
        set value($$value) {
          order = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div class="flex gap-2">`);
      BaseButton($$renderer3, {
        variant: "primary",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Create`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <a href="/chapters" class="px-3 py-2 rounded border">Cancel</a></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
