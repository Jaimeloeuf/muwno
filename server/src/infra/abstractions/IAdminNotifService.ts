/**
 * Abstract interface for a Admin Notification Service, to notify admins through
 * whatever channel necessary.
 * Implement this and use this as the DI key.
 */
export abstract class IAdminNotifService {
  /**
   * Notify/send admin a message.
   */
  abstract send(msg: string): Promise<boolean>;
}
