import type { Task } from "../Task/index.js";

/**
 * Read many Tasks from API service.
 */
export type ReadManyTaskDTO = {
  tasks: Array<Task>;
};
