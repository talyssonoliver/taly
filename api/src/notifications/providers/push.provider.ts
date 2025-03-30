import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";

interface PushNotification {
	title: string;
	body: string;
	data?: Record<string, string | number | boolean | null>;
}

interface UserDevice {
	id: string;
	userId: string;
	token: string;
	platform: string;
	lastUsed: Date;
}

@Injectable()
export class PushProvider {
	private readonly logger = new Logger(PushProvider.name);
	private pushClient: admin.messaging.Messaging | null = null;

	constructor(private readonly configService: ConfigService) {
		// Initialize push notification service
		this.initPushClient();
	}

	/**
	 * Initialize push notification client
	 */
	private initPushClient(): void {
		try {
			// Check if push notifications are enabled
			if (!this.configService.get<boolean>("ENABLE_PUSH_NOTIFICATIONS")) {
				this.logger.log("Push notifications are disabled in configuration");
				return;
			}

			// Get Firebase configuration
			const serviceAccountPath = this.configService.get<string>(
				"FIREBASE_SERVICE_ACCOUNT_PATH",
			);
			const firebaseProjectId = this.configService.get<string>(
				"FIREBASE_PROJECT_ID",
			);

			if (!serviceAccountPath) {
				this.logger.warn(
					"FIREBASE_SERVICE_ACCOUNT_PATH not configured, push notifications disabled",
				);
				return;
			}

			// Initialize the Firebase Admin SDK
			let firebaseApp: admin.app.App;

			try {
				// Check if there's an existing Firebase app instance
				firebaseApp = admin.app();
			} catch (error) {
				// Initialize a new Firebase app if none exists
				firebaseApp = admin.initializeApp({
					credential: admin.credential.cert(serviceAccountPath),
					projectId: firebaseProjectId,
				});
				this.logger.log("Firebase Admin SDK initialized successfully");
			}

			// Get the messaging service
			this.pushClient = admin.messaging(firebaseApp);
			this.logger.log("Push notification client initialized successfully");
		} catch (error) {
			this.logger.error(
				`Failed to initialize push client: ${error.message}`,
				error.stack,
			);
		}
	}

