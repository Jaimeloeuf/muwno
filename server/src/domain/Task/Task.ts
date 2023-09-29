import type { ProductID } from '../Product/index.js';
import type { FeedbackResponseID } from '../Feedback/index.js';
import type { ISODateTimeString } from '../utils/Timestamp.js';

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
  score: 1 | 2 | 3;
  task: string;
  done: boolean;
};

/**
 * Type alias for `Task['id']` where all TaskIDs will follow the same type.
 */
export type TaskID = Task['id'];
