import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
import basicSSL from "@vitejs/plugin-basic-ssl";

import childProcess from "child_process";

// Get git values to be use in the vue app
const gitValues = {
  commitHash: childProcess.execSync("git rev-parse HEAD").toString(),
  gitBranch: childProcess
    .execSync("git rev-parse --abbrev-ref HEAD")
    .toString(),
};

// https://vitejs.dev/config/
// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),

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
    "__vite_inject.commitHash": JSON.stringify(gitValues.commitHash),
    "__vite_inject.gitBranch": JSON.stringify(gitValues.gitBranch),
  },
}));
