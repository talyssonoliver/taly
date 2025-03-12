import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  Min,
  Max,
  IsUrl,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateServiceDto {
  @ApiPropertyOptional({
    description: 'Service name',
    example: 'Haircut',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Service description',
    example: 'Professional haircut with consultation',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Service price',
    example: 50.00,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    description: 'Service duration in minutes',
    example: 30,
    minimum: 5,
    maximum: 480, // 8 hours max
  })
  @IsNumber()
  @IsPositive()
  @Min(5)
  @Max(480)
  @IsOptional()
  @Type(() => Number)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Service image URL',
    example: 'https://example.com/haircut.jpg',
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Service category',
    example: 'Hair',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Is service active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
