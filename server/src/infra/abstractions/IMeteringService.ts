/**
 * Abstract interface for a metering Service.
 * Implement this and use this as the DI key.
 */
export abstract class IMeteringService {
  /**
   * Track a usage event.
   * Returns boolean to indicate if method succeeded.
   */
  abstract trackEvent(
    /**
     * Unique ID to identify this event. Will be idempotent for the same ID.
     */
    id: string,

    /**
     * The event being tracked.
     */
    event: string,

    /**
     * Who is this event attributed to? E.g. an Org/Customer ID.
     */
    who: string,

    /**
     * Simple flat object for additional data regarding this event.
     */
    data: Record<string, string | number>,
  ): Promise<boolean>;

  /**
   * Query a usage event.
   */
  abstract queryEvent(
    /**
     * The event being queried
     */
    event: string,

    /**
     * Who is this event attributed to? E.g. an Org/Customer ID.
     */
    subject: string,

    /**
     * Start of time range. Leave this and `to` blank to get all time usage.
     */
    from?: string,

    /**
     * End of time range. Leave this and `from` blank to get all time usage.
     */
    to?: string,
  ): Promise<number | null>;
}
