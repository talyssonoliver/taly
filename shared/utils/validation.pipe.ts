import {
  Injectable,
  type PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import type { ZodSchema } from "zod";

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema<unknown>) {}

  transform(value: unknown): unknown {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException("Validation failed");
    }
    return result.data;
  }
}
export default ZodValidationPipe;
