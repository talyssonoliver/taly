import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { AnalyticsSettingsDto, SeoSettingsDto } from './create-website.dto';
import { ThemeSettingsDto } from './theme-settings.dto';

export class UpdateWebsiteDto {
  @ApiPropertyOptional({ description: 'Website name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Website description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Theme ID' })
  @IsOptional()
  @IsUUID()
  themeId?: string;

  @ApiPropertyOptional({ description: 'Is website published' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: 'Website URL' })
  @IsOptional()
  @IsString()
  url?: string;

  @ApiPropertyOptional({ description: 'Published date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  publishedAt?: Date;

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
