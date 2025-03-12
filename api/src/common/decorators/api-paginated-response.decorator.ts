import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

export const ApiPaginatedResponse = <T extends Type<any>>(model: T) => {
  return applyDecorators(
    ApiExtraModels(PaginatedResult, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResult) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
