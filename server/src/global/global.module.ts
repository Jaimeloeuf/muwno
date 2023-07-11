import { Module, Global, Logger, type Provider } from '@nestjs/common';

// Infra providers
// import { RepoModule } from '../DAL/repo.module.js';
// import { AuthServiceProvider } from '../infra/providers/index.js';

/**
 * A list of providers that should be shared globally for all other modules
 * to use directly without having to manually import these common providers.
 */
const GloballySharedProviders: Provider[] = [
  Logger /* , AuthServiceProvider */,
];

/**
 * global.module to combine all the providers that should be available in the
 * global scope for all other modules to use.
 *
 * All the providers will be exported to be used globally since `providers`
 * and `exports` share the same array of providers.
 *
 * Reference: https://docs.nestjs.com/modules
 */
@Global()
@Module({
  // imports: [RepoModule],

  providers: GloballySharedProviders,

  exports: GloballySharedProviders,
  // RepoModule needs to be global so that the feature modules do not need to import it one by one
  // .concat([RepoModule]),
})
export class GlobalModule {}
