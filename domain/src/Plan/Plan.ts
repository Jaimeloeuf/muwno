import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent a single subscription Plan.
 */
export type Plan = {
  /**
   * Unique ID for this Plan
   */
  id: number;
  createdAt: ISODateTimeString;
  name: string;
  active: boolean;
};

/**
 * Type alias for `Plan['id']` where all planIDs will follow the same type.
 */
export type PlanID = Plan["id"];
