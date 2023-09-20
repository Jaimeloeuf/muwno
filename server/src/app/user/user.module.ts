import { Module } from '@nestjs/common';

// Services
import { UserService } from './services/user.service.js';

// Controllers
import { UserController } from './controllers/user.controller.js';

@Module({
  providers: [UserService],

  controllers: [UserController],

  // Export these services so other modules can use these
  exports: [UserService],
})
export class UserModule {}
