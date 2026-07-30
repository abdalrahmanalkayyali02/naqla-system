import { ErrorKind } from '../enums/error-kind.js'
import { AppError } from './app-error.js'

export interface IResult {
  readonly isSuccess: boolean
  readonly isFailure: boolean
  readonly errors: ReadonlyArray<AppError>
  readonly statusCode: number
}
    
function mapToStatusCode(type?: ErrorKind): number {
  switch (type) {
    case ErrorKind.Validation:
      return 400
    case ErrorKind.NotFound:
      return 404
    case ErrorKind.Conflict:
      return 409
    case ErrorKind.Unauthorized:
      return 401
    case ErrorKind.Forbidden:
      return 403
    default:
      return 500
  }
}

export class Result<T = void> implements IResult {
  private readonly _value: T | undefined
  readonly isSuccess: boolean
  readonly isFailure: boolean
  readonly errors: ReadonlyArray<AppError>
  readonly statusCode: number

  protected constructor(
    value: T | undefined,
    isSuccess: boolean,
    errors: AppError[],
    successStatusCode = 200,
  ) {
    this._value = value
    this.isSuccess = isSuccess
    this.isFailure = !isSuccess
    this.errors = Object.freeze([...errors])
    this.statusCode = isSuccess ? successStatusCode : mapToStatusCode(errors[0]?.type)
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot access value on a failed result.')
    }
    return this._value as T
  }

  match<TOut>(
    onSuccess: (value: T) => TOut,
    onFailure: (errors: ReadonlyArray<AppError>) => TOut,
  ): TOut {
    return this.isSuccess ? onSuccess(this._value as T) : onFailure(this.errors)
  }

  static ok(): Result<void>
  static ok<T>(value: T): Result<T>
  static ok<T = void>(value?: T): Result<T> {
    return new Result<T>(value, true, [])
  }

  static created<T>(value: T): Result<T> {
    return new Result<T>(value, true, [], 201)
  }

  static fail<T = never>(errorOrErrors: AppError | ReadonlyArray<AppError>): Result<T> {
    const errors = Array.isArray(errorOrErrors) ? [...errorOrErrors] : [errorOrErrors as AppError]
    return new Result<T>(undefined as unknown as T, false, errors)
  }
}
