// As of time of commit, eslint does not support ESM configuration file
// https://eslint.org/docs/latest/use/configure/configuration-files#configuration-file-formats
module.exports = {
  // Limit ESLint for /server-nest/* to this specific config and stop looking into parent dir
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },

  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.eslint.json',
    sourceType: 'module',
  },

  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],

  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
