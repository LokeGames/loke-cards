import { b as attr, a as attr_class, c as bind_props } from "./index2.js";
import { f as fallback } from "./utils.js";
import { U as escape_html } from "./context.js";
function BaseInput($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let id = $$props["id"];
    let label = fallback($$props["label"], "");
    let type = fallback($$props["type"], "text");
    let value = fallback($$props["value"], "");
    let placeholder = fallback($$props["placeholder"], "");
    let error = fallback($$props["error"], "");
    $$renderer2.push(`<div class="mb-4">`);
    if (label) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<label${attr("for", id)} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${escape_html(label)}</label>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <input${attr("type", type)}${attr("id", id)}${attr("value", value)}${attr_class(`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"}`)}${attr("placeholder", placeholder)}${attr("aria-invalid", error ? "true" : void 0)}${attr("aria-describedby", error ? `${id}-error` : void 0)}/> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p${attr("id", `${id}-error`)} class="mt-1 text-sm text-red-600">${escape_html(error)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { id, label, type, value, placeholder, error });
  });
}
export {
  BaseInput as B
};
