import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  worker: { format: "es" },
  build: {
    target: "esnext",
  },
  logLevel: process.env.NODE_ENV === "development" ? "error" : "info",
});
