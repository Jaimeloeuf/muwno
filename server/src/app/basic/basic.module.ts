import { Module } from '@nestjs/common';

// Controllers
import { BasicController } from './controllers/basic.controller.js';

@Module({
  controllers: [BasicController],
})
export class BasicModule {}
