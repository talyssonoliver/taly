import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsEnum,
	IsBoolean,
	Matches,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DayOfWeek } from "../types/working-hours.interface";

export class CreateStaffScheduleDto {
	@ApiProperty({
		description: "Staff ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Staff ID is required" })
	staffId: string;

	@ApiProperty({
		description: "Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)",
		enum: DayOfWeek,
		example: DayOfWeek.MONDAY,
	})
	@IsEnum(DayOfWeek)
	@IsNotEmpty({ message: "Day of week is required" })
	dayOfWeek: DayOfWeek;

	@ApiProperty({
		description: "Start time (format: HH:MM)",
		example: "09:00",
	})
	@IsString()
	@Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "Start time must be in HH:MM format",
	})
	@IsNotEmpty({ message: "Start time is required" })
	startTime: string;

	@ApiProperty({
		description: "End time (format: HH:MM)",
		example: "17:00",
	})
	@IsString()
	@Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "End time must be in HH:MM format",
	})
	@IsNotEmpty({ message: "End time is required" })
	endTime: string;

	@ApiPropertyOptional({
		description: "Schedule active status",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}