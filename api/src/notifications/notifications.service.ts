import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from './repositories/notification.repository';
import { NotificationFactory } from './providers/notification-factory';
import { Notification } from './entities/notification.entity';
import { NotificationStatus, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationFactory: NotificationFactory,
  ) {}

  /**
   * Get notifications for a specific user
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  /**
   * Get a specific notification by ID
   */
  async getNotificationById(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(Notification with ID \ not found);
    }
    return notification;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.getNotificationById(id);
    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * Send a notification of a specific type
   * @param userId - The recipient user ID
   * @param type - The notification type (email, sms, push)
   * @param templateKey - The template identifier
   * @param data - The data to populate the template
   */
  async sendNotification(
    userId: string, 
    type: string, 
    templateKey: string, 
    data: any
  ): Promise<Notification> {
    try {
      // Create notification record
      const notification = new Notification();
      notification.userId = userId;
      notification.type = type as NotificationType;
      notification.templateKey = templateKey;
      notification.content = JSON.stringify(data);
      notification.status = NotificationStatus.PENDING;
      
      // Save to database first to get an ID
      const savedNotification = await this.notificationRepository.save(notification);
      
      // Send the notification through appropriate provider
      const provider = this.notificationFactory.getProvider(type);
      const result = await provider.send(userId, templateKey, data);
      
      // Update notification record with result
      savedNotification.status = result.success 
        ? NotificationStatus.SENT 
        : NotificationStatus.FAILED;
      savedNotification.sentAt = result.success ? new Date() : null;
      savedNotification.error = result.error || null;
      
      return this.notificationRepository.save(savedNotification);
    } catch (error) {
      this.logger.error(Failed to send notification: \, error.stack);
      
      // Create a failed notification record
      const failedNotification = new Notification();
      failedNotification.userId = userId;
      failedNotification.type = type as NotificationType;
      failedNotification.templateKey = templateKey;
      failedNotification.content = JSON.stringify(data);
      failedNotification.status = NotificationStatus.FAILED;
      failedNotification.error = error.message;
      
      return this.notificationRepository.save(failedNotification);
    }
  }

  /**
   * Send an appointment confirmation notification
   */
  async sendAppointmentConfirmation(userId: string, appointmentData: any): Promise<void> {
    // Send email notification
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'appointment-confirmation',
      appointmentData,
    );
    
    // Send SMS notification if phone is available
    if (appointmentData.phoneNumber) {
      await this.sendNotification(
        userId,
        NotificationType.SMS,
        'appointment-confirmation',
        appointmentData,
      );
    }
  }

  /**
   * Send an appointment reminder notification
   */
  async sendAppointmentReminder(userId: string, appointmentData: any): Promise<void> {
    // Send email notification
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'appointment-reminder',
      appointmentData,
    );
    
    // Send SMS notification if phone is available
    if (appointmentData.phoneNumber) {
      await this.sendNotification(
        userId,
        NotificationType.SMS,
        'appointment-reminder',
        appointmentData,
      );
    }
  }

  /**
   * Send an appointment reschedule notification
   */
  async sendAppointmentReschedule(userId: string, appointmentData: any): Promise<void> {
    // Send email notification
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'appointment-reschedule',
      appointmentData,
    );
    
    // Send SMS notification if phone is available
    if (appointmentData.phoneNumber) {
      await this.sendNotification(
        userId,
        NotificationType.SMS,
        'appointment-reschedule',
        appointmentData,
      );
    }
  }

  /**
   * Send an appointment cancellation notification
   */
  async sendAppointmentCancellation(userId: string, appointmentData: any): Promise<void> {
    // Send email notification
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'appointment-cancellation',
      appointmentData,
    );
    
    // Send SMS notification if phone is available
    if (appointmentData.phoneNumber) {
      await this.sendNotification(
        userId,
        NotificationType.SMS,
        'appointment-cancellation',
        appointmentData,
      );
    }
  }

  /**
   * Send a payment receipt notification
   */
  async sendPaymentReceipt(userId: string, paymentData: any): Promise<void> {
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'payment-receipt',
      paymentData,
    );
  }

  /**
   * Send a welcome notification
   */
  async sendWelcomeNotification(userId: string, userData: any): Promise<void> {
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'welcome',
      userData,
    );
  }

  /**
   * Send a password reset notification
   */
  async sendPasswordResetNotification(userId: string, resetData: any): Promise<void> {
    await this.sendNotification(
      userId,
      NotificationType.EMAIL,
      'password-reset',
      resetData,
    );
  }
}
