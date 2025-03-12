/**
 * Options for sending SMS notifications
 */
export interface ISmsOptions {
  /**
   * Recipient phone number (E.164 format recommended)
   */
  to: string;

  /**
   * Sender phone number or name
   */
  from?: string;

  /**
   * SMS message content
   */
  message: string;

  /**
   * Whether to use Unicode/UTF-16 encoding (for non-GSM characters)
   */
  unicode?: boolean;

  /**
   * Whether this is a marketing message (for compliance)
   */
  isMarketing?: boolean;

  /**
   * Message validity period in minutes
   */
  validityPeriod?: number;

  /**
   * Maximum number of SMS segments to send (limit message length)
   */
  maxSegments?: number;

  /**
   * Webhook URL for delivery status updates
   */
  statusCallback?: string;

  /**
   * Additional provider-specific options
   */
  providerOptions?: Record<string, any>;
}
