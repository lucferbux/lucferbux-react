import { defineConfig, type Plugin } from "vite";
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

/**
 * Content-Security-Policy, injected into the built `index.html` as a <meta>.
 *
 * Build-only: the dev server relies on an inline React refresh preamble. As a
 * <meta> rather than a Netlify header it binds the document but not `/sw.js`,
 * whose runtime image cache must fetch images from any https origin (see the
 * note in netlify.toml). `frame-ancestors` is not honoured in a <meta>, so
 * X-Frame-Options carries that rule.
 *
 * - script-src has no 'unsafe-inline': the build emits no inline script, and
 *   that is what makes an injected <script> or `on*=` attribute inert.
 * - style-src needs 'unsafe-inline': typewriter-effect injects a <style>.
 * - img-src allows any https origin: post bodies embed images from dev.to,
 *   GitHub and Firebase Storage, and admins can paste image URLs.
 * - connect-src lists exactly what the Firebase SDK talks to (Firestore,
 *   Storage uploads, email/password Auth and token refresh).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://firestore.googleapis.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com",
  "frame-src https://codepen.io",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const contentSecurityPolicy: Plugin = {
  name: "content-security-policy",
  apply: "build",
  transformIndexHtml: () => [
    {
      tag: "meta",
      attrs: { "http-equiv": "Content-Security-Policy", content: CSP },
      injectTo: "head-prepend",
    },
  ],
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    contentSecurityPolicy,
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
      "@": path.resolve(import.meta.dirname, "./src"),
      "@datasource": path.resolve(import.meta.dirname, dataSourceImpl),
    },
  },
  build: {
    outDir: "dist",
    // "hidden" emits maps for error reporting without advertising them to
    // visitors via a sourceMappingURL comment.
    sourcemap: "hidden",
    rolldownOptions: {
      output: {
        // Vendor code changes far less often than the app, so separate chunks
        // keep it cached across deploys. Auth and Storage get their own groups
        // so that they stay with the lazily loaded admin instead of riding
        // along with Firestore into every visitor's download.
        //
        // A group also captures its dependencies, so the core group must claim
        // the shared Firebase modules (app, util, component) first — hence the
        // priorities. Otherwise the auth chunk swallows them, Firestore imports
        // from it, and Auth is back in the eager graph.
        codeSplitting: {
          groups: [
            {
              name: "react",
              priority: 30,
              test: /node_modules[\\/](react|react-dom|scheduler|react-router)[\\/]/,
            },
            {
              name: "firebase",
              priority: 20,
              test: /node_modules[\\/](@firebase[\\/](?!auth|storage)|firebase[\\/](?!auth|storage))/,
            },
            {
              name: "firebase-auth",
              priority: 10,
              test: /node_modules[\\/](@firebase[\\/]auth|firebase[\\/]auth)[\\/]/,
            },
            {
              name: "firebase-storage",
              priority: 10,
              test: /node_modules[\\/](@firebase[\\/]storage|firebase[\\/]storage)[\\/]/,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
