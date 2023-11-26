import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';

import { PmfscoreService } from '../services/pmfscore.service.js';

import {
  GuardWithRBAC,
  AllowAllRoles,
  JWT_uid,
} from '../../../guards/index.js';

// Entity Types
import type { FirebaseAuthUID, ProductID } from 'domain-model';

// DTO Types
import type { ReadOnePMFScoreDTO, ReadManyPMFScoreDTO } from 'domain-model';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

@Controller('pmf')
@GuardWithRBAC()
@UseHttpControllerFilters
export class PmfscoreController {
  constructor(private readonly pmfscoreService: PmfscoreService) {}

  /**
   * Get the live PMF score of a rolling time window.
   */
  @Get('live/:productID')
  @AllowAllRoles
  async getPMFLiveScore(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,
  ): Promise<ReadOnePMFScoreDTO> {
    return this.pmfscoreService
      .getPMFLiveScore(userID, productID)
      .then((score) => ({ score }));
  }

  /**
   * Get PMF score of all time periods within the selected time range.
   */
  @Get('range/:productID')
  @AllowAllRoles
  async getPMFScoresOfSelectedRange(
    @JWT_uid userID: FirebaseAuthUID,
    @Param('productID') productID: ProductID,

    @Query('intervals', ParseIntPipe) intervals: number,
    @Query('intervalType') intervalType: string,
  ): Promise<ReadManyPMFScoreDTO> {
    return this.pmfscoreService
      .getPMFScoresOfSelectedRange(userID, productID, intervals, intervalType)
      .then((score) => ({ score }));
  }
}
