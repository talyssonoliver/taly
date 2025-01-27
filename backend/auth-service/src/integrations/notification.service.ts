import { Injectable, Logger } from "@nestjs/common";
import type { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class NotificationService {
	private readonly logger = new Logger(NotificationService.name);

	constructor(private readonly httpService: HttpService) {}

	/**
	 * @param payload 
	 */
	async sendEmail(payload: {
		to: string;
		subject: string;
		body: string;
	}): Promise<void> {
		try {
			const response = await firstValueFrom(
				this.httpService.post(
					"http://notification-service.local/api/v1/emails",
					payload,
				),
			);
			this.logger.log(
				`Email enviado para ${payload.to}. Status: ${response.status}`,
			);
		} catch (error) {
			this.logger.error(
				`Erro ao enviar email para ${payload.to}: ${(error as Error).message}`,
			);
			throw new Error("Failed to send email");
		}
	}

	/**
	 * @param payload 
	 */
	async sendSMS(payload: { to: string; message: string }): Promise<void> {
		try {
			const response = await firstValueFrom(
				this.httpService.post(
					"http://notification-service.local/api/v1/sms",
					payload,
				),
			);
			this.logger.log(
				`SMS enviado para ${payload.to}. Status: ${response.status}`,
			);
		} catch (error) {
			this.logger.error(
				`Erro ao enviar SMS para ${payload.to}: ${(error as Error).message}`,
			);
			throw new Error("Failed to send SMS");
		}
	}

	/**
	 * @param type 
	 * @param payload 
	 */
	async sendNotification(type: "email" | "sms", payload: any): Promise<void> {
		if (type === "email") {
			await this.sendEmail(payload);
		} else if (type === "sms") {
			await this.sendSMS(payload);
		} else {
			this.logger.error(`Tipo de notificação desconhecido: ${type}`);
			throw new Error("Unsupported notification type");
		}
	}
}
