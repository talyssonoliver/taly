import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RefreshTokenDto {
	userId: string;

	@ApiProperty({
		description: "JWT refresh token",
		example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
	})
	@IsString({ message: "Refresh token must be a string" })
	@IsNotEmpty({ message: "Refresh token is required" })
	refreshToken: string;
}
