import { Injectable } from '@nestjs/common';

import { IProductRepo } from '../../../DAL/index.js';
import { ProductService } from '../../product/services/product.service.js';

// Entity Types
import type { ProductID, PMFScore } from 'domain-model';

// Service layer Exceptions
import { InvalidInputException } from '../../../exceptions/index.js';

// Utils
import { intervalDates } from './utils/intervalDates.js';
import { isValidIntervalType } from 'domain-model';

@Injectable()
export class PmfscoreService {
  constructor(
    private readonly productRepo: IProductRepo,
    private readonly productService: ProductService,
  ) {}

  /**
   * @todo Might get frontend to pass in selected range
   *
   * Get the live PMF score of a rolling time window.
   */
  async getPMFLiveScore(productID: ProductID): Promise<PMFScore> {
    await this.productService.validateProductID(productID);

    // @todo Currently hard coded to 7 days, should allow users to select duration
    const startOfRollingWindow = new Date(
      new Date().getTime() - 6.048e8,
    ).toISOString();

    // End is just right now since it is a rolling window
    const end = new Date().toISOString();

    return this.productRepo.PMFScoreOfPeriod(
      productID,
      startOfRollingWindow,
      end,
    );
  }

  /**
   * Get PMF score of all time periods within the selected time range.
   */
  async getPMFScoresOfSelectedRange(
    productID: ProductID,
    intervals: number,
    intervalType: string,
  ) {
    if (intervals < 1)
      throw new InvalidInputException(
        `Intervals must be 1 or more '${intervals}'`,
      );

    if (!isValidIntervalType(intervalType))
      throw new InvalidInputException(`Invalid intervalType '${intervalType}'`);

    await this.productService.validateProductID(productID);

    const scores: Array<Promise<PMFScore>> = [];

    // Loop to get PMF Scores of all periods, inclusive of the current period.
    // Using >= so that the current time period is also computed.
    // -1 to prevent having 1 more interval since this counts down to 0
    for (let i = intervals - 1; i >= 0; i--) {
      const { start, end } = intervalDates(i, intervalType);
      scores.push(this.productRepo.PMFScoreOfPeriod(productID, start, end));
    }

    return Promise.all(scores);
  }
}
