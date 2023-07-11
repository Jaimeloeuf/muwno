import { Module } from '@nestjs/common';

// Services
import { FeedbackService } from './services/feedback.service.js';

// Controllers
import { FeedbackController } from './controllers/feedback.controller.js';

@Module({
  providers: [FeedbackService],

  controllers: [FeedbackController],
})
export class FeedbackModule {}
