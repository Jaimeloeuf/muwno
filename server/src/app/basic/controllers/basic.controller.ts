import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

@Controller({ version: VERSION_NEUTRAL })
export class BasicController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Get()
  home(): string {
    return '<a href="https://github.com/Jaimeloeuf/thepmftool">thepmftool</a> API service';
  }

  /**
   * Read version info from env var which is a string of build time git branch and commit hash
   */
  @Get('version')
  version(): string {
    return this.configService.get('version', { infer: true });
  }
}
