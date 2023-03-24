import { defineConfig, loadEnv } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "SH_");

  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: "SH_",
  };

  if (mode === "development") {
    Object.assign(config, {
      server: {
        proxy: {
          [env.SH_PROXY_URL]: {
            target: env.SH_API_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(env.SH_PROXY_URL, ""),
          },
        },
      },
    });
  }

  return defineConfig(config);
};
