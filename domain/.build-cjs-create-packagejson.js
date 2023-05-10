import { mkdirSync, writeFileSync } from "fs";

// Create the directory if it doesnt exist already
mkdirSync("./dist-cjs/", { recursive: true });

// Write the package.json file to just include CJS module type
writeFileSync("./dist-cjs/package.json", JSON.stringify({ type: "commonjs" }));
