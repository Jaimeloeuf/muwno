import { Injectable } from '@nestjs/common';

import { ITaskRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { ProductID, Task } from 'domain-model';

// DTO Types
import type { CreateOneFeedbackResponseDTO } from 'domain-model';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: ITaskRepo) {}

  /**
   */
  async createOne(
    productID: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ): Promise<Task> {
    // @todo Call OpenAI API to generate the actionable task
    const task = response.a4;

    return this.taskRepo.createOne(productID, task);
  }
}
