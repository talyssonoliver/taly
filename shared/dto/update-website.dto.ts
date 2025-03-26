import { IsNotEmpty, IsUrl } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateWebsiteDto {
	@ApiProperty({
		description: "Website URL",
		example: "https://elegantcuts-new.example.com",
	})
	@IsUrl({}, { message: "Must be a valid URL" })
	@IsNotEmpty({ message: "URL is required" })
	url: string;
}