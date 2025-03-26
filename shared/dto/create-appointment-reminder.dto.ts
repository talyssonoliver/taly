import {
	IsNotEmpty,
	IsOptional,
	IsUUID,
	IsEnum,
	IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	ReminderType,
	ReminderStatus,
} from "../types/appointment-reminder.interface";

export class CreateAppointmentReminderDto {
	@ApiProperty({
		description: "Appointment ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Appointment ID is required" })
	appointmentId: string;

	@ApiProperty({
		description: "Reminder type",
		enum: ReminderType,
		example: ReminderType.EMAIL,
	})
	@IsEnum(ReminderType)
	@IsNotEmpty({ message: "Reminder type is required" })
	type: ReminderType;

	@ApiPropertyOptional({
		description: "Sent timestamp",
		example: "2023-05-15T14:30:00Z",
	})
	@IsDateString()
	@IsOptional()
	sentAt?: string;

	@ApiProperty({
		description: "Reminder status",
		enum: ReminderStatus,
		example: ReminderStatus.PENDING,
	})
	@IsEnum(ReminderStatus)
	@IsNotEmpty({ message: "Status is required" })
	status: ReminderStatus;
}