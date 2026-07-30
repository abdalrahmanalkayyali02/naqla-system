
import { randomUUID } from 'node:crypto'
import { ErrorKind } from '../enums/error-kind'

export class AppError {
  readonly code: string
  readonly title: string
  readonly descriptionAr: string
  readonly descriptionEn: string
  readonly type: ErrorKind
  readonly timestamp: Date
  readonly traceId: string
  readonly extensions?: Record<string, unknown>

  private constructor(
    code: string,
    title: string,
    descriptionAr: string,
    descriptionEn: string,
    type: ErrorKind,
    extensions?: Record<string, unknown>,
  ) {
    this.code = code
    this.title = title
    this.descriptionAr = descriptionAr
    this.descriptionEn = descriptionEn
    this.type = type
    this.extensions = extensions
    this.timestamp = new Date()
    this.traceId = randomUUID()
  }

  static notFound(code: string, descriptionEn: string, descriptionAr: string): AppError {
    return new AppError(code, 'Entity Not Found', descriptionAr, descriptionEn, ErrorKind.NotFound)
  }

  static validation(code: string, descriptionEn: string, descriptionAr: string, extensions?: Record<string, unknown>): AppError {
    return new AppError(code, 'Validation Error', descriptionAr, descriptionEn, ErrorKind.Validation, extensions)
  }

  static conflict(code: string, descriptionEn: string, descriptionAr: string): AppError {
    return new AppError(code, 'Conflict Occurred', descriptionAr, descriptionEn, ErrorKind.Conflict)
  }

  static unauthorized(code: string, descriptionEn: string, descriptionAr: string): AppError {
    return new AppError(code, 'Unauthorized Access', descriptionAr, descriptionEn, ErrorKind.Unauthorized)
  }

  static forbidden(code: string, descriptionEn: string, descriptionAr: string, extensions?: Record<string, unknown>): AppError {
    return new AppError(code, 'Forbidden Access', descriptionAr, descriptionEn, ErrorKind.Forbidden, extensions)
  }

  static failure(code: string, descriptionEn: string, descriptionAr: string): AppError {
    return new AppError(code, 'General Failure', descriptionAr, descriptionEn, ErrorKind.Failure)
  }

  static readonly None: AppError = new AppError('', '', '', '', ErrorKind.Failure)
}