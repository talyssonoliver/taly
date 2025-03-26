import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsEnum,
	IsDateString,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { AppointmentStatus } from "../types/appointment.interface";

export class CreateAppointmentDto {
	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiProperty({
		description: "Client ID",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Client ID is required" })
	clientId: string;

	@ApiProperty({
		description: "Service ID",
		example: "123e4567-e89b-12d3-a456-426614174002",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Service ID is required" })
	serviceId: string;

	@ApiPropertyOptional({
		description: "Staff ID",
		example: "123e4567-e89b-12d3-a456-426614174003",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@ApiProperty({
		description: "Appointment start time",
		example: "2023-05-15T14:30:00Z",
	})
	@IsDateString()
	@IsNotEmpty({ message: "Start time is required" })
	startTime: string;

	@ApiProperty({
		description: "Appointment end time",
		example: "2023-05-15T15:00:00Z",
	})
	@IsDateString()
	@IsNotEmpty({ message: "End time is required" })
	endTime: string;

	@ApiPropertyOptional({
		description: "Appointment status",
		enum: AppointmentStatus,
		default: AppointmentStatus.SCHEDULED,
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