import { Injectable } from '@nestjs/common';

import type { ITaskRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { ProductID, Task } from 'domain-model';

// Mappers
import { mapTaskModelToEntity } from './mapper.js';

@Injectable()
export class TaskRepo implements ITaskRepo {
  constructor(private readonly db: PrismaService) {}

  async createOne(productID: ProductID, task: Task['task']) {
    return this.db.task
      .create({ data: { productID, task } })
      .then(mapTaskModelToEntity);
  }
}
