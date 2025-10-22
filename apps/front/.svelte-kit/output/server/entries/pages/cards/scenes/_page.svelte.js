import { e as ensure_array_like } from "../../../../chunks/index2.js";
import "../../../../chunks/comlink.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let items = [];
    $$renderer2.push(`<h2 class="text-xl font-semibold">Scenes</h2> <ul><!--[-->`);
    const each_array = ensure_array_like(items);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let s = each_array[$$index];
      $$renderer2.push(`<li data-testid="scene-row">${escape_html(s.sceneId)}: ${escape_html(s.title)}</li>`);
    }
    $$renderer2.push(`<!--]--></ul>`);
  });
}
export {
  _page as default
};
