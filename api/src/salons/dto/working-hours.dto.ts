import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DayOfWeek } from '../entities/working-hours.entity';

export class WorkingHoursDto {
  @ApiProperty({
    description: 'Day of the week',
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
  })
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @ApiPropertyOptional({
    description: 'Opening time (24h format)',
    example: '09:00',
    pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Opening time must be in 24h format (HH:MM)',
  })
  @IsOptional()
  openTime?: string;

  @ApiPropertyOptional({
    description: 'Closing time (24h format)',
    example: '18:00',
    pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Closing time must be in 24h format (HH:MM)',
  })
  @IsOptional()
  closeTime?: string;

  @ApiPropertyOptional({
    description: 'Is salon closed on this day',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;
}
