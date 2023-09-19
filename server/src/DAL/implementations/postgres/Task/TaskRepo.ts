import { Injectable } from '@nestjs/common';

import type {
  ITaskRepo,
  DBCreateOneTaskDTO,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Entity Types
import type { FeedbackResponseID, ProductID, TaskID } from 'domain-model';

// Mappers
import { mapTaskModelToEntity, mapTaskModelsToEntity } from './mapper.js';

// Utils
import { runMapperIfNotNull } from '../utils/runMapperIfNotNull.js';

@Injectable()
export class TaskRepo implements ITaskRepo {
  constructor(private readonly db: PrismaService) {}

  async createOne(createOneTaskDTO: DBCreateOneTaskDTO) {
    return this.db.task
      .create({ data: createOneTaskDTO })
      .then(mapTaskModelToEntity);
  }

  async getTasksOfResponse(responseID: FeedbackResponseID) {
    return this.db.task
      .findMany({ where: { responseID } })
      .then(mapTaskModelsToEntity);
  }

  async getTasksOfProduct(productID: ProductID, count: number) {
    return this.db.task
      .findMany({
        where: {
          productID,
          // Get all non completed tasks
          done: false,
        },

        // Sort by highest score and oldest first.
        orderBy: [
          { score: 'desc' },

          // Get the oldest task first so the task list will not keep changing
          // unless the user actually marks the oldest task as done.
          { createdAt: 'asc' },
        ],

        take: count,
      })
      .then(mapTaskModelsToEntity);
  }

  async getTaskProduct(taskID: TaskID) {
    return this.db.task
      .findUnique({
        where: { id: taskID },
        select: {
          product: {
            select: { id: true },
          },
        },
      })
      .then(runMapperIfNotNull((task) => task.product.id));
  }

  async markTaskAsDone(taskID: TaskID) {
    await this.db.task.update({
      where: { id: taskID },
      data: { done: true },
    });
  }
}
