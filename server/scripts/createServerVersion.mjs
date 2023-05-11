import childProcess from 'child_process';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

/**
 * Function to create and save API service version into dist/.env file
 * using git branch and commit hash.
 */
function writeServerVersion() {
  try {
    const gitBranch = childProcess
      .execSync('git rev-parse --abbrev-ref HEAD')
      .toString()
      .replace('\n', '');

    const commitHash = childProcess
      .execSync('git rev-parse HEAD')
      .toString()
      .replace('\n', '');

    writeFileSync(
      // Since this is a ES module, `__dirname` is not defined, so this is used to
      // achieve the same result, to create a reference to the dist/.env file.
      // Ref: https://bobbyhadz.com/blog/javascript-dirname-is-not-defined-in-es-module-scope
      join(dirname(fileURLToPath(import.meta.url)), '../dist/.env'),

      // Write the string in the format expected of env variables.
      `version=${gitBranch}-${commitHash}`,
    );
  } catch (error) {
    console.error('Failed to write API server version to dist/.env');
    console.error(error);
  }
}

writeServerVersion();
