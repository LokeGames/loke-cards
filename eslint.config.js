import globals from "globals";
import pluginJs from "@eslint/js";
// Vue plugin removed; legacy Vue folders are ignored
import svelte from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "**/dist/**",
      "**/build/**",
      "**/.vite/**",
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
      "**/coverage/**",
      ".nyc_output/",
      "*.tmp",
      "*.temp",
      "**/.cache/**",
      "**/playwright-report/**",
      "**/test-results/**",
      "**/.svelte-kit/**",
      "**/server/**",
      // Exclude legacy Vue packages from linting
      "cards-vue/**",
      "graph-vue/**",
      "shared-vue/**",
    ],
  },
  pluginJs.configs.recommended,
  // Vue rules removed
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
    rules: {
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-unused-vars": "off",
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
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-empty": ["error", { "allowEmptyCatch": true }]
    },
  },
  // Test files (Vitest globals)
  {
    files: ["**/*.test.*"],
    languageOptions: {
      globals: { ...globals.browser, describe: "readonly", test: "readonly", expect: "readonly" },
    },
  },
  // Node scripts
  {
    files: ["scripts/**/*.{js,cjs}", "*.cjs"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  // JS/Vue defaults
  {
    files: ["**/*.js", "**/*.vue"],
    languageOptions: { globals: { ...globals.browser, process: "readonly" } },
  },
];
