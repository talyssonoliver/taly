import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(ValidationError)
export class ValidationFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationFilter.name);

  catch(exception: ValidationError[], host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.BAD_REQUEST;

    const validationErrors = this.formatErrors(exception);

    const responseBody = {
      statusCode: status,
      error: 'Bad Request',
      message: 'Validation failed',
      errors: validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      ${request.method}   - Validation errors: ,
    );

    response.status(status).json(responseBody);
  }

  private formatErrors(errors: ValidationError[]) {
    const result = {};
    errors.forEach((error) => {
      const constraints = error.constraints || {};
      result[error.property] = Object.values(constraints)[0];
    });
    return result;
  }
}
