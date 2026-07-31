// src/common/handle-result.ts

import type { Request, Response } from 'express';
import { ErrorKind, Result } from '../Result';

export function handleResult<T>(req: Request, res: Response, result: Result<T>): void {
  const response: Record<string, unknown> = {
    isSuccess: result.isSuccess,
    timestamp: new Date().toISOString(),
    statusCode: result.statusCode,
    traceId: (req as Request & { id?: string }).id ?? req.headers['x-request-id'] ?? undefined,
  };

  result.match(
    (value) => {
      if (value !== undefined) {
        response.data = value;
      }
    },
    (errors) => {
      const primaryError = errors[0];
      if (primaryError) {
        response.errors = {
          title: primaryError.title,
          type: getTypeUri(primaryError.type),
          detailEn: primaryError.descriptionEn,
          detailAr: primaryError.descriptionAr,
          instance: req.path,
          code: primaryError.code,
          ...(primaryError.extensions ? { extensions: primaryError.extensions } : {}),
          // Attach all accumulated domain errors under details if multiple exist
          details: errors.map((err) => ({
            code: err.code,
            detailEn: err.descriptionEn,
            detailAr: err.descriptionAr,
          })),
        };
      }
    },
  );

  res.status(result.statusCode).json(response);
}

function getTypeUri(type: ErrorKind): string {
  switch (type) {
    case ErrorKind.Validation:
      return 'https://tools.ietf.org/html/rfc7231#section-6.5.1';
    case ErrorKind.NotFound:
      return 'https://tools.ietf.org/html/rfc7231#section-6.5.4';
    case ErrorKind.Conflict:
      return 'https://tools.ietf.org/html/rfc7231#section-6.5.8';
    case ErrorKind.Unauthorized:
      return 'https://tools.ietf.org/html/rfc7235#section-3.1';
    case ErrorKind.Forbidden:
      return 'https://tools.ietf.org/html/rfc7235#section-3.1';
    default:
      return 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
  }
}