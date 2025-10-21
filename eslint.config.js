import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

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
      ".svelte-kit/",
      // Exclude legacy Vue packages from linting
      "cards-vue/**",
      "graph-vue/**",
      "shared-vue/**",
    ],
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // Svelte recommended rules
  ...svelte.configs["flat/recommended"],
  // Ensure Svelte uses TS parser for <script lang="ts">
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".svelte"],
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: { ...globals.browser, process: "readonly" },
    },
  },
  // TypeScript rules
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: { ...globals.browser, process: "readonly" },
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  // JS/Vue defaults
  {
    files: ["**/*.js", "**/*.vue"],
    languageOptions: { globals: { ...globals.browser, process: "readonly" } },
  },
];
