import { b as attr, e as ensure_array_like } from "../../../../chunks/index2.js";
import "../../../../chunks/comlink.js";
import { e as escape_html } from "../../../../chunks/context.js";
import { G as GraphView } from "../../../../chunks/GraphView.js";
function GraphControls($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let scenes = [];
    let src = "";
    let dst = "";
    let sceneTitle = "";
    let sceneId = "";
    $$renderer2.push(`<div class="flex flex-col gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"><div class="flex gap-2 items-end"><div><label class="block text-xs" for="gc-scene-title">Scene Title</label> <input id="gc-scene-title" class="rounded border px-2 py-1"${attr("value", sceneTitle)} placeholder="Title"/></div> <div><label class="block text-xs" for="gc-scene-id">Scene ID</label> <input id="gc-scene-id" class="rounded border px-2 py-1"${attr("value", sceneId)} placeholder="Optional"/></div> <button class="px-2 py-1 rounded bg-blue-600 text-white" data-testid="gc-create-scene">Create Scene</button></div> <div class="flex gap-2 items-end"><div><label class="block text-xs" for="gc-src">Source</label> `);
    $$renderer2.select(
      {
        id: "gc-src",
        class: "rounded border px-2 py-1",
        value: src,
        "data-testid": "gc-src"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Select…`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(scenes);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let s = each_array[$$index];
          $$renderer3.option({ value: s.sceneId }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(s.sceneId)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label class="block text-xs" for="gc-dst">Target</label> `);
    $$renderer2.select(
      {
        id: "gc-dst",
        class: "rounded border px-2 py-1",
        value: dst,
        "data-testid": "gc-dst"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Select…`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(scenes);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let s = each_array_1[$$index_1];
          $$renderer3.option({ value: s.sceneId }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(s.sceneId)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <button class="px-2 py-1 rounded bg-green-600 text-white" data-testid="gc-create-link">Create Link</button></div></div>`);
  });
}
function _page($$renderer) {
  $$renderer.push(`<h2 class="text-xl font-semibold">Global Graph</h2> `);
  GraphControls($$renderer);
  $$renderer.push(`<!----> `);
  GraphView($$renderer, {});
  $$renderer.push(`<!---->`);
}
export {
  _page as default
};
