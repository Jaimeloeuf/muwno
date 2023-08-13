import { Module } from '@nestjs/common';

// Modules
import { TaskModule } from '../task/task.module.js';

// Services
import { FeedbackService } from './services/feedback.service.js';

// Controllers
import { FeedbackController } from './controllers/feedback.controller.js';
import { FeedbackResponseController } from './controllers/feedback-response.controller.js';

@Module({
  imports: [TaskModule],

  providers: [FeedbackService],

  controllers: [FeedbackController, FeedbackResponseController],
})
export class FeedbackModule {}
