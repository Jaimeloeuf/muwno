import type { OrgID } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over the underlying
 * datasource to work with an `Org`'s subscription status.
 */
export abstract class ISubscriptionRepo {
  /**
   * Check if the `Org` is subscribed.
   *
   * @todo
   * If Org does not exist, returns false instead of throwing an error
   */
  abstract isSubscribed(orgID: OrgID): Promise<boolean>;

  /**
   * Activate the `Org`'s subscription.
   */
  abstract activateSubscription(orgID: OrgID): Promise<void>;

  /**
   * Deactivate the `Org`'s subscription.
   */
  abstract deactivateSubscription(orgID: OrgID): Promise<void>;
}
