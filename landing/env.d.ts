/// <reference types="vite/client" />

// Use this to define type for `import.meta.env`, which corresponds to env variables defined in a .env file
// By doing this, your source files will get type information for env variables.
// Location of this file is defined in tsconfig.json
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_LOGIN_LINK: string;
  readonly VITE_SIGNUP_LINK: string;
  readonly VITE_DEMO_YT_LINK: string;

  // Add more env variables as needed...
}

// Use this to define type for `import.meta`
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add type declaration for global constants that are set using the `define` prop in vite.config.ts
// E.g. `__vite_inject.buildTime`
declare const __vite_inject: {
  readonly buildTime: string;
  readonly version: string;
};
