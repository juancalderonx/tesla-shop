import { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';

export const CORRELATION_ID_HEADER = 'X-Correlation-Id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = randomUUID();

    req[CORRELATION_ID_HEADER] = id;
    res.set(CORRELATION_ID_HEADER, id);

    next();
  }
}
