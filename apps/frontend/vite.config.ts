import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8081,
  },
  plugins: [react()],
  resolve: {
    // See: https://github.com/vitejs/vite/issues/9986
    preserveSymlinks: true,
  },
});
