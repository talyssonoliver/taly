import { IsString, IsOptional, IsBoolean, Matches } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStaffScheduleDto {
	@ApiPropertyOptional({
		description: "Start time (format: HH:MM)",
		example: "10:00",
	})
	@IsString()
	@Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "Start time must be in HH:MM format",
	})
	@IsOptional()
	startTime?: string;

	@ApiPropertyOptional({
		description: "End time (format: HH:MM)",
		example: "18:00",
	})
	@IsString()
	@Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
		message: "End time must be in HH:MM format",
	})
	@IsOptional()
	endTime?: string;

	@ApiPropertyOptional({
		description: "Schedule active status",
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}