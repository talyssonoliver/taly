import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsBoolean, 
  IsObject, 
  IsOptional, 
  IsUUID,
  IsArray,
  IsNumber,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class PageSectionDto {
  @ApiProperty({ description: 'Section type', example: 'hero' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Section data' })
  @IsObject()
  data: any;

  @ApiPropertyOptional({ description: 'Section settings' })
  @IsOptional()
  @IsObject()
  settings?: any;
}

export class PageSeoDto {
  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'SEO description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'SEO keywords' })
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Open Graph image' })
  @IsOptional()
  @IsString()
  ogImage?: string;

  @ApiPropertyOptional({ description: 'Exclude from search engines' })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;
}

export class CreatePageDto {
  @ApiProperty({ description: 'Page title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Page slug', example: 'about-us' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Page path', example: '/about-us' })
  @IsString()
  path: string;

  @ApiPropertyOptional({ description: 'Is home page', default: false })
  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @ApiPropertyOptional({ description: 'Is published', default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Sort order', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({ description: 'Page content' })
  @IsObject()
  content: {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PageSectionDto)
    sections: PageSectionDto[];
  };

  @ApiPropertyOptional({ description: 'SEO settings' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PageSeoDto)
  seo?: PageSeoDto;
}

export class UpdatePageDto {
  @ApiPropertyOptional({ description: 'Page title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Page slug', example: 'about-us' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Page path', example: '/about-us' })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: 'Is home page' })
  @IsOptional()
  @IsBoolean()
  isHomePage?: boolean;

  @ApiPropertyOptional({ description: 'Is published' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Page content' })
  @IsOptional()
  @IsObject()
  content?: {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PageSectionDto)
    sections: PageSectionDto[];
  };

  @ApiPropertyOptional({ description: 'SEO settings' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PageSeoDto)
  seo?: PageSeoDto;
}

export class PageResponseDto {
  @ApiProperty({ description: 'Page ID' })
  id: string;

  @ApiProperty({ description: 'Website ID' })
  websiteId: string;

  @ApiProperty({ description: 'Page title' })
  title: string;

  @ApiProperty({ description: 'Page slug' })
  slug: string;

  @ApiProperty({ description: 'Page path' })
  path: string;

  @ApiProperty({ description: 'Is home page' })
  isHomePage: boolean;

  @ApiProperty({ description: 'Is published' })
  isPublished: boolean;

  @ApiProperty({ description: 'Sort order' })
  sortOrder: number;

  @ApiProperty({ description: 'Page content' })
  content: {
    sections: PageSectionDto[];
  };

  @ApiPropertyOptional({ description: 'SEO settings' })
  seo?: PageSeoDto;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiPropertyOptional({ description: 'Last published date' })
  lastPublishedAt?: Date;
}
