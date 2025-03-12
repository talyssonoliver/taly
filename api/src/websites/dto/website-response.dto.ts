import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ThemeSettingsDto } from './theme-settings.dto';
import { CustomDomainDto } from './custom-domain.dto';

class ThemeDto {
  @ApiProperty({ description: 'Theme ID' })
  id: string;

  @ApiProperty({ description: 'Theme name' })
  name: string;

  @ApiPropertyOptional({ description: 'Theme description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Theme thumbnail URL' })
  thumbnail?: string;
}

class UserDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiPropertyOptional({ description: 'User last name' })
  lastName?: string;
}

export class WebsiteResponseDto {
  @ApiProperty({ description: 'Website ID' })
  id: string;

  @ApiProperty({ description: 'Website name' })
  name: string;

  @ApiPropertyOptional({ description: 'Website description' })
  description?: string;

  @ApiProperty({ description: 'Theme ID' })
  themeId: string;

  @ApiProperty({ description: 'Is website published' })
  isPublished: boolean;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Website URL' })
  url: string;

  @ApiProperty({ description: 'Theme settings' })
  @Type(() => ThemeSettingsDto)
  themeSettings: ThemeSettingsDto;

  @ApiPropertyOptional({ description: 'Custom domain information' })
  @Type(() => CustomDomainDto)
  customDomain?: CustomDomainDto;

  @ApiProperty({ description: 'Theme information' })
  @Type(() => ThemeDto)
  theme: ThemeDto;

  @ApiProperty({ description: 'User information' })
  @Type(() => UserDto)
  user: UserDto;
  
  @ApiPropertyOptional({ description: 'Published date' })
  publishedAt?: Date;
  
  @ApiProperty({ description: 'Full website URL' })
  @Expose()
  get fullUrl(): string {
    if (this.customDomain && this.customDomain.status === 'active') {
      return `https://${this.customDomain.domain}`;
    }
    return this.url;
  }
  
  static fromEntity(entity: any): WebsiteResponseDto {
    const dto = new WebsiteResponseDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.themeId = entity.themeId;
    dto.isPublished = entity.isPublished;
    dto.userId = entity.userId;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    dto.url = entity.url;
    dto.themeSettings = entity.themeSettings;
    dto.customDomain = entity.customDomain;
    dto.publishedAt = entity.publishedAt;
    dto.theme = entity.theme;
    dto.user = entity.user;
    return dto;
  }
}
