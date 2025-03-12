import { IsNotEmpty, IsString, IsOptional, IsEmail, IsArray, IsEnum, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../entities/notification.entity';

export class Recipient {
  @ApiProperty({
    description: 'Recipient user ID',
    example: '5f8d0f3c-ebc6-4dec-a9fa-e7a8ed6d28b8',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({
    description: 'Recipient email address',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Recipient phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Device token for push notifications',
    example: 'exampleDeviceToken123',
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceToken?: string;
}

export class SendNotificationDto {
  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.EMAIL,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Template key to use',
    example: 'appointment-confirmation',
  })
  @IsNotEmpty()
  @IsString()
  templateKey: string;

  @ApiProperty({
    description: 'Recipients',
    type: [Recipient],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Recipient)
  recipients: Recipient[];

  @ApiProperty({
    description: 'Data to populate the template',
    example: {
      appointment: {
        date: '2023-10-15',
        time: '14:30',
        service: 'Consultation'
      },
      customer: {
        name: 'John Doe'
      }
    },
  })
  @IsNotEmpty()
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({
    description: 'Subject line (for email notifications)',
    example: 'Your appointment has been confirmed',
    required: false,
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiProperty({
    description: 'Priority level',
    example: 'high',
    required: false,
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { category: 'appointments' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
