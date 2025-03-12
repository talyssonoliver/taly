import {
  type PipeTransform,
  Injectable,
  type ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseBooleanPipe implements PipeTransform<unknown, boolean> {
  transform(value: unknown, metadata: ArgumentMetadata): boolean {
    if (
      value === true ||
      value === 'true' ||
      value === 1 ||
      value === '1' ||
      value === 'yes' ||
      value === 'y'
    ) {
      return true;
    }
    
    if (
      value === false ||
      value === 'false' ||
      value === 0 ||
      value === '0' ||
      value === 'no' ||
      value === 'n'
    ) {
      return false;
    }
    
    throw new BadRequestException(`Validation failed. "${value}" is not a valid boolean value.`);
  }
}
