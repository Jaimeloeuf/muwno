import type { Task, FeedbackResponseID, ProductID, TaskID } from 'domain-model';

export type DBCreateOneTaskDTO = Omit<Task, 'createdAt' | 'done'>;

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Task` Entity objects regardless of the underlying datasource.
 */
export abstract class ITaskRepo {
  /**
   * Create a new Task in data source.
   */
  abstract createOne(createOneTaskDTO: DBCreateOneTaskDTO): Promise<Task>;

  /**
   * Get Tasks of response from data source.
   */
  abstract getTasksOfResponse(
    responseID: FeedbackResponseID,
  ): Promise<Array<Task>>;

  /**
   * Get Tasks of product from data source.
   */
  abstract getTasksOfProduct(
    productID: ProductID,
    count: number,
    optionalPaginationID?: TaskID,
  ): Promise<Array<Task>>;

  /**
   * Mark a task as done in data source.
   */
  abstract getTaskProduct(taskID: TaskID): Promise<ProductID | null>;

  /**
   * Mark a task as done in data source.
   */
  abstract markTaskAsDone(taskID: TaskID): Promise<void>;
}
