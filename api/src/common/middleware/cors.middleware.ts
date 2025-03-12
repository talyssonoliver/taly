import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as cors from 'cors';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  private corsOptions = {
    origin: (origin, callback) => {
      const allowedOrigins = this.configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];
      const allowAll = allowedOrigins.includes('*');
      
      if (allowAll || !origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  use(req: Request, res: Response, next: NextFunction) {
    const corsMiddleware = cors(this.corsOptions);
    corsMiddleware(req, res, next);
  }
}
