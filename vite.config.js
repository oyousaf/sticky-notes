import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.API_BASE_URL || "http://204.168.141.215:3002/api/notes";
  return {
    plugins: [react()],
    server: { proxy: { "/api/notes": { target: backend, changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/notes/, "") } } },
    build: { target: "es2022", sourcemap: false },
  };
});
