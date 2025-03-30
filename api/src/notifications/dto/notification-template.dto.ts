import { Field, ObjectType } from "@nestjs/graphql";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";
import { NotificationType } from "../entities/notification.entity";

export enum NotificationChannel {
	EMAIL = "email",
	SMS = "sms",
	PUSH = "push",
}

@ObjectType()
export class NotificationTemplateDto {
	@ApiProperty({ description: "Template ID" })
	@Field()
	@IsString()
	id: string;

	@ApiProperty({ description: "Template name" })
	@Field()
	@IsString()
	name: string;

	@ApiProperty({ description: "Template type", enum: NotificationType })
	@IsEnum(NotificationType)
	@Field(() => String)
	type: NotificationType;

	@ApiProperty({ description: "Template subject (for emails)" })
	@IsString()
	@IsNotEmpty()
	@Field()
	subject: string;

	@ApiProperty({ description: "Template content" })
	@IsString()
	@IsNotEmpty()
	@Field()
	content: string;

	@ApiPropertyOptional({ description: "Custom variables used in the template" })
	@IsOptional()
	@Field(() => String, { nullable: true })
	variables?: string;

	@ApiProperty({ description: "Template creation date" })
	@Field()
	createdAt: Date;

	@ApiProperty({ description: "Template last update date" })
	@Field()
	updatedAt: Date;

	@ApiProperty({ description: "Template channel", enum: NotificationChannel })
	@IsEnum(NotificationChannel)
	@Field(() => String)
	channel: NotificationChannel;

	static formatVariables(
		template: NotificationTemplateDto,
		data: Record<string, unknown>,
	): Record<string, unknown> {
		try {
			const variables = template.variables
				? JSON.parse(template.variables)
				: {};

			// Merge provided data with template variables
			const mergedVariables: Record<string, unknown> = {
				...variables,
				...data,
			};

			return mergedVariables;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			console.error(`Error parsing template variables: ${errorMessage}`);
			return data;
		}
	}

	static processTemplate(
		template: NotificationTemplateDto,
		data: Record<string, unknown>,
	): { subject: string; content: string } {
		const variables = this.formatVariables(template, data);

		let subject = template.subject ?? "";
		let content = template.content ?? "";

		// Replace variables in subject and content
		for (const [key, value] of Object.entries(variables)) {
			const placeholder = `{{${key}}}`;
			const stringValue =
				value !== null && value !== undefined ? String(value) : "";

			subject = subject.replace(new RegExp(placeholder, "g"), stringValue);
			content = content.replace(new RegExp(placeholder, "g"), stringValue);
		}

		return { subject, content };
	}

	static generatePreviewTemplate(
		template: string,
		data: Record<string, string>,
	): string {
		// ...existing code...
		return template;
	}

	static replaceTokens(template: string, data: Record<string, string>): string {
		// ...existing code...
		return template;
	}
}

export class CreateNotificationTemplateDto {
	@ApiProperty({
		description: "Template unique key identifier",
		example: "appointment-confirmation",
	})
	@IsNotEmpty()
	@IsString()
	key: string;

	@ApiProperty({
		description: "Type of notification this template is for",
		enum: NotificationType,
		example: NotificationType.EMAIL,
	})
	@IsNotEmpty()
	@IsEnum(NotificationType)
	type: NotificationType;

	@ApiProperty({
		description: "Name of the template",
		example: "Appointment Confirmation Email",
	})
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({
		description: "Description of the template",
		example: "Email sent to customers when their appointment is confirmed",
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		description: "Subject line (for email templates)",
		example: "Your appointment has been confirmed",
	})
	@IsNotEmpty()
	@IsString()
	subject: string;

	@ApiProperty({
		description: "Content of the template",
		example: "<h1>Your appointment is confirmed</h1><p>Dear {{name}},</p>...",
	})
	@IsNotEmpty()
	@IsString()
	content: string;

	@ApiProperty({
		description: "Whether this template is active",
		example: true,
		default: true,
	})
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty({
		description: "Default variables for the template",
		example: {
			companyName: "Our Company",
			supportEmail: "support@example.com",
		},
		required: false,
	})
	@IsOptional()
	@IsObject()
	defaultVariables?: Record<string, any>;
}

export class UpdateNotificationTemplateDto {
	@ApiProperty({
		description: "Name of the template",
		example: "Appointment Confirmation Email",
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		description: "Description of the template",
		example: "Email sent to customers when their appointment is confirmed",
		required: false,
	})
	@IsOptional()
	@IsString()
	description?: string;

	@ApiProperty({
		description: "Subject line (for email templates)",
		example: "Your appointment has been confirmed",
		required: false,
	})
	@IsOptional()
	@IsString()
	subject?: string;

	@ApiProperty({
		description: "Content of the template",
		example: "<h1>Your appointment is confirmed</h1><p>Dear {{name}},</p>...",
		required: false,
	})
	@IsOptional()
	@IsString()
	content?: string;

	@ApiProperty({
		description: "Whether this template is active",
		example: true,
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	isActive?: boolean;

	@ApiProperty({
		description: "Default variables for the template",
		example: {
			companyName: "Our Company",
			supportEmail: "support@example.com",
		},
		required: false,
	})
	@IsOptional()
	@IsObject()
	defaultVariables?: Record<string, any>;
}
