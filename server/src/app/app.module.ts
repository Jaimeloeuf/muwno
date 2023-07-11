import { Module } from '@nestjs/common';

// Feature Modules
import { BasicModule } from './basic/basic.module.js';

/**
 * App module used to tie all application feature modules together.
 */
@Module({
  imports: [BasicModule],
})
export class AppModule {}
