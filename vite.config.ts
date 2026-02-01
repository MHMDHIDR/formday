import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png", "logo.png"],
      manifest: {
        id: "/formday-pwa",
        name: "Formday - Fitness Tracker",
        short_name: "Formday",
        description:
          "Track your workouts and meals with Formday. Progress, not perfection. Works completely offline.",
        start_url: "/",
        scope: "/",
        display: "standalone",
        display_override: ["standalone", "minimal-ui"],
        background_color: "#0f172a",
        theme_color: "#0f172a",
        orientation: "portrait",
        dir: "ltr",
        lang: "en",
        prefer_related_applications: false,
        categories: ["fitness", "health", "lifestyle", "productivity"],
        icons: [
          {
            src: "/icons/192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/192-maskable.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Today's Plan",
            short_name: "Today",
            description: "View today's workout and meal plan",
            url: "/",
            icons: [{ src: "/icons/192.png", sizes: "192x192" }],
          },
          {
            name: "Calendar",
            short_name: "Calendar",
            description: "View your fitness calendar",
            url: "/calendar",
            icons: [{ src: "/icons/192.png", sizes: "192x192" }],
          },
          {
            name: "Workouts",
            short_name: "Workouts",
            description: "Manage your workout plans",
            url: "/workout",
            icons: [{ src: "/icons/192.png", sizes: "192x192" }],
          },
          {
            name: "Meals",
            short_name: "Meals",
            description: "Manage your meal plans",
            url: "/meals",
            icons: [{ src: "/icons/192.png", sizes: "192x192" }],
          },
        ],
      },
      workbox: {
        // Cache all assets for offline use
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        // Runtime caching for navigation
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "pages",
              networkTimeoutSeconds: 3,
            },
          },
        ],
        // Don't cache node_modules or dev files
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
      },
      devOptions: {
        enabled: true, // Enable PWA in development for testing
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
