import { Injectable, Logger } from "@nestjs/common";
import type { ConfigService } from "@nestjs/config";
import * as handlebars from "handlebars";
import * as fs from "node:fs";
import * as path from "node:path";
import * as nodemailer from "nodemailer";

interface UserData {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
}

@Injectable()
export class EmailProvider {
	private readonly logger = new Logger(EmailProvider.name);
	private transporter: nodemailer.Transporter;
	private templateCache: Record<string, handlebars.TemplateDelegate> = {};

	constructor(private configService: ConfigService) {
		// Initialize email transporter
		this.transporter = nodemailer.createTransport({
			host: this.configService.get<string>("EMAIL_HOST"),
			port: this.configService.get<number>("EMAIL_PORT"),
			secure: this.configService.get<boolean>("EMAIL_SECURE", false),
			auth: {
				user: this.configService.get<string>("EMAIL_USER"),
				pass: this.configService.get<string>("EMAIL_PASSWORD"),
			},
		});

		// Load template helpers
		this.registerHelpers();
	}

	/**
	 * Register Handlebars helpers
	 */
	private registerHelpers(): void {
		try {
			// Import helpers from template-helpers.ts
			const helpersPath = path.join(
				__dirname,
				"../templates/email/template-helpers.ts",
			);
			if (fs.existsSync(helpersPath)) {
				const helpers = require(helpersPath);
				for (const [name, fn] of Object.entries(helpers)) {
					handlebars.registerHelper(name, fn as handlebars.HelperDelegate);
				}
			}
		} catch (error) {
			this.logger.error(
				`Failed to register template helpers: ${error instanceof Error ? error.message : "Unknown error"}`,
				error instanceof Error ? error.stack : undefined,
			);
		}
	}

	/**
	 * Load and compile a template
	 */
	private getTemplate(templateKey: string): handlebars.TemplateDelegate {
		if (!this.templateCache[templateKey]) {
			try {
				const templatePath = path.join(
					__dirname,
					`../templates/email/${templateKey}.hbs`,
				);
				const templateSource = fs.readFileSync(templatePath, "utf8");
				this.templateCache[templateKey] = handlebars.compile(templateSource);
			} catch (error) {
				this.logger.error(
					`Failed to load template ${templateKey}: ${error instanceof Error ? error.message : "Unknown error"}`,
					error instanceof Error ? error.stack : undefined,
				);
				throw new Error(`Template ${templateKey} not found`);
			}
		}

		return this.templateCache[templateKey];
	}

	/**
	 * Send an email notification
	 */
	async send(
		userId: string,
		templateKey: string,
		data: any,
	): Promise<{ success: boolean; error?: string }> {
		try {
			// Get user data (you might want to inject a UsersService here)
			const user = await this.getUserData(userId);

			if (!user || !user.email) {
				throw new Error("No email found for user");
			}

			// Compile the template
			const template = this.getTemplate(templateKey);
			const html = template({ ...data, user });

			// Determine subject
			let subject = data.subject || "";
			switch (templateKey) {
				case "appointment-confirmation":
					subject = "Your appointment has been confirmed";
					break;
				case "appointment-reminder":
					subject = "Reminder: Upcoming appointment";
					break;
				case "appointment-reschedule":
					subject = "Your appointment has been rescheduled";
					break;
				case "appointment-cancellation":
					subject = "Your appointment has been cancelled";
					break;
				case "payment-receipt":
					subject = "Payment Receipt";
					break;
				case "welcome":
					subject = "Welcome to our platform";
					break;
				case "password-reset":
					subject = "Password Reset Request";
					break;
			}

			// Send the email
			await this.transporter.sendMail({
				from: this.configService.get<string>("EMAIL_FROM"),
				to: user.email,
				subject,
				html,
			});

			this.logger.log("Email sent:");
			return { success: true };
		} catch (error) {
			this.logger.error("Failed to send email:", error instanceof Error ? error.stack : String(error));
			return { success: false, error: error instanceof Error ? error.message : String(error) };
		}
	}

	private async getUserData(userId: string): Promise<UserData> {
		
		return {
			id: userId,
			email: "user@example.com",
			firstName: "John",
			lastName: "Doe",
		};
	}
}
