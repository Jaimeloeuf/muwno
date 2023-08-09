import { Module } from '@nestjs/common';

// Services
import { TeamService } from './services/team.service.js';

// Controllers
import { TeamController } from './controllers/team.controller.js';

@Module({
  providers: [TeamService],

  controllers: [TeamController],
})
export class TeamModule {}
