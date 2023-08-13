import type { task as TaskModel } from '@prisma/client';
import type { Task } from 'domain-model';

export const mapTaskModelToEntity = (taskModel: TaskModel): Task => ({
  ...taskModel,
  createdAt: taskModel.createdAt.toISOString(),
});
