import { Module } from '@nestjs/common';

// Services
import { UserService } from './services/user.service.js';

// Controllers
import { UserController } from './controllers/user.controller.js';

@Module({
  providers: [UserService],

  controllers: [UserController],
})
export class UserModule {}
