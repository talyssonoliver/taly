import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateStaffDto {
	@ApiPropertyOptional({
		description: "Staff bio or description",
		example: "Award-winning stylist with 7 years in the industry.",
	})
	@IsString()
	@IsOptional()
	bio?: string;

	@ApiPropertyOptional({
		description: "Staff position or title",
		example: "Master Stylist",
	})
	@IsString()
	@IsOptional()
	position?: string;

	@ApiPropertyOptional({
		description: "Staff active status",
	})
	@IsBoolean()
	@IsOptional()
	isActive?: boolean;
}