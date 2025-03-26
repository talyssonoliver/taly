import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsBoolean,
	IsNumber,
	Min,
	Max,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateServiceDto {
	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiPropertyOptional({
		description: "Staff ID for staff-specific services",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsOptional()
	staffId?: string;

	@ApiProperty({
		description: "Service name",
		example: "Haircut",
	})
	@IsString()
	@IsNotEmpty({ message: "Service name is required" })
	name: string;

	@ApiPropertyOptional({
		description: "Service description",
		example: "Professional haircut with consultation",
	})
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({
		description: "Service duration in minutes",
		example: 30,
		minimum: 5,
		maximum: 480,
	})
	@IsNumber()
	@Min(5, { message: "Duration must be at least 5 minutes" })
	@Max(480, { message: "Duration cannot exceed 8 hours (480 minutes)" })
	@Type(() => Number)
	@IsNotEmpty({ message: "Duration is required" })
	duration: number;

	@ApiProperty({
		description: "Service price",
		example: 35.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Price cannot be negative" })
	@Type(() => Number)
	@IsNotEmpty({ message: "Price is required" })
	price: number;

	@ApiPropertyOptional({
		description: "Service discount price",
		example: 30.0,
		minimum: 0,
	})
	@IsNumber()
	@Min(0, { message: "Discount cannot be negative" })
	@Type(() => Number)
	@IsOptional()
	discount?: number;

	@ApiPropertyOptional({
		description: "Service active status",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;

	@ApiPropertyOptional({
		description: "Service availability",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	available?: boolean;

	@ApiPropertyOptional({
		description: "Service image URL",
		example: "https://example.com/images/haircut.jpg",
	})
	@IsString()
	@IsOptional()
	imageServiceUrl?: string;
}