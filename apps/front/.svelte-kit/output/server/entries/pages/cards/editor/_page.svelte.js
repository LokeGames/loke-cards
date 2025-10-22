import "../../../../chunks/storage.js";
import "../../../../chunks/comlink.js";
import { a as attr_class, b as attr, c as bind_props, e as ensure_array_like } from "../../../../chunks/index2.js";
import { f as fallback } from "../../../../chunks/utils.js";
import { e as escape_html } from "../../../../chunks/context.js";
function SceneIdInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let valid;
    let value = fallback($$props["value"], "");
    let label = fallback($$props["label"], "Scene ID");
    const pattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
    valid = pattern.test(value);
    $$renderer2.push(`<label class="block text-sm font-medium" for="scene-id-input">${escape_html(label)}</label> <input id="scene-id-input"${attr_class("mt-1 w-full rounded border px-2 py-1", void 0, { "border-red-500": !valid, "border-gray-300": valid })}${attr("value", value)}${attr("aria-invalid", !valid)} aria-describedby="sceneid-help"/> <p id="sceneid-help"${attr_class("text-xs mt-1", void 0, { "text-red-600": !valid, "text-gray-500": valid })}>`);
    if (valid) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`Must be a valid C identifier.`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`Invalid ID. Use letters, digits, and underscores; start with letter or underscore.`);
    }
    $$renderer2.push(`<!--]--></p>`);
    bind_props($$props, { value, label });
  });
}
function ChapterSelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let value = fallback($$props["value"], "");
    let label = fallback($$props["label"], "Chapter");
    let placeholder = fallback($$props["placeholder"], "Select chapter…");
    let chapters = [];
    $$renderer2.push(`<label class="block text-sm font-medium" for="chapter-select">${escape_html(label)}</label> `);
    $$renderer2.select(
      {
        id: "chapter-select",
        class: "mt-1 w-full rounded border border-gray-300 px-2 py-1 bg-white dark:bg-gray-900",
        value,
        "aria-label": label
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "", disabled: true, selected: value === "" }, ($$renderer4) => {
          $$renderer4.push(`${escape_html(placeholder)}`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(chapters);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let c = each_array[$$index];
          $$renderer3.option({ value: c.chapterId }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(c.title)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
        if (chapters.length === 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.option({ value: "", disabled: true }, ($$renderer4) => {
            $$renderer4.push(`(no chapters)`);
          });
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    bind_props($$props, { value, label, placeholder });
  });
}
function SceneTextEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let value = fallback($$props["value"], "");
    let label = fallback($$props["label"], "Scene Text");
    let maxLength = fallback($$props["maxLength"], 500);
    $$renderer2.push(`<label class="block text-sm font-medium" for="scene-text-editor">${escape_html(label)}</label> <textarea id="scene-text-editor" class="mt-1 w-full rounded border border-gray-300 px-2 py-1 bg-white dark:bg-gray-900"${attr("maxlength", maxLength)}${attr("rows", 8)}${attr("aria-label", label)}>`);
    const $$body = escape_html(value);
    if ($$body) {
      $$renderer2.push(`${$$body}`);
    }
    $$renderer2.push(`</textarea> <div class="text-xs text-gray-500 mt-1" aria-live="polite">${escape_html(value.length)} / ${escape_html(maxLength)}</div>`);
    bind_props($$props, { value, label, maxLength });
  });
}
function ChoicesList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let items = fallback($$props["items"], () => [], true);
    $$renderer2.push(`<div><div class="flex justify-between items-center mb-2"><h3 class="font-medium">Choices</h3> <button class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" aria-label="Add choice">Add</button></div> <ul><!--[-->`);
    const each_array = ensure_array_like(items);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let c = each_array[$$index];
      $$renderer2.push(`<li class="flex items-center gap-2 mb-1" data-testid="choice-row"><input class="flex-1 rounded border border-gray-300 px-2 py-1" placeholder="Choice text"${attr("value", c.text)}/> <input class="w-40 rounded border border-gray-300 px-2 py-1" placeholder="Next scene id"${attr("value", c.next)}/> <button class="px-2 py-1 rounded bg-red-600 text-white" aria-label="Remove choice">×</button></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div>`);
    bind_props($$props, { items });
  });
}
function StateChangesList($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let items = fallback($$props["items"], () => [], true);
    $$renderer2.push(`<div><div class="flex justify-between items-center mb-2"><h3 class="font-medium">State Changes</h3> <button class="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800" aria-label="Add state change">Add</button></div> <ul><!--[-->`);
    const each_array = ensure_array_like(items);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let sc = each_array[i];
      $$renderer2.push(`<li class="flex items-center gap-2 mb-1" data-testid="state-row"><input class="w-40 rounded border border-gray-300 px-2 py-1" placeholder="Key"${attr("value", sc.key)}/> <input class="flex-1 rounded border border-gray-300 px-2 py-1" placeholder="Value"${attr("value", sc.value)}/> <button class="px-2 py-1 rounded bg-red-600 text-white" aria-label="Remove state change">×</button></li>`);
    }
    $$renderer2.push(`<!--]--></ul></div>`);
    bind_props($$props, { items });
  });
}
function SceneEditorView($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let sceneId = fallback($$props["sceneId"], null);
    let chapterId = "";
    let title = "";
    let sceneText = "";
    let choices = [];
    let state = [];
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="space-y-4"><div><label class="block text-sm font-medium" for="scene-title">Title</label> <input id="scene-title" class="mt-1 w-full rounded border border-gray-300 px-2 py-1"${attr("value", title)} aria-label="Title"/></div> `);
      SceneIdInput($$renderer3, {
        label: "Scene ID",
        get value() {
          return sceneId;
        },
        set value($$value) {
          sceneId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChapterSelect($$renderer3, {
        get value() {
          return chapterId;
        },
        set value($$value) {
          chapterId = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      SceneTextEditor($$renderer3, {
        maxLength: 500,
        get value() {
          return sceneText;
        },
        set value($$value) {
          sceneText = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      ChoicesList($$renderer3, {
        get items() {
          return choices;
        },
        set items($$value) {
          choices = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      StateChangesList($$renderer3, {
        get items() {
          return state;
        },
        set items($$value) {
          state = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> <button class="px-3 py-2 rounded bg-blue-600 text-white" data-testid="save-btn">Save</button> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { sceneId });
  });
}
function _page($$renderer) {
  let sceneId = null;
  $$renderer.push(`<h2 class="text-xl font-semibold">Scene Editor</h2> `);
  SceneEditorView($$renderer, { sceneId });
  $$renderer.push(`<!---->`);
}
export {
  _page as default
};
