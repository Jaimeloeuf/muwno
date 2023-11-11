import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { IFeedbackRepo } from '../../../DAL/index.js';
import { TaskService } from '../../task/services/task.service.js';
import { ProductService } from '../../product/services/product.service.js';

// Entity Types
import type {
  UserID,
  ProductID,
  FeedbackForm,
  FeedbackResponseID,
  FeedbackResponse,
  FeedbackA2WordOccurrence,
} from 'domain-model';

// DTO Types
import type { CreateOneFeedbackResponseDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

// Utils
import { stopwords } from './utils/stopwords.js';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: IFeedbackRepo,
    private readonly taskService: TaskService,
    private readonly productService: ProductService,
  ) {}

  /**
   * Get a Feedback Form's data from data source.
   */
  async getForm(productID: ProductID): Promise<FeedbackForm> {
    const form = await this.feedbackRepo.getOneFeedbackForm(productID);
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
    const responseID = await this.feedbackRepo.saveOneResponse(
      ulid(),
      productID,
      response,
    );

    await this.taskService.createOne(productID, responseID, response);
  }

  /**
   * Get a Product's survey response stats.
   */
  async getResponseStats(
    requestorID: UserID,
    productID: ProductID,
  ): Promise<number> {
    // Validate if user can access this product, and in extension, its stats.
    await this.productService.validateUserAccess(requestorID, productID);

    return this.feedbackRepo.getResponseStats(productID);
  }

  /**
   * Get a single response.
   */
  async getResponse(
    requestorID: UserID,
    responseID: FeedbackResponseID,
  ): Promise<FeedbackResponse> {
    const response = await this.feedbackRepo.getResponse(responseID);
    if (response === null)
      throw new NotFoundException(`Cannot find response: ${responseID}`);

    // Validate if user can access this product, and in extension its responses.
    await this.productService.validateUserAccess(
      requestorID,
      response.productID,
    );

    return response;
  }

  /**
   * Get Product's word occurrence data for feedback response `a2` to generate
   * word cloud.
   */
  async getA2WordOccurrence(
    requestorID: UserID,
    productID: ProductID,
  ): Promise<FeedbackA2WordOccurrence> {
    // Validate if user can access this product and in extension, its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    const peoples = await this.feedbackRepo.getResponseA2(productID);

    const wordOccurences = peoples
      // Split it by word, process each word and create a single new array
      .flatMap((people) =>
        people.split(' ').map((word) =>
          word
            // Remove punctuations
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            // Remove excess spaces
            .replace(/\s{2,}/g, ' ')
            .toLowerCase(),
        ),
      )
      // Reduce it into a map of words and their occurence
      .reduce(
        (acc, cur) => (
          acc[cur] === undefined ? (acc[cur] = 1) : (acc[cur] += 1), acc
        ),
        // @todo might be more performant to use a Map instead
        {} as Record<string, number>,
      );

    // Filter out all the stop words
    for (const stopword of stopwords) delete wordOccurences[stopword];

    // This is if somehow the last field has an empty space, it will split into
    // an empty string '', even if the vue form uses v-model.trim="variable"
    delete wordOccurences[''];

    return wordOccurences;
  }

  /**
   * Get survey responses as CSV string to download as a CSV file on the client.
   */
  async getResponseCsvString(
    requestorID: UserID,
    productID: ProductID,
  ): Promise<string> {
    // Validate if user can access this product, and in extension its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    const { productName } = await this.getForm(productID);

    // Do string interpolation once so it is not repeated during response mapping
    const q1Header = `Q1. How would you feel if ${productName} no longer exists?`;
    const q2Header = `Q2. What type of people do you think would most benefit from ${productName}?`;
    const q3Header = `Q3. What is the main benefit you receive from ${productName}?`;
    const q4Header = `Q4. How can we improve ${productName} for you?`;

    /** Mapping to convert q1 answers stored as 1, 2, 3 in DB into text */
    const a1WordMapping = {
      3: 'Very disappointed',
      2: 'Somewhat disappointed',
      1: 'Not disappointed',
    };

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
      'Survey Response Time': response.created_at.toISOString(),
      [q1Header]: a1WordMapping[response.a1],
      [q2Header]: response.a2,
      [q3Header]: response.a3,
      [q4Header]: response.a4,
    }));

    // Lazily load library since this is not used very often
    const { unparse: PapaUnparse } = await import('papaparse');

    // 'unparse' array of objects into a CSV String
    return PapaUnparse(mappedResponse, { header: true });
  }
}
