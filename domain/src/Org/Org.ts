import type { ISODateTimeString } from "../utils/Timestamp.js";
import type { SubscriptionPlan } from "../SubscriptionPlan/index.js";

/**
 * Type to represent a single Org.
 */
export type Org = {
  /**
   * Unique ID for this Org
   */
  id: string;
  createdAt: ISODateTimeString;
  name: string;
  email: string;
  plan: SubscriptionPlan | null;
  verified: boolean;
};

/**
 * Type alias for `Org['id']` where all orgIDs will follow the same type.
 */
export type OrgID = Org["id"];
