import { Injectable, Logger } from "@nestjs/common";
import { Appointment } from "../appointments/interfaces/appointment.interface";
import { NotificationType } from "../common/enums/notification-type.enum";
import { PrismaService } from "../database/prisma.service";
import { INotification } from "./interfaces/notification.interface";

// Define interfaces for notification data
interface AppointmentNotificationData {
	appointment: Partial<Appointment> & { userId?: string };
	user: { id: string; phoneNumber?: string };
	service?: Record<string, unknown>;
	reason?: string;
}

@Injectable()
export class NotificationsService {
	private readonly logger = new Logger(NotificationsService.name);

	constructor(private readonly prisma: PrismaService) {}

	/**
	 * Send a notification using the specified channel and template
	 * @param userId - The user ID to send the notification to
	 * @param type - The notification type (EMAIL, SMS, PUSH)
	 * @param templateKey - The template key to use
	 * @param data - The data to populate the template
	 */
	async sendNotification(
		userId: string,
		type: string,
		templateKey: string,
		data: Record<string, unknown>,
	): Promise<INotification> {
		try {
			// Log notification
			this.logger.log(
				`Sending ${type} notification to user ${userId} using template ${templateKey}`,
			);

			// Create notification record
			const notification = await this.prisma.notification.create({
				data: {
					userId,
					type,
					templateKey,
					content: JSON.stringify(data),
					sent: true,
					sentAt: new Date(),
				},
			});

			// Add code to actually send the notification via email, SMS, etc.
			// This would typically involve external services

			return notification;
		} catch (error) {
			this.logger.error(`Error sending notification: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Send an appointment confirmation notification
	 */
	async sendAppointmentConfirmation(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-confirmation",
			appointmentData as unknown as Record<string, unknown>,
		);

		// Send SMS notification if phone is available
		if (appointmentData.user?.phoneNumber) {
			await this.sendNotification(
				userId,
				NotificationType.SMS,
				"appointment-confirmation",
				appointmentData as unknown as Record<string, unknown>,
			);
		}
	}

	/**
	 * Send an appointment reminder notification
	 */
	async sendAppointmentReminder(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-reminder",
			appointmentData as unknown as Record<string, unknown>,
		);

		// Send SMS notification if phone is available
		if (appointmentData.user?.phoneNumber) {
			await this.sendNotification(
				userId,
				NotificationType.SMS,
				"appointment-reminder",
				appointmentData as unknown as Record<string, unknown>,
			);
		}
	}

	/**
	 * Send an appointment reschedule notification
	 */
	async sendAppointmentReschedule(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-reschedule",
			appointmentData as unknown as Record<string, unknown>,
		);

		// Send SMS notification if phone is available
		if (appointmentData.user?.phoneNumber) {
			await this.sendNotification(
				userId,
				NotificationType.SMS,
				"appointment-reschedule",
				appointmentData as unknown as Record<string, unknown>,
			);
		}
	}

	/**
	 * Send an appointment cancellation notification
	 */
	async sendAppointmentCancellation(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-cancellation",
			appointmentData as unknown as Record<string, unknown>,
		);

		// Send SMS notification if phone is available
		if (appointmentData.user?.phoneNumber) {
			await this.sendNotification(
				userId,
				NotificationType.SMS,
				"appointment-cancellation",
				appointmentData as unknown as Record<string, unknown>,
			);
		}
	}

	/**
	 * Send an appointment confirmation notification (alias for sendAppointmentConfirmation)
	 */
	async sendAppointmentConfirmed(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (appointmentData?.appointment?.userId) {
			await this.sendAppointmentConfirmation(
				appointmentData.appointment.userId,
				appointmentData,
			);
		}
	}

	/**
	 * Send a no-show notification
	 */
	async sendNoShowNotification(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-no-show",
			appointmentData as unknown as Record<string, unknown>,
		);

		// Send SMS notification if phone is available
		if (appointmentData.user?.phoneNumber) {
			await this.sendNotification(
				userId,
				NotificationType.SMS,
				"appointment-no-show",
				appointmentData as unknown as Record<string, unknown>,
			);
		}
	}

	/**
	 * Send a feedback request notification
	 */
	async sendFeedbackRequest(
		userId: string,
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-feedback",
			appointmentData as unknown as Record<string, unknown>,
		);
	}

	/**
	 * Send a cancelation notification (alias for sendAppointmentCancellation)
	 */
	async sendAppointmentCancelled(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (appointmentData?.appointment?.userId) {
			await this.sendAppointmentCancellation(
				appointmentData.appointment.userId,
				appointmentData,
			);
		}
	}

	/**
	 * Send a rescheduled notification (alias for sendAppointmentReschedule)
	 */
	async sendAppointmentRescheduled(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (appointmentData?.appointment?.userId) {
			await this.sendAppointmentReschedule(
				appointmentData.appointment.userId,
				appointmentData,
			);
		}
	}
}
