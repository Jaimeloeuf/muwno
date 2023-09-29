import type { ISODateTimeString } from '../utils/Timestamp.js';

/**
 * Type to represent a single Customer.
 */
export type Customer = {
  /**
   * Unique ID for this Customer in our system.
   */
  uid: string;

  /**
   * Customer's ID in the user's system. A unique string as the Customer's ID
   * amongst all of the Org's customers.
   */
  id: string;

  /**
   * Time in which the Customer is created in our system.
   */
  createdAt: ISODateTimeString;

  /**
   * Optional name of the Customer. If available, will be used for things like
   * personalizing the surveys sent to them.
   */
  name?: string;

  /**
   * Optional email of the Customer. Required to send email surveys.
   */
  email?: string;

  /**
   * Optional phone number of the Customer. Required to send SMS surveys.
   */
  number?: string;

  /**
   * @todo
   * Tags
   */
  tags: Array<string>;

  // @todo Meta data like how many times has this customer been surveyed?
  // @todo If they respond to a survey we should count it...
};

/**
 * Type alias for `Customer['id']`.
 */
export type CustomerID = Customer['id'];
