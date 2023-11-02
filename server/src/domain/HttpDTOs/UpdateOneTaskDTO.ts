import type { Task } from '../Task/index.js';

/**
 * Update one Task in API service.
 */
export type UpdateOneTaskDTO = {
  task: Task['task'];
};
