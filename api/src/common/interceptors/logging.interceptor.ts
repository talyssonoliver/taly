import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    // Don't log sensitive information
    const sanitizedBody = this.sanitizeData(body);
    const sanitizedQuery = this.sanitizeData(query);

    const now = Date.now();
    this.logger.log(
      Request:   - Body:  - Query:  - Params:  - IP:  - UserAgent: ,
    );

    return next.handle().pipe(
      tap({
        next: (data: any) => {
          const responseData = data?.buffer || data?.pipe ? '[Stream]' : data;
          const sanitizedResponse = this.sanitizeData(responseData);

          this.logger.log(
            Response:   - ms - ,
          );
        },
        error: (error) => {
          this.logger.error(
            Response Error:   - ms - ,
          );
        },
      }),
    );
  }

  private sanitizeData(data: any): any {
    if (!data) return data;
    
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'apiKey'];
    const clone = JSON.parse(JSON.stringify(data));
    
    if (typeof clone === 'object') {
      for (const key of Object.keys(clone)) {
        if (sensitiveFields.includes(key.toLowerCase())) {
          clone[key] = '[REDACTED]';
        } else if (typeof clone[key] === 'object') {
          clone[key] = this.sanitizeData(clone[key]);
        }
      }
    }
    
    return clone;
  }
}
