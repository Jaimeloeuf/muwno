import { Injectable } from '@nestjs/common';

import { IOrgRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { Org } from 'domain-model';

// Service layer Exceptions
import { OrgNotFoundException } from '../exceptions/index.js';

@Injectable()
export class OrgService {
  constructor(private readonly orgRepo: IOrgRepo) {}

  /**
   * Get Org data of given orgID from data source.
   *
   * This will throw
   * - `OrgNotFoundException` if Org is not found
   */
  async getOrg(orgID: Org['id']): Promise<Org> {
    const org = await this.orgRepo.getOne(orgID);
    if (org === null) throw new OrgNotFoundException(orgID);
    return org;
  }
}
