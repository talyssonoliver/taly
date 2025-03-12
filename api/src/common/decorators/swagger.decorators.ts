import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

export const ApiAuth = () => applyDecorators(ApiBearerAuth());

export const ApiDoc = (summary: string, description?: string) =>
  applyDecorators(
    ApiOperation({
      summary,
      description,
    }),
  );

export const ApiResponseDoc = (
  status: number,
  description: string,
  type?: any,
) => {
  switch (status) {
    case 200:
      return applyDecorators(
        ApiOkResponse({
          description,
          type,
        }),
      );
    case 201:
      return applyDecorators(
        ApiCreatedResponse({
          description,
          type,
        }),
      );
    case 204:
      return applyDecorators(
        ApiNoContentResponse({
          description,
        }),
      );
    case 401:
      return applyDecorators(
        ApiUnauthorizedResponse({
          description,
        }),
      );
    case 403:
      return applyDecorators(
        ApiForbiddenResponse({
          description,
        }),
      );
    case 404:
      return applyDecorators(
        ApiNotFoundResponse({
          description,
        }),
      );
    case 500:
      return applyDecorators(
        ApiInternalServerErrorResponse({
          description,
        }),
      );
    default:
      return applyDecorators(
        ApiResponse({
          status,
          description,
          type,
        }),
      );
  }
};
