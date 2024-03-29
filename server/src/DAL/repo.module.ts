import { Module } from '@nestjs/common';

/* Data Sources */
import { PrismaService } from './implementations/postgres/prisma.service.js';

/* Abstractions */
import {
  IUserRepo,
  IOrgRepo,
  IProductRepo,
  IPmfscoreRepo,
  IFeedbackRepo,
  ITeamRepo,
  ITaskRepo,
  ICustomerRepo,
  IApiKeyRepo,
  ISubscriptionRepo,
  IStripeCustomerRepo,
  IStripeWebhookEventRepo,
  IStripeSetupNextRepo,
} from './abstraction/index.js';

/* Implementations */
import {
  UserRepo,
  OrgRepo,
  ProductRepo,
  PmfscoreRepo,
  FeedbackRepo,
  TeamRepo,
  TaskRepo,
  CustomerRepo,
  ApiKeyRepo,
  SubscriptionRepo,
  StripeCustomerRepo,
  StripeWebhookEventRepo,
  StripeSetupNextRepo,
} from './implementations/postgres/index.js';

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
    { provide: IUserRepo, useClass: UserRepo },
    { provide: IOrgRepo, useClass: OrgRepo },
    { provide: IProductRepo, useClass: ProductRepo },
    { provide: IPmfscoreRepo, useClass: PmfscoreRepo },
    { provide: IFeedbackRepo, useClass: FeedbackRepo },
    { provide: ITeamRepo, useClass: TeamRepo },
    { provide: ITaskRepo, useClass: TaskRepo },
    { provide: ICustomerRepo, useClass: CustomerRepo },
    { provide: IApiKeyRepo, useClass: ApiKeyRepo },
    { provide: ISubscriptionRepo, useClass: SubscriptionRepo },
    { provide: IStripeCustomerRepo, useClass: StripeCustomerRepo },
    { provide: IStripeWebhookEventRepo, useClass: StripeWebhookEventRepo },
    { provide: IStripeSetupNextRepo, useClass: StripeSetupNextRepo },
  ],

  exports: [
    /* Export all data repos using the Abstraction classes as injection token */
    IUserRepo,
    IOrgRepo,
    IProductRepo,
    IPmfscoreRepo,
    IFeedbackRepo,
    ITeamRepo,
    ITaskRepo,
    ICustomerRepo,
    IApiKeyRepo,
    ISubscriptionRepo,
    IStripeCustomerRepo,
    IStripeWebhookEventRepo,
    IStripeSetupNextRepo,
  ],
})
export class RepoModule {}
