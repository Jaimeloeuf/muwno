import { defineConfig } from "vite";
import path from "path";

import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import basicSSL from "@vitejs/plugin-basic-ssl";

import childProcess from "child_process";

// Create a version string using the git branch and hash
const gitVersion =
  childProcess.execSync("git rev-parse --abbrev-ref HEAD").toString() +
  " " +
  childProcess.execSync("git rev-parse HEAD").toString();

// https://vitejs.dev/config/
// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@domain-model": path.resolve(__dirname, "../domain/src/index.ts"),
    },
  },

  build: {
    // Need to be at least es2022 to support top level await used for stripe.
    target: "es2022",
  },

  plugins: [
    vue(),

    // Plugin to enable PWA usage
    VitePWA({
      // Allow PWA to be tested in development mode
      devOptions: { enabled: true },

      registerType: "autoUpdate",
      manifest: { name: "PMF" },
    }),

    // Enable https by default as ios requires https connections to give camera access
    // https://vitejs.dev/config/server-options.html#server-https
    // https://vitejs.dev/guide/migration.html#automatic-https-certificate-generation
    basicSSL(),
  ],

  // When deploying to Github pages, the base URL will be your repo's name,
  // Thus the production base URL must be changed here for it to work when deployed.
  // Ref: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site#next-steps
  // base: mode === "github-pages" ? "/your-github-repo-name/" : "/",

  // Replace these strings with the appropriate values during build time
  // Update `.eslintrc.cjs` and `env.d.ts` whenever new values are added to get typing and lint support
  define: {
    // CI/CD build server might not be in SG, so store date as ISO string, to create a new Date object when viewing to show time in user's locale
    "__vite_inject.buildTime": JSON.stringify(new Date()),
    "__vite_inject.version": JSON.stringify(gitVersion),
  },
}));
