import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["@react-jvectormap/core"],
  },
  build: {
    // Use terser for JS minification (different minifier behavior)
    minify: "terser",
    // Raise the chunk size warning limit to reduce noisy warnings
    chunkSizeWarningLimit: 800,
    // Help Rollup split large vendor bundles into named chunks
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules")) {
            if (id.includes("@react-jvectormap")) return "vectormap";
            if (id.includes("react") || id.includes("react-dom")) return "react-vendors";
            return "vendor";
          }
        },
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
