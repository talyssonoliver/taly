import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  CacheInterceptor,
  CACHE_KEY_METADATA,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const { httpAdapter } = this.httpAdapterHost;
    const isGetRequest = httpAdapter.getRequestMethod(request) === 'GET';
    const excludePaths = ['/auth/'];

    // Don't cache if it's not a GET request
    if (!isGetRequest) {
      return undefined;
    }

    // Don't cache if it's in the excluded paths
    const requestUrl = httpAdapter.getRequestUrl(request);
    if (excludePaths.some((path) => requestUrl.includes(path))) {
      return undefined;
    }

    // Use custom cache key if provided via @CacheKey decorator
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (cacheKey) {
      return cacheKey;
    }

    // Generate cache key based on URL and query parameters
    const queryParams = request.query ? new URLSearchParams(request.query).toString() : '';
    return ${requestUrl}?;
  }
}
