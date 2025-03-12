import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  IsObject,
  IsBoolean,
  Matches,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStaffDto {
  @ApiProperty({
    description: 'Staff email address',
    example: 'staff@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Staff password',
    example: 'Password123!',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  })
  password: string;

  @ApiProperty({
    description: 'Staff first name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Staff last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Staff permissions',
    example: {
      'users:read': true,
      'users:write': false,
      'appointments:read': true,
      'appointments:write': true,
    },
  })
  @IsObject({ message: 'Permissions must be an object' })
  @IsOptional()
  permissions?: Record<string, boolean>;

  @ApiPropertyOptional({
    description: 'Staff department',
    example: 'Sales',
  })
  @IsString({ message: 'Department must be a string' })
  @IsOptional()
  department?: string;

  @ApiPropertyOptional({
    description: 'Staff position',
    example: 'Account Manager',
  })
  @IsString({ message: 'Position must be a string' })
  @IsOptional()
  position?: string;

  @ApiPropertyOptional({
    description: 'Staff employee ID',
    example: 'EMP001',
  })
  @IsString({ message: 'Employee ID must be a string' })
  @IsOptional()
  employeeId?: string;

  @ApiPropertyOptional({
    description: 'Staff hire date',
    example: '2023-01-01',
  })
  @IsDateString({}, { message: 'Hire date must be a valid date string' })
  @IsOptional()
  hireDate?: string;

  @ApiPropertyOptional({
    description: 'Staff active status',
    default: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Staff avatar URL',
    example: 'https://example.com/avatar.jpg',
  })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Staff phone number',
    example: '+1234567890',
  })
  @IsString({ message: 'Phone must be a string' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Staff address',
    example: '123 Main St, Anytown, USA',
  })
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address?: string;
}
