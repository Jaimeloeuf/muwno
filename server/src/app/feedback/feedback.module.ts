import { Module } from '@nestjs/common';

// Services
import { FeedbackService } from './services/feedback.service.js';

// Controllers
import { FeedbackController } from './controllers/feedback.controller.js';
import { FeedbackResponseController } from './controllers/feedback-response.controller.js';

@Module({
  providers: [FeedbackService],

  controllers: [FeedbackController, FeedbackResponseController],
})
export class FeedbackModule {}
