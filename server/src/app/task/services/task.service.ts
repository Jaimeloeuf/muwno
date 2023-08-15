import { Injectable } from '@nestjs/common';

import { ITaskRepo } from '../../../DAL/abstraction/index.js';
import { IAiService } from '../../../infra/abstractions/IAiService.js';

// Entity Types
import type { ProductID, FeedbackResponseID, Task } from 'domain-model';

// DTO Types
import type { CreateOneFeedbackResponseDTO } from 'domain-model';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: ITaskRepo,
    private readonly aiService: IAiService,
  ) {}

  /**
   * Create a new task using customer's survey response if possible.
   */
  async createOne(
    productID: ProductID,
    responseID: FeedbackResponseID,
    response: CreateOneFeedbackResponseDTO,
  ): Promise<Task | null> {
    const customerFeedback = response.a4;

    // If the customer feedback is invalid, do nothing and return null since
    // no Task Entity object is created.
    if (await this.aiService.isInvalidCustomerFeedback(customerFeedback))
      return null;

    const taskString = await this.aiService.getActionableTask(customerFeedback);

    return this.taskRepo.createOne({ productID, responseID, task: taskString });
  }
}
