import { IsOptional, IsEnum, IsDateString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import {
	ReminderType,
	ReminderStatus,
} from "../types/appointment-reminder.interface";

export class UpdateAppointmentReminderDto {
	@ApiPropertyOptional({
		description: "Reminder type",
		enum: ReminderType,
		example: ReminderType.SMS,
	})
	@IsEnum(ReminderType)
	@IsOptional()
	type?: ReminderType;

	@ApiPropertyOptional({
		description: "Sent timestamp",
		example: "2023-05-15T14:30:00Z",
	})
	@IsDateString()
	@IsOptional()
	sentAt?: string;

	@ApiPropertyOptional({
		description: "Reminder status",
		enum: ReminderStatus,
		example: ReminderStatus.SENT,
	})
	@IsEnum(ReminderStatus)
	@IsOptional()
	status?: ReminderStatus;
}