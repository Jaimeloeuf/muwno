import type { Task } from 'domain-model';

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
}
