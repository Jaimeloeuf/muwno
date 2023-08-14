import type { ProductID } from "../Product/index.js";
import type { FeedbackResponseID } from "../Feedback/index.js";
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
  responseID: FeedbackResponseID;
  createdAt: ISODateTimeString;
  task: string;
  done: boolean;
};
