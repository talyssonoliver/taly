/**
 * Interface for notification providers
 * All notification providers (email, SMS, push) should implement this interface
 */
export interface INotificationProvider {
  /**
   * Send a notification
   * @param userId - The recipient user ID
   * @param templateKey - The template identifier
   * @param data - The data to populate the template
   * @returns A promise resolving to an object indicating success or failure
   */
  send(
    userId: string,
    templateKey: string,
    data: any,
  ): Promise<{ success: boolean; error?: string }>;
}
