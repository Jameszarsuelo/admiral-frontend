import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (id.includes("react-dom") || id.includes("react/jsx-runtime") || id.includes("react")) {
            return "react-vendor";
          }

          if (id.includes("react-router")) {
            return "router-vendor";
          }

          if (id.includes("@tanstack")) {
            return "tanstack-vendor";
          }

          if (
            id.includes("react-hook-form") ||
            id.includes("@hookform") ||
            id.includes("zod")
          ) {
            return "forms-vendor";
          }

          if (id.includes("flatpickr")) {
            return "date-picker-vendor";
          }

          if (id.includes("apexcharts") || id.includes("react-apexcharts")) {
            return "charts-vendor";
          }

          if (id.includes("swiper")) {
            return "swiper-vendor";
          }

          if (
            id.includes("@fullcalendar") ||
            id.includes("react-dnd") ||
            id.includes("react-dropzone")
          ) {
            return "interaction-vendor";
          }

          if (id.includes("@radix-ui")) {
            return "radix-vendor";
          }

          if (id.includes("@heroicons") || id.includes("lucide-react")) {
            return "icons-vendor";
          }

          if (id.includes("sonner")) {
            return "toast-vendor";
          }

          return "vendor";
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
