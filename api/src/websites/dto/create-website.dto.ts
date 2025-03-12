import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ThemeSettingsDto } from './theme-settings.dto';

export class SeoSettingsDto {
  @ApiPropertyOptional({ description: 'SEO title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'SEO description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'SEO keywords', type: [String] })
  @IsOptional()
  @IsArray()
  keywords?: string[];
}

export class AnalyticsSettingsDto {
  @ApiPropertyOptional({ description: 'Google Analytics ID' })
  @IsOptional()
  @IsString()
  googleAnalyticsId?: string;
}

export class CreateWebsiteDto {
  @ApiProperty({ description: 'Website name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Website description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Theme ID' })
  @IsNotEmpty()
  @IsUUID()
  themeId: string;

  @ApiPropertyOptional({ description: 'Is website published', default: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ description: 'User ID' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Theme settings' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  themeSettings?: ThemeSettingsDto;

  @ApiPropertyOptional({ description: 'Website settings' })
  @IsOptional()
  @IsObject()
  settings?: {
    @ValidateNested()
    @Type(() => SeoSettingsDto)
    seo?: SeoSettingsDto;

    @ValidateNested()
    @Type(() => AnalyticsSettingsDto)
    analytics?: AnalyticsSettingsDto;
  };
}
