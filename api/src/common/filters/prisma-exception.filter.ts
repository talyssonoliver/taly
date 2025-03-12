import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    switch (exception.code) {
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        const field = exception.meta?.target as string[];
        message = Unique constraint violation: ;
        break;
      }
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        message = Foreign key constraint violation;
        break;
      }
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = Record not found;
        break;
      }
      default:
        message = Database error: ;
    }

    const responseBody = {
      statusCode: status,
      error: HttpStatus[status],
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      ${request.method}   -  (),
    );

    response.status(status).json(responseBody);
  }
}
