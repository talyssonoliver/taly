import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ErrorResponseDto {
	@ApiProperty({
		description: "HTTP status code",
		example: 400,
	})
	statusCode: number;

	@ApiProperty({
		description: "Error message",
		example: "Bad Request",
	})
	error: string;

	@ApiProperty({
		description: "Error description",
		example: "Validation failed",
	})
	message: string;

	@ApiPropertyOptional({
		description: "Validation errors detail",
		example: {
			email: "Must be a valid email address",
			password: "Password must be at least 8 characters long",
		},
	})
	errors?: Record<string, string>;

	@ApiProperty({
		description: "Timestamp",
		example: "2023-05-15T14:30:00Z",
	})
	timestamp: string;

	@ApiProperty({
		description: "Request path",
		example: "/api/auth/register",
	})
	path: string;
}