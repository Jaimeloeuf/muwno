import type { Task, ProductID, TaskID } from 'domain-model';

export type DBCreateOneTaskDTO = Omit<Task, 'id' | 'createdAt' | 'done'>;

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
   * Get many Tasks of the selected product from data source.
   */
  abstract getMany(productID: ProductID, count: number): Promise<Array<Task>>;

  /**
   * Mark a task as done in data source.
   */
  abstract markTaskAsDone(taskID: TaskID): Promise<void>;
}
