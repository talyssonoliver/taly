import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service ID' })
  id: string;

  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiPropertyOptional({ description: 'Service description' })
  description?: string;

  @ApiProperty({ description: 'Service price' })
  price: number;

  @ApiProperty({ description: 'Service duration in minutes' })
  duration: number;

  @ApiPropertyOptional({ description: 'Service image URL' })
  image?: string;

  @ApiPropertyOptional({ description: 'Service category' })
  category?: string;

  @ApiProperty({ description: 'Is service active' })
  isActive: boolean;

  @ApiProperty({ description: 'Salon ID' })
  salonId: string;

  @ApiPropertyOptional({
    description: 'Salon basic information',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  })
  salon?: {
    id: string;
    name: string;
  };

  @ApiProperty({ description: 'Service creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Service last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Formatted price with currency symbol' })
  get formattedPrice(): string {
    return $;
  }

  @ApiProperty({ description: 'Formatted duration in hours and minutes' })
  get formattedDuration(): string {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    
    if (hours > 0 && minutes > 0) {
      return ${hours}h m;
    } else if (hours > 0) {
      return ${hours}h;
    } else {
      return ${minutes}m;
    }
  }
}
