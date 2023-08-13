import type { ProductID, Task } from 'domain-model';

/**
 * Data Repository interface used as an abstraction over a collection of
 * `Task` Entity objects regardless of the underlying datasource.
 */
export abstract class ITaskRepo {
  /**
   * Create a new Task in data source.
   */
  abstract createOne(productID: ProductID, task: Task['task']): Promise<Task>;
}
