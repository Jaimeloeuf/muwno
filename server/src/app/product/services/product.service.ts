import { Injectable } from '@nestjs/common';

import { IProductRepo, IOrgRepo } from '../../../DAL/index.js';

// Entity Types
import type {
  OrgID,
  UserID,
  Product,
  ProductID,
  Products,
  PMFScore,
  CreateOneProductDTO,
} from 'domain-model';

// Service layer Exceptions
import {
  NotFoundException,
  InvalidInputException,
  InvalidOperationException,
  ForbiddenException,
} from '../../../exceptions/index.js';

// Utils
import { intervalDates } from './utils/intervalDates.js';
import { isValidIntervalType } from 'domain-model';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: IProductRepo,
    private readonly orgRepo: IOrgRepo,
  ) {}

  /**
   * Validate a product ID by checking if a product exists. Throws the common
   * `NotFoundException` if it does not exists.
   */
  async validateProductID(productID: ProductID): Promise<void> {
    if (!(await this.productRepo.productExists(productID)))
      throw new NotFoundException(
        `Product with ProductID '${productID}' does not exist.`,
      );
  }

  /**
   * Validate if a user have access permission to a product. Throws the common
   * `ForbiddenException` if user does not have access.
   *
   * Expects given `productID` to be validated already, will treat a invalid
   * `productID` the same as a Forbidden request.
   */
  async validateUserAccess(
    userID: UserID,
    productID: ProductID,
  ): Promise<void> {
    const canAccess = await this.productRepo.canUserAccessProduct(
      userID,
      productID,
    );

    if (!canAccess)
      throw new ForbiddenException(
        `User ${userID} does not have permission to access Product '${productID}'.`,
      );
  }

  /**
   * Get all products of an Org.
   */
  async getOrgProducts(orgID: OrgID): Promise<Products> {
    // @todo Validate orgID, and if user have permission to this org

    return this.productRepo.getOrgProducts(orgID);
  }

  /**
   * Get all products of the user's Org.
   */
  async getUserOrgProducts(userID: UserID): Promise<Products> {
    return this.productRepo.getUserOrgProducts(userID);
  }

  /**
   * Create a new Product in the user's own Org.
   */
  async createProduct(
    userID: UserID,
    createOneProductDTO: CreateOneProductDTO,
  ): Promise<Product> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new InvalidOperationException(
        `User '${userID}' cannot create product without being in an Org`,
      );

    return this.productRepo.createOne(org.id, createOneProductDTO);
  }

  /**
   * Get the live PMF score of a rolling time window.
   */
  async getPMFLiveScore(productID: ProductID): Promise<PMFScore> {
    await this.validateProductID(productID);

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
}
