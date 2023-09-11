import { Injectable } from '@nestjs/common';

import type { IPmfscoreRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

import type { ProductID, PMFScore } from 'domain-model';

@Injectable()
export class PmfscoreRepo implements IPmfscoreRepo {
  constructor(private readonly db: PrismaService) {}

  async PMFScoreOfPeriod(productID: ProductID, start: string, end: string) {
    // Select all responses submitted during the given time period.
    // Group by a1 and count how many in each group.
    const responses = await this.db.pmf_survey_responses.groupBy({
      by: ['a1'],
      _count: { a1: true },
      where: {
        AND: [
          { productID },
          { createdAt: { gte: start } }, // Start of period
          { createdAt: { lt: end } }, // End of period
        ],
      },
    });

    // If there are no survey responses in the time window, DO NOTHING, and
    // allow it to be treated as a time period of null PMF score when computing
    // it later instead of returning null directly now. This is so that the
    // return type is always uniformly typeof `PMFScore` so it is easier to use
    // for the API users, especially since it comes with the time window too.
    // if (responses.length === 0) return null;

    // Prefill with 0 to ensure that unselected options will not be left empty.
    const votesByCategory: PMFScore['votesByCategory'] = { 1: 0, 2: 0, 3: 0 };
    let totalResponses = 0;
    for (const response of responses) {
      // Casting without runtime check since assuming that it is validated on DB write.
      votesByCategory[response.a1 as keyof PMFScore['votesByCategory']] =
        response._count.a1;

      totalResponses += response._count.a1;
    }

    return {
      timeWindow: { start, end },
      votesByCategory,
      totalResponses,

      /**
       * If `totalResponses` is 0, can just return null directly, because
       * computing a score when that is 0 will only have 2 possible outcomes.
       *
       * 1. A possible state, and the most likely thing to happen.
       *    - `votesByCategory[3]` is 0
       *    - dividing 0 by 0 will return NaN which will be converted to null on
       *      JSON serialisation when returning the data to API user.
       * 2. Impossible state
       *    - `votesByCategory[3]` is more than 1, this is impossible since
       *      `totalResponses` is computed by summing all the votes up.
       *    - dividing by 0 when will cause Infinity, which will be converted to
       *      null on JSON serialisation when returning the data to API user.
       *
       * Since both will eventually be converted to null, there is no need in
       * doing the computation in the first place, just use null directly.
       */
      score:
        totalResponses === 0
          ? null
          : Math.trunc((votesByCategory[3] / totalResponses) * 100),
    };
  }
}
