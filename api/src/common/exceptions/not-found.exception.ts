import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id?: string | number) {
    const message = id
      ? ${entityName} with id  not found
      : ${entityName} not found;
      
    super({
      statusCode: 404,
      error: 'Not Found',
      message,
    });
  }
}
