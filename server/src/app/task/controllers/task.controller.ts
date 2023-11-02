import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { TaskService } from '../services/task.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type {
  FirebaseAuthUID,
  FeedbackResponseID,
  ProductID,
  TaskID,
} from 'domain-model';

// DTO Types
import type { ReadManyTaskDTO, ReadOneTaskDTO } from 'domain-model';

// DTO Validators
import { ValidatedUpdateOneTaskDTO } from '../dto-validation/ValidatedUpdateOneTaskDTO.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('task')
@GuardWithRBAC()
@UseHttpControllerFilters
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /**
   * Get task.
   */
  @Get(':taskID')
  @AllowAllRoles
  async getTask(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('taskID') taskID: TaskID,
  ): Promise<ReadOneTaskDTO> {
    return this.taskService
      .getTask(requestorID, taskID)
      .then((task) => ({ task }));
  }

  /**
   * Update a task.
   */
  @Patch(':taskID')
  @AllowAllRoles
  async updateTask(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('taskID') taskID: TaskID,
    @Body() validatedUpdateOneTaskDTO: ValidatedUpdateOneTaskDTO,
  ): Promise<void> {
    await this.taskService.updateTask(
      requestorID,
      taskID,
      validatedUpdateOneTaskDTO.task,
    );
  }

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
   * Use required URL query param to specify how many tasks to load (up to 15).
   */
  @Get('of-product/:productID')
  @AllowAllRoles
  async getTasksOfProduct(
    @JWT_uid requestorID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
    @Query('count', ParseIntPipe) count: number,
    @Query('paginationID') optionalPaginationID?: TaskID,
  ): Promise<ReadManyTaskDTO> {
    // Must be within +/-15 since negative values are used to paginate backwards
    if (count > 15 || count < -15)
      throw new BadRequestException(
        `Cannot request for more than 15 tasks at a time. Requested for ${count}`,
      );

    return this.taskService
      .getTasksOfProduct(requestorID, productID, count, optionalPaginationID)
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
