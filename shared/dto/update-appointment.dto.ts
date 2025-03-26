import {
	IsString,
	IsOptional,
	IsUUID,
	IsEnum,
	IsDateString,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AppointmentStatus } from "../types/appointment.interface";

export class UpdateAppointmentDto {
	@ApiPropertyOptional({
		description: "Staff ID",
		example: "123e4567-e89b-12d3-a456-426614174003",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@ApiPropertyOptional({
		description: "Appointment start time",
		example: "2023-05-15T14:30:00Z",
	})
	@IsDateString()
	@IsOptional()
	startTime?: string;

	@ApiPropertyOptional({
		description: "Appointment end time",
		example: "2023-05-15T15:00:00Z",
	})
	@IsDateString()
	@IsOptional()
	endTime?: string;

	@ApiPropertyOptional({
		description: "Appointment status",
		enum: AppointmentStatus,
	})
	@IsEnum(AppointmentStatus)
	@IsOptional()
	status?: AppointmentStatus;

	@ApiPropertyOptional({
		description: "Appointment notes",
		example: "Client prefers natural products",
	})
	@IsString()
	@IsOptional()
	notes?: string;
}