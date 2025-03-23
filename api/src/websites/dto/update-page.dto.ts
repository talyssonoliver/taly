import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { PageSectionDto } from "./create-page.dto";

export class UpdatePageDto {
	@ApiPropertyOptional({ description: "Page title" })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional({ description: "Page path", example: "/about-us" })
	@IsOptional()
	@IsString()
	path?: string;

	@ApiPropertyOptional({ description: "Meta title for SEO" })
	@IsOptional()
	@IsString()
	metaTitle?: string;

	@ApiPropertyOptional({ description: "Meta description for SEO" })
	@IsOptional()
	@IsString()
	metaDescription?: string;

	@ApiPropertyOptional({ description: "Is published" })
	@IsOptional()
	@IsBoolean()
	isPublished?: boolean;

	@ApiPropertyOptional({ description: "Sort order" })
	@IsOptional()
	@IsNumber()
	sortOrder?: number;

	@ApiPropertyOptional({ description: "Page content" })
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => PageSectionDto)
	content?: PageSectionDto[];
}
