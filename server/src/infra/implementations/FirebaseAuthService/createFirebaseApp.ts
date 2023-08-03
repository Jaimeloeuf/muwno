import { Logger } from '@nestjs/common';
import type { ServiceAccount } from 'firebase-admin/app';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';

/**
 * Utility function to create Firebase app.
 *
 * This initializes the default firebase app. `initializeApp` will only be
 * called once over here in the entire NestJS application. All other providers
 * that provide a firebase module needs to be loaded after this provider.
 */
export async function createFirebaseApp() {
  const logger = new Logger(createFirebaseApp.name);

  // @todo Use config service instead
  if (process.env['GCP']) {
    logger.log('Running on GCP as indicated by GCP env var, using ADC now...');

    return initializeApp({ credential: applicationDefault() });
  }

  logger.log('Not running on GCP, attempting to read service account key...');

  // If service is not being ran on GCP platform through an explicit
  // `GCP` environment variable, ADC will not be used, instead the
  // `serviceAccountKey.json` file is expected to be packaged together
  // with the final deployed code. JSON file format is preferred over
  // environment variables as it is platform agnostic and will always
  // work the same way.
  //
  // If the file is not available, it will error out and the API service
  // will stop running.
  //
  // Since `NodeNext` + `ES2020` module resolution is used, import will
  // be namespaced under `default`, which is renamed to be more explicit,
  // and the JSON import type assertion is also required.
  const { default: serviceAccount } = await import(
    '../../../../serviceAccountKey.json',
    { assert: { type: 'json' } }
  );

  return initializeApp({ credential: cert(serviceAccount as ServiceAccount) });
}
