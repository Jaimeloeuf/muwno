import { Module } from '@nestjs/common';

// Feature Modules
import { BasicModule } from './basic/basic.module.js';
import { FeedbackModule } from './feedback/feedback.module.js';

/**
 * App module used to tie all application feature modules together.
 */
@Module({
  imports: [BasicModule, FeedbackModule],
})
export class AppModule {}
