import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,   // bind to 0.0.0.0 for Docker dev usage
    open: false
  },
  preview: {
    port: 5173,
    host: "0.0.0.0"  // required so the container is reachable from host
  }
});
