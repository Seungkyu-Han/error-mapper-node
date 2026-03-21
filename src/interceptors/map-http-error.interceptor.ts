import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorCacheHelper } from '../core/http-error-cache.helper';
import { ErrorCacheHelper } from '../core/error-cache.helper';

@Injectable()
export class MapHttpErrorInterceptor implements NestInterceptor {
  private readonly httpErrorCacheHandler = new HttpErrorCacheHelper();
  private readonly errorCacheHandler = new ErrorCacheHelper();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (!(err instanceof Error)) return throwError(() => err);

        const handler = context.getHandler();

        const mappedError = this.errorCacheHandler.get(
          handler,
          err.constructor as Type<Error>,
          this.reflector,
        );

        if (mappedError) {
          const targetError = new mappedError.targetError(mappedError.message);
          return throwError(() => targetError);
        }

        const mappedHttpError = this.httpErrorCacheHandler.get(
          handler,
          err.constructor as Type<Error>,
          this.reflector,
        );

        if (mappedHttpError) {
          const message = mappedHttpError.message ?? err.message;
          return throwError(
            () => new HttpException(message, mappedHttpError.status),
          );
        }

        return throwError(() => err);
      }),
    );
  }
}
