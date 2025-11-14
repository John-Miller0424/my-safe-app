import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy": "frame-ancestors https://app.safe.global",
      "X-Frame-Options": "ALLOWALL",
    },
  },
});
