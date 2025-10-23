import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "@ui": fileURLToPath(new URL("../../packages/ui/src", import.meta.url)),
      "@loke/ui": fileURLToPath(new URL("../../packages/ui/src", import.meta.url)),
      "@schemas": fileURLToPath(
        new URL("../../packages/schemas/src", import.meta.url),
      ),
      "@loke/apps-cards": fileURLToPath(
        new URL("../cards/src", import.meta.url),
      ),
      "@loke/apps-graph": fileURLToPath(
        new URL("../graph/src", import.meta.url),
      ),
      "@loke/shared": fileURLToPath(
        new URL("../shared/src", import.meta.url),
      ),
    },
  },
  server: {
    port: 5183,
    fs: {
      allow: [repoRoot],
    },
  },
});
