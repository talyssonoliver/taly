import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseMessage } from '../interfaces/response-message.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ResponseMessage<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseMessage<T>> {
    return next.handle().pipe(
      map((data) => {
        // Skip transformation for certain response types
        if (data && (data.buffer || data.pipe)) {
          return data;
        }
        
        const statusCode = context.switchToHttp().getResponse().statusCode;
        
        return {
          statusCode,
          message: this.getDefaultMessage(statusCode),
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Success';
      case 201:
        return 'Created successfully';
      case 204:
        return 'No content';
      default:
        return 'Operation completed';
    }
  }
}
