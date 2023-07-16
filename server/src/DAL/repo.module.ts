import { Module } from '@nestjs/common';

/* Data Sources */
import { PrismaService } from './implementations/postgres/prisma.service.js';

/* Abstractions */
import { IOrgRepo } from './abstraction/index.js';

/* Implementations */
import { OrgRepo } from './implementations/postgres/index.js';

/**
 * Module for managing all the data repositories.
 *
 * @todo
 * Technically there should be one of these Module for each implementation type,
 * so that they can inject the data source ONLY for that implementation type.
 * i.e. only inject PrismaService for postgres data repo implementations.
 * This is especially helpful where there are many repo implementation types.
 */
@Module({
  providers: [
    // Inject Prisma Service
    PrismaService,

    /**
     * Explicitly specify the Abstractions and its Implementations to register
     * the implementations for exporting from this module, so that other modules
     * can import the repos using the abstraction classes as injection token.
     */
    { provide: IOrgRepo, useClass: OrgRepo },
  ],

  exports: [
    /* Export all data repos using the Abstraction classes as injection token */
    IOrgRepo,
  ],
})
export class RepoModule {}
