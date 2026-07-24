import { defineConfig } from "vitest/config";
import path from "node:path";

// Deliberately separate from vite.config.ts: that file is managed by
// @lovable.dev/vite-tanstack-config and warns against adding plugins manually.
// Test config has no need for the TanStack Start / nitro build plugins anyway.
export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
