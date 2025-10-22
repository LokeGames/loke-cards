import { b as attr, e as ensure_array_like, c as bind_props } from "./index2.js";
import { f as fallback } from "./utils.js";
import "./comlink.js";
import { e as escape_html } from "./context.js";
function ChapterManager($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let showList = fallback($$props["showList"], true);
    let chapters = [];
    let title = "";
    $$renderer2.push(`<section class="space-y-4"><h1 class="text-2xl font-semibold">Kapiteladministration</h1> <form class="space-y-2"><label class="block text-sm font-medium" for="chapter-title">Titel</label> <div class="flex flex-col gap-2 sm:flex-row sm:items-end"><input id="chapter-title" class="flex-1 rounded border border-gray-300 px-3 py-2"${attr("value", title)} placeholder="Nyt kapitel" autocomplete="off"/> <button class="px-3 py-2 rounded bg-blue-600 text-white" type="submit">Opret kapitel</button></div></form> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (showList) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="space-y-2"><h2 class="text-lg font-semibold">Eksisterende kapitler</h2> `);
      {
        $$renderer2.push("<!--[!-->");
        if (chapters.length === 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="text-sm text-gray-600 dark:text-gray-300">Ingen kapitler oprettet endnu.</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<ul class="divide-y divide-gray-200 dark:divide-gray-700 rounded border border-gray-200 dark:border-gray-700"><!--[-->`);
          const each_array = ensure_array_like(chapters);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            let chapter = each_array[$$index];
            $$renderer2.push(`<li class="p-3 flex items-center justify-between"><div><p class="font-medium">${escape_html(chapter.title)}</p> <p class="text-xs text-gray-500">ID: ${escape_html(chapter.chapterId)}</p></div></li>`);
          }
          $$renderer2.push(`<!--]--></ul>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></section>`);
    bind_props($$props, { showList });
  });
}
export {
  ChapterManager as C
};
