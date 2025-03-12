import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationTemplateDto {
  @ApiProperty({
    description: 'Template unique key identifier',
    example: 'appointment-confirmation',
  })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Type of notification this template is for',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Name of the template',
    example: 'Appointment Confirmation Email',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the template',
    example: 'Email sent to customers when their appointment is confirmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Subject line (for email templates)',
    example: 'Your appointment has been confirmed',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description: 'Content of the template',
    example: '<h1>Your appointment is confirmed</h1><p>Dear {{name}},</p>...',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Whether this template is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Default variables for the template',
    example: { companyName: 'Our Company', supportEmail: 'support@example.com' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  defaultVariables?: Record<string, any>;
}

export class UpdateNotificationTemplateDto {
  @ApiProperty({
    description: 'Name of the template',
    example: 'Appointment Confirmation Email',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Description of the template',
    example: 'Email sent to customers when their appointment is confirmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Subject line (for email templates)',
    example: 'Your appointment has been confirmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Content of the template',
    example: '<h1>Your appointment is confirmed</h1><p>Dear {{name}},</p>...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Whether this template is active',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Default variables for the template',
    example: { companyName: 'Our Company', supportEmail: 'support@example.com' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  defaultVariables?: Record<string, any>;
}
