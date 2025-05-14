import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logsService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const user = req['user'];
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;

      this.logsService.addLog({
        userId: user?.id ?? '',
        endpoint: originalUrl,
        method,
        statusCode,
        description: `${method} in ${originalUrl}. Done in ${duration}ms`,
      });
    });

    next();
  }
}
