import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

import { IOrgRepo, IUserRepo } from '../../../DAL/index.js';
import { StripeCustomerService } from '../../stripe/services/customer.service.js';
import {
  IAuthService,
  ITransactionalEmailService,
  IAdminNotifService,
} from '../../../infra/index.js';

// Entity Types
import type { Org, OrgID, UserID } from 'domain-model';
import { Role } from 'domain-model';

// DTO Types
import type { CreateOneOrgDTO } from 'domain-model';

// Service layer Exceptions
import {
  ForbiddenException,
  NotFoundException,
} from '../../../exceptions/index.js';

// Utils
import {
  orgCreatedNotifBuilder,
  orgCreatedEmailBuilder,
} from '../../../utils/index.js';

@Injectable()
export class OrgService {
  constructor(
    private readonly orgRepo: IOrgRepo,
    private readonly userRepo: IUserRepo,
    private readonly stripeCustomerService: StripeCustomerService,
    private readonly authService: IAuthService,
    private readonly transactionalEmailService: ITransactionalEmailService,
    private readonly adminNotifService: IAdminNotifService,
  ) {}

  /**
   * Validate if a user have access permission to an Org. Throws the common
   * `ForbiddenException` if user does not have access.
   *
   * Expects given `orgID` to be validated already, will treat a invalid
   * `orgID` the same as a Forbidden request.
   */
  async validateUserAccess(userID: UserID, orgID: OrgID): Promise<void> {
    const canAccess = await this.orgRepo.canUserAccessOrg(userID, orgID);

    if (!canAccess)
      throw new ForbiddenException(
        `User ${userID} does not have permission to access Org '${orgID}'.`,
      );
  }

  /**
   * Get Org data of given orgID from data source.
   */
  async getOrg(orgID: OrgID): Promise<Org> {
    const org = await this.orgRepo.getOne(orgID);
    if (org === null)
      throw new NotFoundException(`Org with orgID '${orgID}' is not found!`);

    return org;
  }

  /**
   * Get a user's Org Entity object back if they belong to an Org.
   */
  async getUserOrg(userID: UserID): Promise<Org> {
    const org = await this.orgRepo.getUserOrg(userID);
    if (org === null)
      throw new NotFoundException(`User '${userID}' does not have an Org!`);

    return org;
  }

  /**
   * Create a new Organisation, and set creator as the Org Owner
   */
  async createOrg(
    userID: UserID,
    createOneOrgDTO: CreateOneOrgDTO,
  ): Promise<Org> {
    // Ensure no leading or trailing spaces for Org names.
    createOneOrgDTO.name = createOneOrgDTO.name.trim();

    const org = await this.orgRepo.createOne(ulid(), createOneOrgDTO);

    // Update User Entity to add Role and OrgID
    await this.userRepo.updateOne(userID, {
      org_id: org.id,
      role: Role.OrgOwner,
    });

    // Set Org creator as the Org Owner
    await this.authService.setCustomClaims(userID, { roles: [Role.OrgOwner] });

    // Create a new Stripe Customer on Org creation since every org is tied to
    // a Stripe Customer, even if it is not subscribed yet.
    await this.stripeCustomerService.createCustomer(org);

    this.adminNotifService.send(
      orgCreatedNotifBuilder(org.id, createOneOrgDTO),
    );

    this.transactionalEmailService.email(
      org.email,
      orgCreatedEmailBuilder.subject(org.name),
      orgCreatedEmailBuilder.body(org.name),
    );

    return org;
  }
}
