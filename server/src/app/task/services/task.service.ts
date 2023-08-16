import { Injectable } from '@nestjs/common';

import { ITaskRepo } from '../../../DAL/abstraction/index.js';
import { ProductService } from '../../product/services/product.service.js';
import { IAiService } from '../../../infra/abstractions/IAiService.js';

// Entity Types
import type {
  ProductID,
  FeedbackResponseID,
  Task,
  UserID,
  TaskID,
} from 'domain-model';

// DTO Types
import type { CreateOneFeedbackResponseDTO } from 'domain-model';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: ITaskRepo,
    private readonly productService: ProductService,
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

  /**
   * Get a list of tasks for the selected product.
   */
  async getTasks(
    requestorID: UserID,
    productID: ProductID,
    count: number,
  ): Promise<Array<Task>> {
    await this.productService.validateProductID(productID);

    return this.taskRepo.getMany(productID, count);
  }

  /**
   * Mark a single Task as done.
   */
  async markTaskAsDone(taskID: TaskID): Promise<void> {
    await this.taskRepo.markTaskAsDone(taskID);
  }
}
