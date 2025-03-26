import {
	IsString,
	IsOptional,
	IsUUID,
	IsBoolean,
	IsNumber,
	Min,
	Max,
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class UpdateServiceDto {
	@ApiPropertyOptional({
		description: "Staff ID for staff-specific services",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@ApiPropertyOptional({
		description: "Service name",
		example: "Premium Haircut",
	})
	@IsString()
	@IsOptional()
	name?: string;

	@ApiPropertyOptional({
		description: "Service description",
		example: "Professional haircut with consultation and styling",
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiPropertyOptional({
		description: "Service duration in minutes",
		example: 45,
		minimum: 5,
		maximum: 480,
	})
	@IsNumber()
	@Min(5, { message: "Duration must be at least 5 minutes" })
	@Max(480, { message: "Duration cannot exceed 8 hours (480 minutes)" })
	@Type(() => Number)
	@IsOptional()
	duration?: number;

	@ApiPropertyOptional({
		description: "Service price",
		example: 40.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Price cannot be negative" })
	@Type(() => Number)
	@IsOptional()
	price?: number;

	@ApiPropertyOptional({
		description: "Service discount price",
		example: 35.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Discount cannot be negative" })
	@Type(() => Number)
	@IsOptional()
	discount?: number;

	@ApiPropertyOptional({
		description: "Service active status",
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@ApiPropertyOptional({
		description: "Service availability",
	})
	@IsBoolean()
	@IsOptional()
	available?: boolean;

	@ApiPropertyOptional({
		description: "Service image URL",
		example: "https://example.com/images/premium-haircut.jpg",
	})
	@IsString()
	@IsOptional()
	imageServiceUrl?: string;
}