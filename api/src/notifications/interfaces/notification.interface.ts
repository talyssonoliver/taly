import { NotificationType, NotificationStatus } from '../entities/notification.entity';

export interface INotification {
  /**
   * Unique identifier for the notification
   */
  id: string;

  /**
   * ID of the user who should receive the notification
   */
  userId: string;

  /**
   * Type of notification
   */
  type: NotificationType;

  /**
   * Template identifier used for this notification
   */
  templateKey: string;

  /**
   * Content of the notification (may be JSON)
   */
  content: string;

  /**
   * Current status of the notification
   */
  status: NotificationStatus;

  /**
   * When the notification was sent
   */
  sentAt?: Date;

  /**
   * When the notification was delivered
   */
  deliveredAt?: Date;

  /**
   * When the notification was read by the user
   */
  readAt?: Date;

  /**
   * Error message if sending failed
   */
  error?: string;

  /**
   * Additional metadata
   */
  metadata?: Record<string, unknown>;

  /**
   * When the notification was created
   */
  createdAt: Date;

  /**
   * When the notification was last updated
   */
  updatedAt: Date;
}
