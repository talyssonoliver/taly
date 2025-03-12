import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsString, IsEnum, IsOptional, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum HeaderStyle {
  FIXED = 'fixed',
  STATIC = 'static',
  HIDDEN = 'hidden',
}

export enum FooterStyle {
  MINIMAL = 'minimal',
  FULL = 'full',
  HIDDEN = 'hidden',
}

export enum ContentWidth {
  FULL = 'full',
  CONTAINED = 'contained',
}

export class ColorsDto {
  @ApiProperty({ description: 'Primary color (hex)', example: '#3b82f6' })
  @IsString()
  primary: string;

  @ApiProperty({ description: 'Secondary color (hex)', example: '#6b7280' })
  @IsString()
  secondary: string;

  @ApiProperty({ description: 'Background color (hex)', example: '#ffffff' })
  @IsString()
  background: string;

  @ApiProperty({ description: 'Text color (hex)', example: '#1f2937' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ description: 'Accent color (hex)', example: '#f43f5e' })
  @IsOptional()
  @IsString()
  accent?: string;
}

export class FontsDto {
  @ApiProperty({ description: 'Heading font', example: 'Inter, sans-serif' })
  @IsString()
  heading: string;

  @ApiProperty({ description: 'Body font', example: 'Inter, sans-serif' })
  @IsString()
  body: string;
}

export class LayoutDto {
  @ApiProperty({ description: 'Header style', enum: HeaderStyle })
  @IsEnum(HeaderStyle)
  headerStyle: HeaderStyle;

  @ApiProperty({ description: 'Footer style', enum: FooterStyle })
  @IsEnum(FooterStyle)
  footerStyle: FooterStyle;

  @ApiProperty({ description: 'Content width', enum: ContentWidth })
  @IsEnum(ContentWidth)
  contentWidth: ContentWidth;
}

export class AnimationsDto {
  @ApiPropertyOptional({ description: 'Page transition effect', example: 'fade' })
  @IsOptional()
  @IsString()
  pageTransition?: string;

  @ApiPropertyOptional({ description: 'Enable element animations', default: false })
  @IsOptional()
  @IsBoolean()
  elementAnimations?: boolean;
}

export class ThemeSettingsDto {
  @ApiProperty({ description: 'Color settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => ColorsDto)
  colors: ColorsDto;

  @ApiProperty({ description: 'Font settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => FontsDto)
  fonts: FontsDto;

  @ApiProperty({ description: 'Layout settings' })
  @IsObject()
  @ValidateNested()
  @Type(() => LayoutDto)
  layout: LayoutDto;

  @ApiPropertyOptional({ description: 'Animation settings' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AnimationsDto)
  animations?: AnimationsDto;
}
