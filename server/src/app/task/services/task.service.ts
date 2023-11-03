import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { ITaskRepo, IFeedbackRepo } from '../../../DAL/index.js';
import { ProductService } from '../../product/services/product.service.js';
import { IAiService } from '../../../infra/index.js';

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

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepo: ITaskRepo,
    private readonly feedbackRepo: IFeedbackRepo,
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

    return this.taskRepo.createOne({
      id: ulid(),
      productID,
      responseID,
      task: taskString,
      score: response.a1,
    });
  }

  /**
   * Get task.
   */
  async getTask(requestorID: UserID, taskID: TaskID): Promise<Task> {
    const task = await this.taskRepo.getTask(taskID);
    if (task === null)
      throw new NotFoundException(`Task '${taskID}' not found`);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, task.productID);

    return task;
  }

  /**
   * Update a task.
   */
  async updateTask(requestorID: UserID, taskID: TaskID, task: string) {
    const productID = await this.taskRepo.getTaskProduct(taskID);
    if (productID === null)
      throw new NotFoundException(`Task '${taskID}' not found`);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, productID);

    await this.taskRepo.updateTask(taskID, task);
  }

  /**
   * Delete task.
   */
  async deleteTask(requestorID: UserID, taskID: TaskID) {
    const productID = await this.taskRepo.getTaskProduct(taskID);
    if (productID === null)
      throw new NotFoundException(`Task '${taskID}' not found`);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, productID);

    await this.taskRepo.deleteTask(taskID);
  }

  /**
   * Get tasks of response.
   */
  async getTasksOfResponse(
    requestorID: UserID,
    responseID: FeedbackResponseID,
  ): Promise<Array<Task>> {
    const productID = await this.feedbackRepo.getResponseProduct(responseID);
    if (productID === null)
      throw new NotFoundException(`Response '${responseID}' not found`);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, productID);

    return this.taskRepo.getTasksOfResponse(responseID);
  }

  /**
   * Get tasks of product.
   */
  async getTasksOfProduct(
    requestorID: UserID,
    productID: ProductID,
    count: number,
    optionalPaginationID?: TaskID,
  ): Promise<Array<Task>> {
    await this.productService.validateProductID(productID);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, productID);

    return this.taskRepo.getTasksOfProduct(
      productID,
      count,
      optionalPaginationID,
    );
  }

  /**
   * Mark Task as done.
   */
  async markTaskAsDone(requestorID: UserID, taskID: TaskID): Promise<void> {
    const productID = await this.taskRepo.getTaskProduct(taskID);
    if (productID === null)
      throw new NotFoundException(`Task '${taskID}' not found`);

    // Validate if user can access this product, and in extension, its tasks.
    await this.productService.validateUserAccess(requestorID, productID);

    await this.taskRepo.markTaskAsDone(taskID);
  }
}
