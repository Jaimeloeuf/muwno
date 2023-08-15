import { Module } from '@nestjs/common';

// Infra
import { AiServiceProvider } from '../../infra/providers/index.js';

// Services
import { TaskService } from './services/task.service.js';

@Module({
  providers: [AiServiceProvider, TaskService],

  // Export these services so other modules can use these
  exports: [TaskService],
})
export class TaskModule {}
