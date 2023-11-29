import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { IFeedbackRepo, IProductRepo } from '../../../DAL/index.js';
import { TaskService } from '../../task/services/task.service.js';
import { ProductService } from '../../product/services/product.service.js';
import { UsageService } from '../../usage/services/usage.service.js';

// Entity Types
import type {
  UserID,
  ProductID,
  FeedbackForm,
  FeedbackResponseID,
  FeedbackResponse,
  OccurrenceMap,
} from 'domain-model';

// DTO Types
import type { CreateOneFeedbackResponseDTO, ReadManyA3DTO } from 'domain-model';

// Service layer Exceptions
import {
  NotFoundException,
  InvalidInputException,
  InvalidInternalStateException,
} from '../../../exceptions/index.js';

// Utils
import { stopwords } from './utils/stopwords.js';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepo: IFeedbackRepo,
    private readonly productRepo: IProductRepo,
    private readonly taskService: TaskService,
    private readonly productService: ProductService,
    private readonly usageService: UsageService,
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

    const orgID = await this.productRepo.getProductOrg(productID);
    if (orgID === null)
      throw new InvalidInternalStateException(
        `Cannot find orgID of product '${productID}`,
      );

    await this.usageService.trackResponse(orgID, productID, responseID);
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
   * Get Product's term occurrence data for feedback response `a2`.
   */
  async getA2TermOccurrence(
    requestorID: UserID,
    productID: ProductID,
    timeRange: number,
  ): Promise<OccurrenceMap> {
    // Validate if user can access this product and in extension, its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    if (timeRange > 2.592e6)
      throw new InvalidInputException(
        `Time range cannot be larger than 2.592e6`,
      );

    const responses = await this.feedbackRepo.getResponseA2(
      productID,
      timeRange,
    );

    // Reduce responses into a map of words and their occurence
    const occurrenceMap: Record<string, number> = {};
    for (const response of responses)
      occurrenceMap[response] === undefined
        ? (occurrenceMap[response] = 1)
        : (occurrenceMap[response] += 1);

    // @todo Might group terms together semantically. E.g. company and companies

    return occurrenceMap;
  }

  /**
   * Get Product's word occurrence data for feedback response `a2`.
   */
  async getA2WordOccurrence(
    requestorID: UserID,
    productID: ProductID,
    timeRange: number,
  ): Promise<OccurrenceMap> {
    // Validate if user can access this product and in extension, its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    if (timeRange > 2.592e6)
      throw new InvalidInputException(
        `Time range cannot be larger than 2.592e6`,
      );

    const peoples = await this.feedbackRepo.getResponseA2(productID, timeRange);

    // @todo
    // This only works for english and english character based languages for now
    // and languages like chinese will not work properly as the characters are
    // treated as a single word since there is no spaces.
    const words = peoples
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
      );

    // Reduce `words` into a map of words and their occurence
    const wordOccurrences: Record<string, number> = {};
    for (const word of words) {
      // Only count words that are not stop words
      if (!stopwords[word])
        wordOccurrences[word] === undefined
          ? (wordOccurrences[word] = 1)
          : (wordOccurrences[word] += 1);
    }

    // @todo Might group terms together semantically. E.g. company and companies

    return wordOccurrences;
  }

  /**
   * Get Product's word occurrence data for feedback response `a3`.
   */
  async getA3WordOccurrence(
    requestorID: UserID,
    productID: ProductID,
    timeRange: number,
  ): Promise<OccurrenceMap> {
    // Validate if user can access this product and in extension, its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    if (timeRange > 2.592e6)
      throw new InvalidInputException(
        `Time range cannot be larger than 2.592e6`,
      );

    const benefits = await this.feedbackRepo.getResponseA3(
      productID,
      timeRange,
    );

    // @todo
    // This only works for english and english character based languages for now
    // and languages like chinese will not work properly as the characters are
    // treated as a single word since there is no spaces.
    const words = benefits
      // Split it by word, process each word and create a single new array
      .flatMap((benefit) =>
        benefit.split(' ').map((word) =>
          word
            // Remove punctuations
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            // Remove excess spaces
            .replace(/\s{2,}/g, ' ')
            .toLowerCase(),
        ),
      );

    // Reduce `words` into a map of words and their occurence
    const wordOccurrences: Record<string, number> = {};
    for (const word of words) {
      // Only count words that are not stop words
      if (!stopwords[word])
        wordOccurrences[word] === undefined
          ? (wordOccurrences[word] = 1)
          : (wordOccurrences[word] += 1);
    }

    // @todo Might group terms together semantically. E.g. company and companies

    return wordOccurrences;
  }

  /**
   * Get Product's feedback response `a3`.
   */
  async getA3(
    requestorID: UserID,
    productID: ProductID,
    count: number,
    optionalPaginationID?: FeedbackResponseID,
  ): Promise<ReadManyA3DTO['benefits']> {
    // Validate if user can access this product, and in extension its responses.
    await this.productService.validateUserAccess(requestorID, productID);

    return this.feedbackRepo.getA3(productID, count, optionalPaginationID);
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

    // Limit up to 1 thousand responses
    const responses = await this.feedbackRepo.getResponses(productID, 1000);

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
