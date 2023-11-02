import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

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
import { optionallyPaginateWithCursor } from '../utils/optionallyPaginateWithCursor.js';

@Injectable()
export class TaskRepo implements ITaskRepo {
  constructor(private readonly db: PrismaService) {}

  async createOne(createOneTaskDTO: DBCreateOneTaskDTO) {
    return this.db.task
      .create({
        data: {
          id: createOneTaskDTO.id,
          score: createOneTaskDTO.score,
          task: createOneTaskDTO.task,
          response_id: createOneTaskDTO.responseID,
          product_id: createOneTaskDTO.productID,
        },
      })
      .then(mapTaskModelToEntity);
  }

  async getTask(id: TaskID) {
    return this.db.task
      .findUnique({ where: { id } })
      .then(runMapperIfNotNull(mapTaskModelToEntity));
  }

  async updateTask(id: TaskID, task: string) {
    await this.db.task.update({ where: { id }, data: { task } });
  }

  async getTasksOfResponse(response_id: FeedbackResponseID) {
    return this.db.task
      .findMany({ where: { response_id } })
      .then(mapTaskModelsToEntity);
  }

  async getTasksOfProduct(
    product_id: ProductID,
    count: number,
    optionalPaginationID?: TaskID,
  ) {
    const queryArgs = {
      where: {
        product_id,
        // Get all non completed tasks
        done: false,
      },

      // Sort by highest score and oldest first.
      orderBy: [
        { score: 'desc' },

        // Get the oldest task first so the task list will not keep changing
        // unless the user actually marks the oldest task as done.
        { created_at: 'asc' },
      ],

      take: count,
    } satisfies Prisma.taskFindManyArgs;

    return this.db.task
      .findMany(
        optionallyPaginateWithCursor(optionalPaginationID, queryArgs, {
          id: optionalPaginationID,
        }),
      )
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
