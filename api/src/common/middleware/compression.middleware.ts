import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as compression from 'compression';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  private compressionFilter = (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Compress responses larger than 1KB
    return compression.filter(req, res);
  };

  private compressionOptions = {
    filter: this.compressionFilter,
    level: 6, // compression level
    threshold: 1024, // compress responses larger than 1KB
  };

  use(req: Request, res: Response, next: NextFunction) {
    const compressionMiddleware = compression(this.compressionOptions);
    compressionMiddleware(req, res, next);
  }
}
