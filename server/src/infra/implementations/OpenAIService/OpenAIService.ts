import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

import type { IAiService } from '../../abstractions/IAiService.js';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

import {
  listOfNoFeedbackStringsMaxLength,
  listOfNoFeedbackStrings,
} from './hardCodedNoFeedbackStrings.js';

/**
 * Implements `IAiService` using OpenAI APIs.
 */
@Injectable()
export class OpenAIService implements IAiService {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const organization = configService.get('OPENAI_ORG', { infer: true });
    const apiKey = configService.get('OPENAI_API_KEY', { infer: true });

    this.openai = new OpenAIApi(new Configuration({ organization, apiKey }));
  }

  /**
   * Hold the `OpenAIApi` client after creating it in constructor.
   */
  private readonly openai: OpenAIApi;

  // @todo Handle errors once this uses OpenAI API for internal logging to monitor when things go wrong
  async isInvalidCustomerFeedback(customerFeedback: string) {
    // Simple optimisation to decide if the next check should be performed
    // against the list of hardcoded no feedback strings, by checking if length
    // of customer feedback is larger than `listOfNoFeedbackStringsMaxLength`
    // because if the feedback is a longer text, then it is impossible for it to
    // appear in the list of hardcoded no feedback strings. By skipping this it
    // means that this will not waste CPU cycles iterating and checking through
    // super long customer feedbacks.
    // Return false to indicate that the customer feedback is valid.
    if (customerFeedback.length > listOfNoFeedbackStringsMaxLength)
      return false;

    // Check if feedback is any of the hardcoded words that means no feedback.
    // If it matches any of the hardcoded strings, return true to indicate that
    // the customer feedback is invalid.
    return listOfNoFeedbackStrings.includes(
      customerFeedback.trim().toLowerCase(),
    );
  }

  // @todo Handle errors for internal logging to monitor when things go wrong
  async getActionableTask(validatedCustomerFeedback: string) {
    const response = await this.openai.createChatCompletion({
      model: 'gpt-3.5-turbo',

      // After experimenting, it seems like sending everything in 1 shot works
      // best with the user role, because the pre-empting the system role always
      // causes it to give point form actionable insights instead.
      messages: [
        {
          role: 'user',
          content: `You are a project and product manager, reword the given customer feedback into a single short sentence describing an actionable task that is easy to understand without changing its meaning. This is the customer feedback: "${validatedCustomerFeedback}"`,
        },

        // Alternative prompt that seem to mess up sometimes.
        // {
        //   role: 'system',
        //   content: `You are a project and product manager, I will give you a customer feedback for you to rewrite into a single short sentence describing an actionable task that is easy to understand without changing its original meaning.`,
        // },
        // {
        //   role: 'user',
        //   content: `This is the customer feedback: "${validatedCustomerFeedback}"`,
        // },
      ],

      // Using a temperature of 0 so that the generated response is the most
      // deterministic so that we can reproduce it to a certain extent if needed.
      temperature: 0,

      // Only allow 1 response since only 1 task is saved
      n: 1,
    });

    /**
     * Get the first generated choice as the actionable task, and assume that it
     * is always available since the API call explicitly request for exactly 1
     * response to be generated.
     */
    const actionableTask = response.data.choices[0]?.message?.content ?? '';

    return actionableTask;
  }
}
