import { Injectable } from '@nestjs/common';

import type {
  CreateOneContactFormSubmissionDTO,
  CreateOneOrgDTO,
  OrgID,
} from 'domain-model';

import {
  type IAdminNotifService,
  type AdminNotificationWebhookPaymentDetails,
  ITelegramBotService,
} from '../../abstractions/index.js';

@Injectable()
export class TelegramAdminNotifService implements IAdminNotifService {
  constructor(private readonly telegramBotService: ITelegramBotService) {}

  async landingPageContactForm(details: CreateOneContactFormSubmissionDTO) {
    return this.telegramBotService.notifyAdmin(`<b>Landing page Contact Form</b>

Name: ${details.name}
Email: ${details.email}
Message: ${details.message}`);
  }

  async userSignup(name: string, email: string, phone?: string) {
    return this.telegramBotService.notifyAdmin(`<b>New user signup</b>

Name: ${name}
Email: ${email}
Phone: ${phone}`);
  }

  async orgCreated(orgID: OrgID, createOneOrgDTO: CreateOneOrgDTO) {
    return this.telegramBotService.notifyAdmin(`<b>New Org created</b>

ID: ${orgID}
Name: ${createOneOrgDTO.name}
Email: ${createOneOrgDTO.email}
Phone: ${createOneOrgDTO.phone}
Address: ${createOneOrgDTO.address}`);
  }

  async webhookError(errMsg: string, error: Error) {
    return this.telegramBotService.notifyAdmin(`<b>Stripe Webhook Error</b>

${errMsg}

${error}`);
  }

  async webhookPaid(details: AdminNotificationWebhookPaymentDetails) {
    return this.telegramBotService.notifyAdmin(`<b>Paid!</b>

${details.customerName} paid ${details.currency} ${(
      details.amountPaid / 100
    ).toFixed(2)}

Invoice: ${details.invoiceUrl}

OrgID: ${details.orgID}
StripeCustomerID: ${details.stripeCustomerID}
For: ${details.subscriptionID}`);
  }

  async webhookPaymentFailed(details: AdminNotificationWebhookPaymentDetails) {
    return this.telegramBotService.notifyAdmin(`<b>Payment Failed!</b>

${details.customerName} failed to pay ${details.currency} ${(
      details.amountPaid / 100
    ).toFixed(2)}

Invoice: ${details.invoiceUrl}

OrgID: ${details.orgID}
StripeCustomerID: ${details.stripeCustomerID}
For: ${details.subscriptionID}`);
  }

  async custom(msg: string) {
    return this.telegramBotService.notifyAdmin(msg);
  }
}
