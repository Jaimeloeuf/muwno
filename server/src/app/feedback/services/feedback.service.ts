import { Injectable } from '@nestjs/common';

import { IFeedbackRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { ProductID, FeedbackResponse } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepo: IFeedbackRepo) {}

  /**
   * Get a Feedback Form's data from data source.
   */
  async getForm(productID: ProductID) {
    const form = await this.feedbackRepo.getOne(productID);
    if (form === null)
      throw new NotFoundException(
        `Cannot find form of Product ID '${productID}'`,
      );

    return form;
  }

  /**
   * Save response of a feedback form.
   */
  async saveResponse(productID: ProductID, response: FeedbackResponse) {
    await this.feedbackRepo.saveOne(productID, response);
  }
}
