import { U as escape_html } from "../../../../chunks/context.js";
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
    let sceneId = "";
    let chapter = "chapter01";
    let sceneText = "";
    let error = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<h2 class="text-xl font-semibold mb-3">New Scene</h2> <div class="max-w-xl space-y-3">`);
      BaseInput($$renderer3, {
        id: "scene-id",
        label: "Scene ID",
        error,
        get value() {
          return sceneId;
        },
        set value($$value) {
          sceneId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      BaseInput($$renderer3, {
        id: "chapter",
        label: "Chapter",
        get value() {
          return chapter;
        },
        set value($$value) {
          chapter = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <div><label for="sceneText" class="block text-sm font-medium mb-1">Scene Text</label> <textarea id="sceneText" class="w-full rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2" rows="6">`);
      const $$body = escape_html(sceneText);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></div> <div class="flex gap-2">`);
      BaseButton($$renderer3, {
        variant: "primary",
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Create`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <a href="/scenes" class="px-3 py-2 rounded border">Cancel</a></div></div>`);
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
