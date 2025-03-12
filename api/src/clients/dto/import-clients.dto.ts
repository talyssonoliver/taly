import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ImportClientsDto {
  @ApiProperty({
    description: 'Salon ID to associate clients with',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  salonId: string;
}
