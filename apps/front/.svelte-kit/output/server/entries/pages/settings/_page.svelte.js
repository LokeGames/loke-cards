import { a as attr } from "../../../chunks/attributes.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let uiSettings = {
      theme: "system",
      autoSave: true,
      apiEndpoint: "http://localhost:3000",
      dashboardLayout: "grid"
    };
    $$renderer2.push(`<div class="max-w-4xl mx-auto space-y-6"><div class="mb-8"><h1 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1> <p class="text-gray-600 dark:text-gray-400 mt-2">Configure your Loke Cards experience</p></div> <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎨 Appearance</h2> <div class="space-y-4"><div><label for="theme-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label> `);
    $$renderer2.select(
      {
        id: "theme-select",
        value: uiSettings.theme,
        class: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "light" }, ($$renderer4) => {
          $$renderer4.push(`☀️ Light`);
        });
        $$renderer3.option({ value: "dark" }, ($$renderer4) => {
          $$renderer4.push(`🌙 Dark`);
        });
        $$renderer3.option({ value: "system" }, ($$renderer4) => {
          $$renderer4.push(`🖥️ System`);
        });
      }
    );
    $$renderer2.push(`</div> <div><label for="dashboard-layout" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dashboard Layout</label> `);
    $$renderer2.select(
      {
        id: "dashboard-layout",
        value: uiSettings.dashboardLayout,
        class: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "grid" }, ($$renderer4) => {
          $$renderer4.push(`Grid`);
        });
        $$renderer3.option({ value: "list" }, ($$renderer4) => {
          $$renderer4.push(`List`);
        });
      }
    );
    $$renderer2.push(`</div></div></section> <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">⚙️ Behavior</h2> <div class="space-y-4"><div class="flex items-center"><input id="auto-save" type="checkbox"${attr("checked", uiSettings.autoSave, true)} class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/> <label for="auto-save" class="ml-2 text-sm text-gray-700 dark:text-gray-300">Auto-save changes</label></div></div></section> <section class="bg-white dark:bg-gray-800 rounded-lg shadow p-6"><h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">🔗 API Configuration</h2> <div class="space-y-4"><div><label for="api-endpoint" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">API Endpoint</label> <input id="api-endpoint" type="url"${attr("value", uiSettings.apiEndpoint)} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/></div></div></section> <section class="flex gap-4"><button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors">💾 Save Settings</button> <button class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors">🔄 Reset to Defaults</button> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></section></div>`);
  });
}
export {
  _page as default
};
