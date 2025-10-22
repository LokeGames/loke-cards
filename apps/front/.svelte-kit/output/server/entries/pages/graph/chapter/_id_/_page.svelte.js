import { c as bind_props } from "../../../../../chunks/index2.js";
import { G as GraphView } from "../../../../../chunks/GraphView.js";
import { e as escape_html } from "../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let params = $$props["params"];
    $$renderer2.push(`<h2 class="text-xl font-semibold">Chapter Graph: ${escape_html(params.id)}</h2> `);
    GraphView($$renderer2, { projectId: void 0, chapterId: params.id });
    $$renderer2.push(`<!---->`);
    bind_props($$props, { params });
  });
}
export {
  _page as default
};
