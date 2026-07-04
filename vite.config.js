import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    lightningcss: {
      // Safely tells LightningCSS to ignore Tailwind's custom v4 rules during build
      ignoredAtRules: ["theme"],
    },
  },
});
