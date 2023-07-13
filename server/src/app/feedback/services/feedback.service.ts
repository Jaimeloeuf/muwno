import { Injectable } from '@nestjs/common';

// Entity Types
import type { FeedbackResponse } from 'domain-model';

@Injectable()
export class FeedbackService {
  /**
   * Get a Feedback Form's data from data source.
   */
  async getForm(formID: string) {
    formID;

    return { productName: 'Superhuman' };
  }

  /**
   * Save response of a feedback form.
   */
  async saveResponse(formID: string, response: FeedbackResponse) {
    console.log('received', formID, response);
  }
}
