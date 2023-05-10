// For Mono repos like this, vetur needs a config file at project root in order to find the package.json file of the vue app
// https://vuejs.github.io/vetur/guide/setup.html#advanced

/** @type {import('vls').VeturConfig} */
module.exports = {
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    "vetur.useWorkspaceDependencies": true,
    "vetur.experimental.templateInterpolationService": true,
  },

  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: [
    {
      // **required**
      // Where is your project?
      // It is relative to `vetur.config.js`.
      root: "./portal",
    },
    {
      // **required**
      // Where is your project?
      // It is relative to `vetur.config.js`.
      root: "./form",
    },
  ],
};
