/**
 * Options for sending email notifications
 */
export interface IEmailOptions {
  /**
   * Sender email address
   */
  from?: string;

  /**
   * Recipient email address(es)
   */
  to: string | string[];

  /**
   * CC recipients
   */
  cc?: string | string[];

  /**
   * BCC recipients
   */
  bcc?: string | string[];

  /**
   * Email subject
   */
  subject: string;

  /**
   * HTML content
   */
  html: string;

  /**
   * Plain text content (fallback for HTML)
   */
  text?: string;

  /**
   * Email attachments
   */
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
    encoding?: string;
    cid?: string;
  }>;

  /**
   * Reply-to email address
   */
  replyTo?: string;

  /**
   * Email headers
   */
  headers?: Record<string, string>;

  /**
   * Email template ID (for external providers like SendGrid, Mailchimp, etc.)
   */
  templateId?: string;

  /**
   * Template variables (for external providers)
   */
  templateVariables?: Record<string, any>;
}
