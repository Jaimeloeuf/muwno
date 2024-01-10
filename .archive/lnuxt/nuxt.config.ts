// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
  },

  devServer: {
    https: true,
  },

  typescript: {
    // If you have enabled Take Over Mode or installed the TypeScript Vue Plugin
    // (Volar), you can disable generating the shim for *.vue files.
    shim: false,

    // To enable type-checking at build time.
    typeCheck: true,

    // Use strict type checking since nuxt does not use this by default.
    strict: true,
  },

  router: {
    options: {
      // Not using this cos for eg when navigating to the About Us page
      // it always flashes the root page first before using JS to replace it
      // with the About us page....
      // Assumption is cos the default index.html sent from server is SSR of
      // the root page, while in the original SPA version, it sent down an empty
      // index.html so user dont see anything until the about us page is rendered.
      // hashMode: true,
    },
  },

  modules: ["@nuxtjs/tailwindcss"],

  srcDir: "./",

  alias: {
    "@domain-model": "../server/src/domain/index.ts",
  },
});
