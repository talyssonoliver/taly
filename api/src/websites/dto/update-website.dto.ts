import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ThemeSettingsDto } from './theme-settings.dto';
import { SeoSettingsDto, AnalyticsSettingsDto } from './create-website.dto';

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
