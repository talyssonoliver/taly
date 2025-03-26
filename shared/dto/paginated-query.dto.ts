import { IsOptional, IsInt, Min, Max } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class PaginatedQueryDto {
	@ApiPropertyOptional({
		description: "Page number (starts from 1)",
		default: 1,
		minimum: 1,
	})
	@IsInt()
	@Min(1)
	@IsOptional()
	@Type(() => Number)
	page?: number = 1;

	@ApiPropertyOptional({
		description: "Number of items per page",
		default: 10,
		minimum: 1,
		maximum: 100,
	})
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	@Type(() => Number)
	limit?: number = 10;
}