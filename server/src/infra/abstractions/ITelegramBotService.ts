/**
 * Abstract interface for a Telegram Bot Service.
 * Implement this and use this as the DI key.
 */
export abstract class ITelegramBotService {
  /**
   * Send ONE message to ONE recipient.
   *
   * Returns boolean to indicate if method succeeded.
   */
  abstract sendOne(recipient: string, message: string): Promise<boolean>;

  /**
   * Send ONE message to thepmftool admins' telegram group chat using the bot.
   *
   * Returns boolean to indicate if method succeeded.
   */
  abstract notifyAdmin(message: string): Promise<boolean>;
}
