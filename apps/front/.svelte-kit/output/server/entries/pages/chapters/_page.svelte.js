import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { C as ChapterManager } from "../../../chunks/ChapterManager.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    ChapterManager($$renderer2, { showList: true });
  });
}
export {
  _page as default
};
