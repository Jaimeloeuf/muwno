import type { task as TaskModel } from '@prisma/client';
import type { Task } from 'domain-model';

export const mapTaskModelToEntity = (taskModel: TaskModel): Task => ({
  ...taskModel,
  createdAt: taskModel.createdAt.toISOString(),

  // Type cast is safe here since there is validation on DB write already.
  score: taskModel.score as 1 | 2 | 3,
});

export const mapTaskModelsToEntity = (
  taskModels: Array<TaskModel>,
): Array<Task> => taskModels.map(mapTaskModelToEntity);
