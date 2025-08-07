import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /*  server: {
    port: 6600,
    host: "192.168.100.254",
  }, */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
