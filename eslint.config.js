import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

export default [
  {
    ignores: [
      "node_modules/",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "dist/",
      "build/",
      ".vite/",
      ".env",
      ".env.local",
      ".env.*.local",
      ".vscode/",
      ".idea/",
      "*.suo",
      "*.ntvs*",
      "*.njsproj",
      "*.sln",
      "*.sw?",
      "*.code-workspace",
      ".DS_Store",
      "Thumbs.db",
      "logs/",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "coverage/",
      ".nyc_output/",
      "*.tmp",
      "*.temp",
      ".cache/",
      "playwright-report/",
      "test-results/",
    ],
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ["**/*.js", "**/*.vue"],
    languageOptions: { globals: { ...globals.browser, process: "readonly" } },
  },
];
