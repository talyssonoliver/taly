import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { Role } from '../../common/enums/roles.enum';

export class CreateUserDto {
  @ApiProperty({
    description: "User email address",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @ApiProperty({
    description: "User password",
    example: "StrongP@ss123",
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Length(8, 50, { message: 'Password must be between 8 and 50 characters' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character",
  })
  password!: string;

  @ApiProperty({
    description: "User first name",
    example: "John",
  })
  @IsString({ message: "First name must be a string" })
  @IsNotEmpty({ message: "First name is required" })
  firstName!: string;

  @ApiPropertyOptional({
    description: "User last name",
    example: "Doe",
  })
  @IsString({ message: "Last name must be a string" })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: "User role",
    enum: Role,
    default: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: "User active status",
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: "Is active must be a boolean" })
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: "User avatar URL",
    example: "https://example.com/avatar.jpg",
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: "User phone number",
    example: "+1234567890",
  })
  @IsOptional()
  @IsString({ message: "Phone must be a string" })
  phone?: string;

  @ApiPropertyOptional({
    description: "User address",
    example: "123 Main St, Anytown, USA",
  })
  @IsOptional()
  @IsString({ message: "Address must be a string" })
  address?: string;
}
