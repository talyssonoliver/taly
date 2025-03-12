import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '../entities/client.entity';
import { Expose, Type } from 'class-transformer';

class SalonDto {
  @ApiProperty({ description: 'Salon ID' })
  id: string;

  @ApiProperty({ description: 'Salon name' })
  name: string;
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

export class ClientResponseDto {
  @ApiProperty({ description: 'Client ID' })
  id: string;

  @ApiProperty({ description: 'Salon ID' })
  salonId: string;

  @ApiPropertyOptional({ description: 'User ID' })
  userId?: string;

  @ApiProperty({ description: 'Client first name' })
  firstName: string;

  @ApiProperty({ description: 'Client last name' })
  lastName: string;

  @ApiProperty({ description: 'Client email' })
  email: string;

  @ApiPropertyOptional({ description: 'Client phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Client address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Client city' })
  city?: string;

  @ApiPropertyOptional({ description: 'Client state/province' })
  state?: string;

  @ApiPropertyOptional({ description: 'Client zip/postal code' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Client birthdate' })
  birthdate?: Date;

  @ApiPropertyOptional({ 
    description: 'Client gender',
    enum: Gender,
  })
  gender?: Gender;

  @ApiPropertyOptional({ description: 'How the client found about the salon' })
  referralSource?: string;

  @ApiPropertyOptional({ 
    description: 'Tags for categorizing the client',
    type: [String],
  })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Additional notes about the client' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Client preferences' })
  preferences?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Medical information' })
  medicalInfo?: Record<string, any>;

  @ApiProperty({ description: 'Salon information' })
  @Type(() => SalonDto)
  salon: SalonDto;

  @ApiPropertyOptional({ description: 'User information if linked' })
  @Type(() => UserDto)
  user?: UserDto;

  @ApiProperty({ description: 'Number of notes' })
  _count: {
    notes: number;
  };

  @ApiProperty({ description: 'Client creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Client last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Client full name' })
  @Expose()
  get fullName(): string {
    return ${this.firstName} ;
  }

  @ApiProperty({ description: 'Client full address' })
  @Expose()
  get fullAddress(): string | null {
    const parts = [];
    if (this.address) parts.push(this.address);
    if (this.city) parts.push(this.city);
    if (this.state) parts.push(this.state);
    if (this.zipCode) parts.push(this.zipCode);
    
    return parts.length > 0 ? parts.join(', ') : null;
  }

  @ApiProperty({ description: 'Client age' })
  @Expose()
  get age(): number | null {
    if (!this.birthdate) return null;
    
    const today = new Date();
    const birthDate = new Date(this.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  @ApiProperty({ description: 'Has user account' })
  @Expose()
  get hasUserAccount(): boolean {
    return !!this.userId;
  }
}
