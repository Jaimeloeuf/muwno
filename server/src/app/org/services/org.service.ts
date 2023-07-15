import { Injectable } from '@nestjs/common';

// Entity Types
import type { Org } from 'domain-model';

@Injectable()
export class OrgService {
  /**
   * Get Org data of given orgID from data source.
   */
  async getOrg(orgID: string): Promise<Org> {
    // @todo Return hardcoded fake data
    return {
      id: orgID,
      createdAt: new Date().toISOString(),
      name: 'HB30',
      plan: 'Pro',
    };
  }
}
