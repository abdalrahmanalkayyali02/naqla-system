// src/common/filters/global-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppError, ErrorKind, Result } from '../Result';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: AppError[] = [];

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (statusCode === HttpStatus.NOT_FOUND) {
        errors = [
          AppError.notFound(
            'ROUTE_NOT_FOUND',
            `Cannot ${request.method} ${request.url}`,
            `المسار المطلوب غير موجود: ${request.method} ${request.url}`,
          ),
        ];
      } else if (statusCode === HttpStatus.BAD_REQUEST) {
        const resObj = exceptionResponse as any;
        const rawMessages: any[] = Array.isArray(resObj.message)
          ? resObj.message
          : [resObj.message || 'Validation failed'];

        errors = rawMessages.map((rawMsg) => {
          if (typeof rawMsg === 'object' && rawMsg !== null) {
            return AppError.validation(
              'VALIDATION_ERROR',
              rawMsg.en || rawMsg.message || 'Validation failed',
              rawMsg.ar || rawMsg.messageAr || 'فشل التحقق من صحة البيانات',
            );
          }

          if (typeof rawMsg === 'string') {
            try {
              const parsed = JSON.parse(rawMsg);
              if (parsed && (parsed.en || parsed.ar)) {
                return AppError.validation(
                  'VALIDATION_ERROR',
                  parsed.en || 'Validation failed',
                  parsed.ar || 'فشل التحقق من صحة البيانات',
                );
              }
            } catch {
              // النص ليس JSON
            }
          }

          return AppError.validation(
            'VALIDATION_ERROR',
            String(rawMsg),
            String(rawMsg),
          );
        });
      } else {
        const resObj = exceptionResponse as any;
        const messageEn =
          typeof resObj === 'string'
            ? resObj
            : resObj.message || 'An HTTP exception occurred';
        const code = resObj.error || this.mapStatusToCode(statusCode);

        errors = [AppError.failure(code, messageEn, messageEn)];
      }
    } else if (exception instanceof Error) {
      console.error('[GlobalExceptionFilter] Unhandled Error:', exception);
      errors = [
        AppError.failure(
          'INTERNAL_SERVER_ERROR',
          exception.message || 'An unexpected internal error occurred.',
          'حدث خطأ غير متوقع في النظام.',
        ),
      ];
    } else {
      errors = [
        AppError.failure(
          'UNKNOWN_ERROR',
          'An unknown error occurred.',
          'حدث خطأ مجهول.',
        ),
      ];
    }

    const failureResult = Result.fail(errors);
    (failureResult as any).statusCode = statusCode;

    this.formatAndSendResponse(request, response, failureResult, statusCode);
  }

  private formatAndSendResponse(
    req: Request,
    res: Response,
    result: Result<any>,
    statusCode: number,
  ): void {
    const traceId =
      (req as Request & { id?: string }).id ??
      (req.headers['x-request-id'] as string) ??
      undefined;

    const responseBody: Record<string, unknown> = {
      isSuccess: false,
      timestamp: new Date().toISOString(),
      statusCode,
      traceId,
    };

    result.match(
      () => {},
      (errors) => {
        // 🔹 أخذ الخطأ الأول فقط وعرضه ككائن مفرد دون مصفوفة details 🔹
        const primaryError = errors[0];
        if (primaryError) {
          responseBody.errors = {
            title: primaryError.title,
            type: this.getTypeUri(primaryError.type),
            detailEn: primaryError.descriptionEn,
            detailAr: primaryError.descriptionAr,
            instance: req.path,
            code: primaryError.code,
            ...(primaryError.extensions ? { extensions: primaryError.extensions } : {}),
          };
        }
      },
    );

    res.status(statusCode).json(responseBody);
  }

  private getTypeUri(type: ErrorKind): string {
    switch (type) {
      case ErrorKind.Validation:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.1';
      case ErrorKind.NotFound:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.4';
      case ErrorKind.Conflict:
        return 'https://tools.ietf.org/html/rfc7231#section-6.5.8';
      case ErrorKind.Unauthorized:
      case ErrorKind.Forbidden:
        return 'https://tools.ietf.org/html/rfc7235#section-3.1';
      default:
        return 'https://tools.ietf.org/html/rfc7231#section-6.6.1';
    }
  }

  private mapStatusToCode(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      default:
        return 'HTTP_ERROR';
    }
  }
}