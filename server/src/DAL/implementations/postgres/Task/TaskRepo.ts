import { Injectable } from '@nestjs/common';

import type {
  ITaskRepo,
  DBCreateOneTaskDTO,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { ProductID, TaskID } from 'domain-model';

// Mappers
import { mapTaskModelToEntity, mapTaskModelsToEntity } from './mapper.js';

@Injectable()
export class TaskRepo implements ITaskRepo {
  constructor(private readonly db: PrismaService) {}

  async createOne(createOneTaskDTO: DBCreateOneTaskDTO) {
    return this.db.task
      .create({ data: createOneTaskDTO })
      .then(mapTaskModelToEntity);
  }

  async getMany(productID: ProductID, count: number) {
    return this.db.task
      .findMany({
        where: {
          productID,
          // Get all non completed tasks
          done: false,
        },

        orderBy: {
          // Get the oldest task first, so the task list will not keep changing
          // unless the user actually marks the oldest task as done.
          createdAt: 'asc',

          // Sort by task with highest score first.
          score: 'desc',
        },

        take: count,
      })
      .then(mapTaskModelsToEntity);
  }

  async markTaskAsDone(taskID: TaskID) {
    await this.db.task.update({
      where: { id: taskID },
      data: { done: true },
    });
  }
}
