import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import basicSSL from "@vitejs/plugin-basic-ssl";

import childProcess from "child_process";

// Create a version string using the git branch and hash
const gitVersion =
  childProcess.execSync("git rev-parse HEAD").toString() +
  " " +
  childProcess.execSync("git rev-parse --abbrev-ref HEAD").toString();

// https://vitejs.dev/config/
// https://vitejs.dev/config/#conditional-config
export default defineConfig({
  plugins: [
    vue(),

    // Enable https by default as ios requires https connections to give camera access
    // https://vitejs.dev/config/server-options.html#server-https
    // https://vitejs.dev/guide/migration.html#automatic-https-certificate-generation
    basicSSL(),
  ],

  // Replace these strings with the appropriate values during build time
  // Update `.eslintrc.cjs` and `env.d.ts` whenever new values are added to get typing and lint support
  define: {
    // CI/CD build server might not be in SG, so store date as ISO string, to create a new Date object when viewing to show time in user's locale
    "__vite_inject.buildTime": JSON.stringify(new Date()),
    "__vite_inject.version": JSON.stringify(gitVersion),
  },
});
