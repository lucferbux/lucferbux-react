import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

/**
 * `VITE_FIXTURE_DATA=1` swaps the Firestore data source for the in-memory seed
 * corpus. Aliasing (rather than branching at runtime) guarantees the fixture
 * module and its JSON never reach a production bundle.
 */
const dataSourceImpl =
  process.env.VITE_FIXTURE_DATA === "1"
    ? "./src/data/source/fixture.ts"
    : "./src/data/source/firestore.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // `src/registerServiceWorker.ts` does the registering. The script this
      // plugin injects otherwise is a bare `register('/sw.js')` with no update
      // handling at all, and having both would register twice.
      injectRegister: null,
      includeAssets: [
        "favicon.svg",
        "favicon-32x32.png",
        "icons/*.png",
        "images/**/*.svg",
        "images/**/*.png",
      ],
      manifest: {
        name: "Lucferbux Web",
        short_name: "Lucferbux",
        description: "Personal PWA",
        theme_color: "#c98c31",
        background_color: "#F2F6FF",
        display: "standalone",
        start_url: "/",
        // Keep the Play Store listing discoverable, but do not steer browsers
        // away from installing the PWA itself.
        prefer_related_applications: false,
        related_applications: [
          { platform: "play", id: "com.lucferbux.lucferbux" },
        ],
        icons: [
          {
            src: "icons/icon-48x48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icons/icon-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
          {
            src: "icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "firestore-api",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:woff2?|ttf|eot)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@datasource": path.resolve(__dirname, dataSourceImpl),
    },
  },
  build: {
    outDir: "dist",
    // "hidden" emits maps for error reporting without advertising them to
    // visitors via a sourceMappingURL comment.
    sourcemap: "hidden",
  },
  server: {
    port: 5173,
  },
});
