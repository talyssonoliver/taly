import { ApiProperty } from "@nestjs/swagger";

/**
 * Base DTO with common properties for all entities
 * Used for documentation purposes and type definition.
 */
export class BaseDto {
	@ApiProperty({
		description: "Unique identifier",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	id: string;

	@ApiProperty({
		description: "Creation timestamp",
		example: "2023-05-15T14:30:00Z",
	})
	createdAt: Date;

	@ApiProperty({
		description: "Last update timestamp",
		example: "2023-05-15T15:30:00Z",
	})
	updatedAt: Date;
}