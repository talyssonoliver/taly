import {
	type PipeTransform,
	Injectable,
	type ArgumentMetadata,
	BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
	transform(value: string, metadata: ArgumentMetadata): number {
		const val = Number.parseInt(value, 10);

		if (Number.isNaN(val)) {
			throw new BadRequestException(
				`Validation failed. "${value}" is not an integer.`,
			);
		}

		return val;
	}
}