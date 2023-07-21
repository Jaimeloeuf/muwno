import { Injectable } from '@nestjs/common';

import { IProductRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type {
  Org,
  Product,
  Products,
  MIT,
  PMFLiveScore,
  PMFScore,
} from 'domain-model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: IProductRepo) {}

  /**
   * Get all products of an Org.
   */
  async getOrgProducts(orgID: Org['id']): Promise<Products> {
    // @todo Validate orgID

    return this.productRepo.getOrgProducts(orgID);
  }

  /**
   * Get the PMF live score.
   */
  async getPMFLiveScore(
    productID: Product['id'],
  ): Promise<PMFLiveScore | null> {
    // @todo Validate productID

    return this.productRepo.PMFLiveScore(productID);
  }

  /**
   * Get PMF score of the selected range of sprints.
   */
  async getPMFScoreOfSelectedSprints(
    productID: Product['id'],
    startSprint: number,
    endSprint: number,
  ) {
    // @todo Validate productID

    const scores: Array<Promise<PMFScore>> = [];

    // Loop to get all the historical PMF Scores, inclusive of the end sprint
    for (let i = startSprint; i <= endSprint; i++)
      scores.push(this.productRepo.PMFScore(productID, i));

    return Promise.all(scores);
  }

  /**
   * Get a list of MITs that the team should work on
   */
  async getCurrentMIT(productID: Product['id']): Promise<Array<MIT>> {
    // @todo Validate productID

    return this.productRepo.currentMIT(productID);
  }
}
