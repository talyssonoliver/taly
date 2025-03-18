import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { Role } from "../../common/enums/roles.enum";

// Define the Staff entity interface
interface StaffEntity {
	id: string;
	userId: string;
	department?: string;
	position?: string;
	employeeId?: string;
	hireDate?: Date;
}

// Define the User entity interface
interface UserEntity {
	id: string;
	email: string;
	firstName: string;
	lastName?: string;
	role: Role;
	isActive: boolean;
	avatar?: string;
	phone?: string;
	address?: string;
	provider?: string;
	providerId?: string;
	createdAt: Date;
	updatedAt: Date;
	staff?: StaffEntity;
	password: string;
}

// Use proper typing for staff data
class StaffDto {
	@ApiProperty({ description: "Staff ID" })
	id: string;

	@ApiProperty({ description: "User ID of staff member" })
	userId: string;

	@ApiPropertyOptional({
		description: "Department the staff member belongs to",
	})
	department?: string;

	@ApiPropertyOptional({ description: "Job position or title" })
	position?: string;

	@ApiPropertyOptional({ description: "Company-specific employee identifier" })
	employeeId?: string;

	@ApiPropertyOptional({ description: "Date when staff member was hired" })
	hireDate?: Date;
}

export class UserResponseDto {
	@ApiProperty({
		description: "User ID",
		example: "12345",
	})
	id: string;

	@ApiProperty({
		description: "User email address",
		example: "user@example.com",
	})
	email: string;

	@ApiProperty({
		description: "User first name",
		example: "John",
	})
	firstName: string;

	@ApiPropertyOptional({
		description: "User last name",
		example: "Doe",
	})
	lastName?: string;

	@ApiProperty({
		description: "User role",
		enum: Role,
		example: Role.USER,
	})
	role: Role;

	@ApiProperty({
		description: "User active status",
		example: true,
	})
	isActive: boolean;

	@ApiPropertyOptional({
		description: "User avatar URL",
		example: "https://example.com/avatar.jpg",
	})
	avatar?: string;

	@ApiPropertyOptional({
		description: "User phone number",
		example: "+1234567890",
	})
	phone?: string;

	@ApiPropertyOptional({
		description: "User address",
		example: "123 Main St, Anytown, USA",
	})
	address?: string;

	@ApiPropertyOptional({
		description: "OAuth provider (e.g., Google, Facebook)",
	})
	provider?: string;

	@ApiPropertyOptional({
		description: "ID from OAuth provider",
	})
	providerId?: string;

	@ApiProperty({
		description: "User creation date",
		example: "2023-01-01T00:00:00Z",
	})
	createdAt: Date;

	@ApiProperty({
		description: "User last update date",
		example: "2023-01-01T00:00:00Z",
	})
	updatedAt: Date;

	@ApiPropertyOptional({
		description: "Staff information (if applicable)",
		type: StaffDto,
	})
	@Type(() => StaffDto)
	staff?: StaffDto;

	@Exclude()
	password: string;

	@ApiProperty({
		description: "User full name",
		example: "John Doe",
	})
	@Expose()
	get fullName(): string {
		if (this.firstName && this.lastName) {
			return `${this.firstName} ${this.lastName}`;
		}

		if (this.firstName) {
			return this.firstName;
		}

		return "";
	}

	static fromEntity(entity: UserEntity): UserResponseDto {
		const dto = new UserResponseDto();
		Object.assign(dto, {
			id: entity.id,
			email: entity.email,
			firstName: entity.firstName,
			lastName: entity.lastName,
			role: entity.role,
			isActive: entity.isActive,
			avatar: entity.avatar,
			phone: entity.phone,
			address: entity.address,
			provider: entity.provider,
			providerId: entity.providerId,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
			staff: entity.staff,
		});
		return dto;
	}
}