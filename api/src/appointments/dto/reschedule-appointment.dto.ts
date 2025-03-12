import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RescheduleAppointmentDto {
  @ApiProperty({
    description: 'New appointment start time',
    example: '2023-05-16T15:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiPropertyOptional({
    description: 'New staff member ID',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsOptional()
  @IsUUID()
  staffId?: string;
}
