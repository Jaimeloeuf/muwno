import path from 'path';
import { existsSync } from 'fs';
import dotenv from 'dotenv';

export function loadEnvVarFromFile(nodeEnv: string) {
  const envFilePath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

  console.log(`Loading credentials from '${envFilePath}'`);

  if (!existsSync(envFilePath))
    throw new Error(`'${envFilePath}' does not exists!`);

  dotenv.config({ path: envFilePath });
}
