import { Injectable } from '@nestjs/common';

import { IOrgRepo } from '../../../DAL/abstraction/index.js';

// Entity Types
import type { Org } from 'domain-model';

// DTO Types
import type { CreateOneOrgDTO } from 'domain-model';

// Service layer Exceptions
import { NotFoundException } from '../../../exceptions/index.js';

@Injectable()
export class OrgService {
  constructor(private readonly orgRepo: IOrgRepo) {}

  /**
   * Get Org data of given orgID from data source.
   */
  async getOrg(orgID: Org['id']): Promise<Org> {
    const org = await this.orgRepo.getOne(orgID);
    if (org === null)
      throw new NotFoundException(`Org with orgID '${orgID}' is not found!`);

    return org;
  }

  /**
   * Create a new Organisation
   */
  async createOrg(createOneOrgDTO: CreateOneOrgDTO): Promise<Org> {
    return this.orgRepo.createOne(createOneOrgDTO);
  }
}
