import type { ProductID } from "../Product/index.js";
import type { ISODateTimeString } from "../utils/Timestamp.js";

/**
 * Type to represent a single Task.
 */
export type Task = {
  /**
   * Unique ID for this Task
   */
  id: string;
  productID: ProductID;
  createdAt: ISODateTimeString;
  task: string;
  done: boolean;
};
