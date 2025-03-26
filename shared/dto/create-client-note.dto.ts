import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientNoteDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Client ID is required' })
  clientId: string;

  @ApiProperty({
    description: 'Note content',
    example: 'Client mentioned preference for natural hair products.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty({ message: 'Note content is required' })
  @MaxLength(1000, { message: 'Note cannot exceed 1000 characters' })
  note: string;

  @ApiProperty({
    description: 'Created by user ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'Creator ID is required' })
  createdBy: string;
}