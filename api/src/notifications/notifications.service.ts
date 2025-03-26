import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { NotificationType } from "../common/enums/notification-type.enum";
import { Appointment } from "../appointments/interfaces/appointment.interface";
import type { Notification } from "./entities/notification.entity";


// Define interfaces for notification data
interface AppointmentNotificationData {
	appointment: Partial<Appointment>;
	user?: {
		id: string;
		email?: string;
		phoneNumber?: string;
		firstName?: string;
		lastName?: string;
	};
	service?: {
		id?: string;
		name?: string;
		duration?: number;
		price?: number;
	};
	salon?: {
		id?: string;
		name?: string;
		address?: string;
		phoneNumber?: string;
	};
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
		data: { appointment?: { id?: string } } & Record<string, unknown>,
	): Promise<Notification> {
		try {
			// Log notification
			this.logger.log(
				`Sending ${type} notification to user ${userId} using template ${templateKey}`,
			);

			// Create notification record with properly typed data
			const notificationData = {
				type,
				status: "sent",
				sentAt: new Date(),
				...(data.appointment?.id 
					? { appointment: { connect: { id: data.appointment.id } } } 
					: {})
			};

			const notification = await this.prisma.appointmentReminder.create({
				data: notificationData,
			});
			// Add code to actually send the notification via email, SMS, etc.
			// This would typically involve external services

			return {
				id: notification.id,
				userId,
				type,
				templateKey,
				content: JSON.stringify(data),
				sent: true,
				sentAt: notification.sentAt,
				createdAt: notification.createdAt,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			this.logger.error(`Error sending notification: ${errorMessage}`);
			throw error;
		}
	}

	/**
	 * Send an appointment confirmation notification
	 */
	async sendAppointmentConfirmation(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn(
				"Missing appointment or user data for confirmation notification",
			);
			return;
		}

		const userId = appointmentData.user.id;

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
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn(
				"Missing appointment or user data for reminder notification",
			);
			return;
		}

		const userId = appointmentData.user.id;

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
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn(
				"Missing appointment or user data for reschedule notification",
			);
			return;
		}

		const userId = appointmentData.user.id;

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
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn(
				"Missing appointment or user data for cancellation notification",
			);
			return;
		}

		const userId = appointmentData.user.id;

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
	 * Send an appointment confirmation notification (alias method)
	 */
	async sendAppointmentConfirmed(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		await this.sendAppointmentConfirmation(appointmentData);
	}

	/**
	 * Send a no-show notification
	 */
	async sendNoShowNotification(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn(
				"Missing appointment or user data for no-show notification",
			);
			return;
		}

		const userId = appointmentData.user.id;

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
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		if (!appointmentData.appointment || !appointmentData.user?.id) {
			this.logger.warn("Missing appointment or user data for feedback request");
			return;
		}

		const userId = appointmentData.user.id;

		// Send email notification
		await this.sendNotification(
			userId,
			NotificationType.EMAIL,
			"appointment-feedback",
			appointmentData as unknown as Record<string, unknown>,
		);
	}

	/**
	 * Send a cancellation notification (alias for sendAppointmentCancellation)
	 */
	async sendAppointmentCancelled(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		await this.sendAppointmentCancellation(appointmentData);
	}

	/**
	 * Send a rescheduled notification (alias for sendAppointmentReschedule)
	 */
	async sendAppointmentRescheduled(
		appointmentData: AppointmentNotificationData,
	): Promise<void> {
		await this.sendAppointmentReschedule(appointmentData);
	}
}