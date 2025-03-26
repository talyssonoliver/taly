import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsUUID,
	IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateStaffDto {
	@ApiProperty({
		description: "User ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "User ID is required" })
	userId: string;

	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174001",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiPropertyOptional({
		description: "Staff bio or description",
		example: "Experienced stylist with 5 years in the industry.",
	})
	@IsString()
	@IsOptional()
	bio?: string;

	@ApiPropertyOptional({
		description: "Staff position or title",
		example: "Senior Stylist",
	})
	@IsString()
	@IsOptional()
	position?: string;

	@ApiPropertyOptional({
		description: "Staff active status",
		default: true,
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}