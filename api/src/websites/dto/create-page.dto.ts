import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";

export class PageSectionDto {
	@ApiProperty({ description: "Section type", example: "hero" })
	@IsString()
	type: string;

	@ApiProperty({ description: "Section data" })
	@IsObject()
	data: Record<string, unknown>;

	@ApiPropertyOptional({ description: "Section settings" })
	@IsOptional()
	@IsObject()
	settings?: Record<string, unknown>;
}

export class PageSeoDto {
	@ApiPropertyOptional({ description: "SEO title" })
	@IsOptional()
	@IsString()
	title?: string;

	@ApiPropertyOptional({ description: "SEO description" })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ description: "SEO keywords" })
	@IsOptional()
	@IsArray()
	keywords?: string[];

	@ApiPropertyOptional({ description: "Open Graph image" })
	@IsOptional()
	@IsString()
	ogImage?: string;

	@ApiPropertyOptional({ description: "Exclude from search engines" })
	@IsOptional()
	@IsBoolean()
	noIndex?: boolean;
}

export class CreatePageDto {
	@ApiProperty({ description: "Page title" })
	@IsString()
	title: string;

	@ApiProperty({ description: "Page path", example: "/about-us" })
	@IsString()
	path: string;

	@ApiPropertyOptional({ description: "Meta title for SEO" })
	@IsOptional()
	@IsString()
	metaTitle?: string;

	@ApiPropertyOptional({ description: "Meta description for SEO" })
	@IsOptional()
	@IsString()
	metaDescription?: string;

	@ApiPropertyOptional({ description: "Is published", default: true })
	@IsOptional()
	@IsBoolean()
	isPublished?: boolean;

	@ApiPropertyOptional({ description: "Sort order", default: 0 })
	@IsOptional()
	@IsNumber()
	sortOrder?: number;

	@ApiProperty({ description: "Page content" })
	@ValidateNested({ each: true })
	@Type(() => PageSectionDto)
	@IsArray()
	content: PageSectionDto[];
}
