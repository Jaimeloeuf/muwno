import { Module } from '@nestjs/common';

// Infra
import { AiServiceProvider } from '../../infra/index.js';

// Modules
import { ProductModule } from '../product/product.module.js';

// Services
import { TaskService } from './services/task.service.js';

// Controllers
import { TaskController } from './controllers/task.controller.js';

@Module({
  imports: [ProductModule],

  providers: [AiServiceProvider, TaskService],

  controllers: [TaskController],

  // Export these services so other modules can use these
  exports: [TaskService],
})
export class TaskModule {}
