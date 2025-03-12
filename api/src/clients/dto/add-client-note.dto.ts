import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NoteType } from '../entities/client-note.entity';

export class AddClientNoteDto {
  @ApiProperty({
    description: 'Note content',
    example: 'Client mentioned preference for natural hair products.',
    maxLength: 1000,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiPropertyOptional({
    description: 'Note type',
    enum: NoteType,
    default: NoteType.GENERAL,
  })
  @IsOptional()
  @IsEnum(NoteType)
  type?: NoteType;

  @ApiPropertyOptional({
    description: 'Is this note private (only visible to staff)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
