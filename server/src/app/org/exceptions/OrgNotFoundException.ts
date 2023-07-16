import type { Org } from 'domain-model';

/**
 * Throw Exception if no Org with the given `orgID` is found in the data souce.
 */
export class OrgNotFoundException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(orgID: Org['id'], optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Org with orgID '${orgID}' is not found!`;

    super(message);
  }
}
