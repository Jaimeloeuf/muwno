import { Injectable } from '@nestjs/common';

import type {
  ITaskRepo,
  DBCreateOneTaskDTO,
} from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

// Mappers
import { mapTaskModelToEntity } from './mapper.js';

@Injectable()
export class TaskRepo implements ITaskRepo {
  constructor(private readonly db: PrismaService) {}

  async createOne(createOneTaskDTO: DBCreateOneTaskDTO) {
    return this.db.task
      .create({ data: createOneTaskDTO })
      .then(mapTaskModelToEntity);
  }
}
