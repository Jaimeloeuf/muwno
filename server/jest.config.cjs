// jest config is defined as a CJS file since server's package.json defines `type` as `module`
// Not using TS here as that requires `ts-node` dependency which is abit unnecessary.

// This Jest configuration only works with the `--experimental-vm-modules` node flag,
// to support the use of ESMs with Jest. See npm test script in package.json
//
// References:
// https://jestjs.io/docs/ecmascript-modules
// https://github.com/facebook/jest/issues/10025

// This preset does not work, therefore the properties for `extensionsToTreatAsEsm`,
// `moduleNameMapper` and `transform` is specified manually.
// Reference:  https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/
// preset: 'ts-jest/presets/default-esm',

/** @type {import('jest').Config} */
const config = {
  verbose: true,

  // Defaults to the root directory where jest.config.cjs is located at,
  // since Jest should be looking to test all the **/*.spec.ts files,
  // Jest should just scan for tests and modules within `src`.
  rootDir: 'src',

  // Jest runs .mjs / .js files as ES Modules when the nearest package.json's type
  // field is `module`, to run other files as ESM, specify their file extensions here.
  // https://jestjs.io/docs/next/configuration#extensionstotreatasesm-arraystring
  extensionsToTreatAsEsm: ['.ts'],

  // Module Name Mapper is required to import .js files after the initial import of
  // .ts files from the jest unit tests. Basically if a Jest unit test file imports
  // a file without any extension it will work, however when it tries to import any
  // other source file (which now all uses .js extension after the ESM migration) it
  // will fail without this mapping.
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Jest runs your code as JS with NodeJS, hence a transformer is needed if you use unsupported syntax such as JSX, TS, Vue SFC.
  // This only detects and transforms .ts files with ts-jest
  transform: {
    // Use '^.+\\.m?[tj]s$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.ts$': [
      'ts-jest',
      {
        // Use this instead of the base tsconfig
        tsconfig: 'tsconfig.test.json',
        useESM: true,
      },
    ],
  },

  /*
    This does not need to be specified in config file, when coverage is required,
    the npm script, test:coverage will pass in the --coverage flag. The config file
    just needs to make sure that the configs for coverage is correctly set.
    `collectCoverage: true,`
  */

  collectCoverageFrom: ['**/*.(t|j)s'],

  // `rootDir` is specified as 'src', therefore this needs to traverse to the parent
  // dir to save coverage data into the root direct of the server/ subrepo.
  coverageDirectory: '../coverage',
};

module.exports = config;
