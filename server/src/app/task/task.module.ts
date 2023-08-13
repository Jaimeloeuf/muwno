import { Module } from '@nestjs/common';

// Services
import { TaskService } from './services/task.service.js';

@Module({
  providers: [TaskService],

  // Export these services so other modules can use these
  exports: [TaskService],
})
export class TaskModule {}
