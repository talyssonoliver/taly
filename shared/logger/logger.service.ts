import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
	log(message: string, context?: string): void {
		const contextText = context ? `[${context}] ` : "";
		console.log(`${new Date().toISOString()} - INFO: ${contextText}${message}`);
	}

	warn(message: string, context?: string): void {
		const contextText = context ? `[${context}] ` : "";
		console.warn(
			`${new Date().toISOString()} - WARN: ${contextText}${message}`,
		);
	}

	error(message: string, error?: Error, context?: string): void {
		const contextText = context ? `[${context}] ` : "";
		console.error(
			`${new Date().toISOString()} - ERROR: ${contextText}${message}`,
		);
		if (error?.stack) {
			console.error(error.stack);
		}
	}
}
