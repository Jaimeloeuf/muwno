import { Injectable } from '@nestjs/common';
import { unparse as PapaUnparse } from 'papaparse';

import { IFeedbackRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type {
  ProductID,
  FeedbackForm,
  CreateOneFeedbackResponseDTO,
} from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepo: IFeedbackRepo) {}

  /**
   * Get a Feedback Form's data from data source.
   */
  async getForm(productID: ProductID): Promise<FeedbackForm> {
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
  async saveResponse(
    productID: ProductID,
    response: CreateOneFeedbackResponseDTO,
  ): Promise<void> {
    await this.feedbackRepo.saveOne(productID, response);
  }

  /**
   * Get survey responses as CSV string to download as a CSV file on the client.
   */
  async getResponseCsvString(productID: ProductID): Promise<string> {
    const { productName } = await this.getForm(productID);

    // Do string interpolation once so it is not repeated during response mapping
    const q1Header = `Q1. How would you feel if ${productName} no longer exists?`;
    const q2Header = `Q2. What type of people do you think would most benefit from ${productName}?`;
    const q3Header = `Q3. What is the main benefit you receive from ${productName}?`;
    const q4Header = `Q4. How can we improve ${productName} for you?`;

    /** Mapping to convert q1 answers stored as 1, 2, 3 in DB into text */
    const a1WordMapping = { 3: 'Very', 2: 'Somewhat', 1: 'Not' };

    const responses = await this.feedbackRepo.getResponses(productID);

    /**
     * Map responses to use specific key strings so that they will be used as
     * the header string for all the CSV automatically.
     *
     * This could be optimized to use array based insertions so that this does
     * not need to create so many objects with such long string keys as it takes
     * alot of memory, and prepend the header row after parsing it as csv string.
     */
    const mappedResponse = responses.map((response, index: number) => ({
      // Use 1 indexed serial ID
      id: index + 1,
      'Survey Response Time': response.createdAt.toISOString(),
      // Type casting is safe here since it is validated before writing to DB
      [q1Header]: a1WordMapping[response.a1 as keyof typeof a1WordMapping],
      [q2Header]: response.a2,
      [q3Header]: response.a3,
      [q4Header]: response.a4,
    }));

    // 'unparse' array of objects into a CSV String
    return PapaUnparse(mappedResponse, { header: true });
  }
}
