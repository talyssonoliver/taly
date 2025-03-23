import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ServiceResponseDto } from './service-response.dto';

class OwnerDto {
  @ApiProperty({ description: 'Owner ID' })
  id: string;

  @ApiProperty({ description: 'Owner email' })
  email: string;

  @ApiProperty({ description: 'Owner first name' })
  firstName: string;

  @ApiPropertyOptional({ description: 'Owner last name' })
  lastName?: string;

  @ApiProperty({ description: 'Owner full name' })
  @Expose()
  get fullName(): string {
    if (this.firstName && this.lastName) {
      return ${this.firstName} ;
    }
    return this.firstName;
  }
}

export class SalonResponseDto {
  @ApiProperty({ description: 'Salon ID' })
  id: string;

  @ApiProperty({ description: 'Salon name' })
  name: string;

  @ApiPropertyOptional({ description: 'Salon description' })
  description?: string;

  @ApiPropertyOptional({ description: 'Salon address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Salon city' })
  city?: string;

  @ApiPropertyOptional({ description: 'Salon state/province' })
  state?: string;

  @ApiPropertyOptional({ description: 'Salon zip/postal code' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Salon country' })
  country?: string;

  @ApiPropertyOptional({ description: 'Salon phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Salon email address' })
  email?: string;

  @ApiPropertyOptional({ description: 'Salon website' })
  website?: string;

  @ApiPropertyOptional({ description: 'Salon latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Salon longitude' })
  longitude?: number;

  @ApiPropertyOptional({ description: 'Salon cover image URL' })
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Salon logo image URL' })
  logoImage?: string;

  @ApiPropertyOptional({ 
    description: 'Salon gallery images URLs',
    type: [String],
  })
  images?: string[];

  @ApiProperty({ description: 'Is salon active' })
  isActive: boolean;

  @ApiProperty({ description: 'Owner ID' })
  ownerId: string;

  @ApiProperty({ description: 'Salon owner information' })
  @Type(() => OwnerDto)
  owner: OwnerDto;

  @ApiPropertyOptional({
    description: 'Salon services',
    type: [ServiceResponseDto],
  })
  @Type(() => ServiceResponseDto)
  services?: ServiceResponseDto[];

  @ApiProperty({ description: 'Salon creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Salon last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Full salon address' })
  @Expose()
  get fullAddress(): string | null {
    const parts = [];
    if (this.address) parts.push(this.address);
    if (this.city) parts.push(this.city);
    if (this.state) parts.push(this.state);
    if (this.zipCode) parts.push(this.zipCode);
    if (this.country) parts.push(this.country);
    
    return parts.length > 0 ? parts.join(', ') : null;
  }
}
