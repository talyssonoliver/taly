/**
 * Template for Data Transfer Objects
 * 
 * Naming Convention: Use verb-noun format (e.g., CreateUserDto, UpdateClientDto)
 * Fields: Should match entity properties with appropriate adaptations
 * Validation: Use class-validator decorators for all fields
 * Documentation: Use Swagger ApiProperty decorators for all fields
 */
export class TemplateDto {
  @ApiProperty({
    description: 'Clear description of the field purpose',
    example: 'Example value',
    required: true, // Set to false for optional properties
  })
  @IsString({ message: 'Field must be a string' })
  @IsNotEmpty({ message: 'Field is required' })
  requiredStringField: string;

  @ApiProperty({
    description: 'Description of optional field',
    example: 'Optional example',
    required: false,
  })
  @IsString({ message: 'Field must be a string' })
  @IsOptional()
  optionalStringField?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Numeric value',
    example: 100,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Field must be a number' })
  @Min(1, { message: 'Minimum value is 1' })
  @IsOptional()
  numericField?: number;

  @ApiProperty({
    description: 'Date-time value',
    example: '2023-01-01T12:00:00Z',
  })
  @IsDateString({}, { message: 'Please provide a valid ISO date string' })
  @IsNotEmpty({ message: 'Date is required' })
  dateField: string;

  @ApiProperty({
    description: 'Selection from predefined options',
    enum: ['OPTION_A', 'OPTION_B', 'OPTION_C'],
    example: 'OPTION_A',
  })
  @IsEnum(['OPTION_A', 'OPTION_B', 'OPTION_C'], { 
    message: 'Value must be one of: OPTION_A, OPTION_B, OPTION_C' 
  })
  @IsNotEmpty({ message: 'Option is required' })
  enumField: string;
}