	/**
	 * Send a push notification
	 */
	async send(
		userId: string,
		templateKey: string,
		data: Record<string, string | number | boolean | null>,
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Get user device tokens
			const userDevices = await this.getUserDevices(userId);

			if (!userDevices || userDevices.length === 0) {
				this.logger.warn(`No registered devices found for user ${userId}`);
				return {
					success: false,
					error: "No registered devices found for user",
				};
			}

			// Prepare notification content based on template
			const notification = this.prepareNotification(templateKey, data);

			// Send push notifications to all user devices
			const sendPromises = userDevices.map((device) =>
				this.sendToDevice(device.token, notification),
			);

			await Promise.all(sendPromises);

			return { success: true };
		} catch (error) {
			this.logger.error(
				`Failed to send push notification: ${error.message}`,
				error.stack,
			);
			return { success: false, error: error.message };
		}
	}

	/**
	 * Send notification to specific user by ID and notification template
	 * @param userId The user ID to send the notification to
	 * @param title The notification title
	 * @param body The notification body
	 * @param data Optional additional data
	 */
	async sendNotification(
		userId: string,
		title: string,
		body: string,
		data: Record<string, string | number | boolean | null> = {},
	): Promise<boolean> {
		try {
			// Get user device tokens
			const userDevices = await this.getUserDevices(userId);

			if (!userDevices || userDevices.length === 0) {
				this.logger.warn(`No registered devices found for user ${userId}`);
				return false;
			}

			// In a real implementation, you would send to each device token
			for (const device of userDevices) {
				await this.sendToDevice(device.token, { title, body, data });
			}

			return true;
		} catch (error) {
			this.logger.error(
				`Failed to send push notification: ${error.message}`,
				error.stack,
			);
			return false;
		}
	}

	/**
	 * Get notification content based on template
	 * @param template The template name
	 * @param data Template data for replacement
	 */
	getNotificationContent(
		template: string,
		data: any = {},
	): { title: string; body: string } {
		switch (template) {
			case "APPOINTMENT_CONFIRMED":
				return {
					title: "Appointment Confirmed",
					body: `Your appointment on ${data.date} at ${data.time} has been confirmed.`,
				};
			case "APPOINTMENT_REMINDER":
				return {
					title: "Appointment Reminder",
					body: `You have an appointment tomorrow at ${data.time}.`,
				};
			case "APPOINTMENT_RESCHEDULED":
				return {
					title: "Appointment Rescheduled",
					body: `Your appointment has been rescheduled to ${data.date} at ${data.time}.`,
				};
			case "APPOINTMENT_CANCELLED":
				return {
					title: "Appointment Cancelled",
					body: `Your appointment on ${data.date} at ${data.time} has been cancelled.`,
				};
			case "PAYMENT_SUCCESS":
				return {
					title: "Payment Successful",
					body: `Your payment of ${data.amount} ${data.currency} has been processed successfully.`,
				};
			case "PAYMENT_FAILED":
				return {
					title: "Payment Failed",
					body: "Your payment could not be processed. Please check your payment details.",
				};
			default:
				return {
					title: "Notification",
					body: "You have a new notification.",
				};
		}
	}

	/**
	 * Send notification for a specific template
	 * @param userId The user ID
	 * @param template The template name
	 * @param data Template data
	 */
	async sendTemplateNotification(
		userId: string,
		template: string,
		data: any = {},
	): Promise<boolean> {
		const content = this.getNotificationContent(template, data);
		return this.sendNotification(userId, content.title, content.body, data);
	}

	/**
	 * Prepare notification content based on template key
	 */
	private prepareNotification(
		templateKey: string,
		data: any,
	): PushNotification {
		const content = this.getNotificationContent(templateKey, data);

		return {
			title: content.title,
			body: content.body,
			data: data || {},
		};
	}

	/**
	 * Send notification to a specific device
	 */
	private async sendToDevice(
		token: string,
		notification: PushNotification,
	): Promise<void> {
		if (!this.pushClient) {
			// If in development mode, just log it
			if (this.configService.get("NODE_ENV") === "development") {
				this.logger.debug(
					`[DEV MODE] Push notification to ${token}:`,
					notification,
				);
				return;
			}
			throw new Error("Push client not initialized");
		}

		try {
			// Send notification using Firebase Cloud Messaging
			const message: admin.messaging.Message = {
				token,
				notification: {
					title: notification.title,
					body: notification.body,
				},
				data: notification.data,
				android: {
					priority: "high",
					notification: {
						sound: "default",
						priority: "high",
						channelId: "default",
					},
				},
				apns: {
					payload: {
						aps: {
							sound: "default",
							badge: 1,
							contentAvailable: true,
						},
					},
				},
			};

			const response = await this.pushClient.send(message);
			this.logger.log(
				`Push notification sent successfully to ${token}, message ID: ${response}`,
			);
		} catch (error) {
			this.logger.error(
				`Error sending push notification to device ${token}: ${error.message}`,
				error.stack,
			);
			throw error;
		}
	}

	/**
	 * Get user devices
	 * This is a placeholder - in a real application, you would fetch these from your database
	 */
	private async getUserDevices(userId: string): Promise<UserDevice[]> {
		// In a real implementation, you would fetch this from your database
		// Example: return prismaService.userDevice.findMany({ where: { userId } });

		// Mock implementation for now
		this.logger.debug(`Getting devices for user ${userId}`);

		// Return a mock device for development purposes
		return [
			{
				id: `dev-device-${userId}`,
				userId,
				token: `mock-device-token-for-${userId}`,
				platform: "android",
				lastUsed: new Date(),
			},
		];
	}
}
