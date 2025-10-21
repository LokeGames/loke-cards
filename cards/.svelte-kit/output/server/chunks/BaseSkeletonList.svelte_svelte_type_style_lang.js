import { a as attr_class, b as attr, f as slot, c as bind_props } from "./index2.js";
import { f as fallback } from "./utils.js";
function BaseButton($$renderer, $$props) {
  let variant = fallback($$props["variant"], "primary");
  let size = fallback($$props["size"], "md");
  let loading = fallback($$props["loading"], false);
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    ghost: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 focus:ring-gray-500"
  };
  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-5 py-3"
  };
  $$renderer.push(`<button${attr_class(`px-4 py-2 rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant] || ""} ${sizeClasses[size] || ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`)}${attr("disabled", loading, true)}${attr("aria-busy", loading ? "true" : "false")}><span class="inline-flex items-center">`);
  if (loading) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--> <!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></span></button>`);
  bind_props($$props, { variant, size, loading });
}
export {
  BaseButton as B
};
