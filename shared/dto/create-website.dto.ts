import { IsNotEmpty, IsString, IsUrl, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWebsiteDto {
	@ApiProperty({
		description: "Salon ID",
		example: "123e4567-e89b-12d3-a456-426614174000",
	})
	@IsUUID()
	@IsNotEmpty({ message: "Salon ID is required" })
	salonId: string;

	@ApiProperty({
		description: "Website URL",
		example: "https://elegantcuts.example.com",
	})
	@IsUrl({}, { message: "Must be a valid URL" })
	@IsNotEmpty({ message: "URL is required" })
	url: string;
}