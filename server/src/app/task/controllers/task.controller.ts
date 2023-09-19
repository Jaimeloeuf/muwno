import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { TaskService } from '../services/task.service.js';

import { GuardWithRBAC, AllowAllRoles, JWT_uid } from '../../../rbac/index.js';

// Entity Types
import type {
  FirebaseAuthUID,
  FeedbackResponseID,
  ProductID,
  TaskID,
} from 'domain-model';

// DTO Types
import type { ReadManyTaskDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('task')
@GuardWithRBAC()
@UseHttpControllerFilters
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Get tasks of response.
   */
  @Get('of-response/:responseID')
  @AllowAllRoles
  async getTasksOfResponse(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('responseID') responseID: FeedbackResponseID,
  ): Promise<ReadManyTaskDTO> {
    return this.taskService
      .getTasksOfResponse(requestorID, responseID)
      .then((tasks) => ({ tasks }));
  }

  /**
   * Get tasks of product.
   *
   * Use required URL query param to specify how many tasks to load, can be
   * between 3 for card showing most important tasks or to 25 when seeing all
   * and doing pagination.
   *
   * @todo Add pagination support
   */
  @Get('of-product/:productID')
  @AllowAllRoles
  async getTasksOfProduct(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('count', ParseIntPipe) count: number,
  ): Promise<ReadManyTaskDTO> {
    if (count > 25)
      throw new BadRequestException(
        `Cannot request for more than 25 tasks at a time. Requested for ${count}`,
      );

    return this.taskService
      .getTasksOfProduct(requestorID, productID, count)
      .then((tasks) => ({ tasks }));
  }

  /**
   * Mark Task as done.
   */
  @Post('done/:taskID')
  @AllowAllRoles
  async markTaskAsDone(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('taskID') taskID: TaskID,
  ): Promise<void> {
    await this.taskService.markTaskAsDone(requestorID, taskID);
  }
}
