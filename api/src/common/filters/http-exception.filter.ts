import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const errorMessage =
      typeof errorResponse === 'object' &&
      'message' in errorResponse &&
      errorResponse.message
        ? errorResponse.message
        : exception.message;

    const error =
      typeof errorResponse === 'object' &&
      'error' in errorResponse &&
      errorResponse.error
        ? errorResponse.error
        : HttpStatus[status];

    const responseBody = {
      statusCode: status,
      error,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      ${request.method}   - ,
    );

    response.status(status).json(responseBody);
  }
}
