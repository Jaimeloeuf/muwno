import { Injectable } from '@nestjs/common';

import { IProductRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type {
  Org,
  Product,
  Products,
  MIT,
  PMFLiveScore,
  PMFScoreOfSprint,
  PMFScore,
  CreateOneProductDTO,
} from 'domain-model';

// Service layer Exceptions
import {
  NotFoundException,
  InvalidInputException,
} from '../../../exceptions/index.js';

// Utils
import { intervalDates } from './utils/intervalDates.js';
import { isValidIntervalType } from 'domain-model';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: IProductRepo) {}

  /**
   * Validate a product ID by checking if a product exists. Throws the common
   * `NotFoundException` if it does not exists.
   */
  async validateProductID(productID: Product['id']): Promise<void> {
    if (!(await this.productRepo.productExists(productID)))
      throw new NotFoundException(
        `Product with ProductID '${productID}' does not exist.`,
      );
  }

  /**
   * Get all products of an Org.
   */
  async getOrgProducts(orgID: Org['id']): Promise<Products> {
    // @todo Validate orgID, and if user have permission to create for this org

    return this.productRepo.getOrgProducts(orgID);
  }

  /**
   * Create a new Product
   */
  async createProduct(
    orgID: Org['id'],
    createOneProductDTO: CreateOneProductDTO,
  ): Promise<Product> {
    // @todo Validate orgID, and if user have permission to create for this org

    return this.productRepo.createOne(orgID, createOneProductDTO);
  }

  /**
   * Get the PMF live score.
   */
  async getPMFLiveScore(
    productID: Product['id'],
  ): Promise<PMFLiveScore | null> {
    await this.validateProductID(productID);

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
    if (startSprint < 0)
      throw new InvalidInputException(
        `Start Sprint cannot be less than 0, received ${startSprint}.`,
      );
    if (endSprint < 0)
      throw new InvalidInputException(
        `End Sprint cannot be less than 0, received ${endSprint}.`,
      );
    if (endSprint < startSprint)
      throw new InvalidInputException(
        `End Sprint cannot be before Start Sprint.`,
      );

    await this.validateProductID(productID);

    const scores: Array<Promise<PMFScoreOfSprint>> = [];

    // Loop to get all the historical PMF Scores, inclusive of the end sprint
    for (let i = startSprint; i <= endSprint; i++)
      scores.push(this.productRepo.PMFScoreOfSprint(productID, i));

    return Promise.all(scores);
  }

  /**
   * Get PMF score of all time periods within the selected time range.
   */
  async getPMFScoresOfSelectedRange(
    productID: Product['id'],
    intervals: number,
    intervalType: string,
  ) {
    if (intervals < 1)
      throw new InvalidInputException(
        `intervals must be 1 or more '${intervals}'`,
      );

    if (!isValidIntervalType(intervalType))
      throw new InvalidInputException(`Invalid intervalType '${intervalType}'`);

    await this.validateProductID(productID);

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

  /**
   * Get a list of MITs that the team should work on
   */
  async getCurrentMIT(productID: Product['id']): Promise<Array<MIT>> {
    await this.validateProductID(productID);

    return this.productRepo.currentMIT(productID);
  }
}
