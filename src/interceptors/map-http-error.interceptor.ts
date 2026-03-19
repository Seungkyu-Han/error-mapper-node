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
import { HttpErrorDefinition } from '../types/http-error-definition.type';
import { MAP_HTTP_ERROR } from '../symbols/map-http-error.symbol';

@Injectable()
export class MapHttpErrorInterceptor implements NestInterceptor {
  private readonly cache = new WeakMap<
    object,
    Map<Type<Error>, HttpErrorDefinition>
  >();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (!(err instanceof Error)) return throwError(() => err);

        const handler = context.getHandler();

        let errorMap = this.cache.get(handler);

        if (!errorMap) {
          const definitions =
            this.reflector.get<HttpErrorDefinition[]>(
              MAP_HTTP_ERROR,
              handler,
            ) ?? [];

          errorMap = new Map(definitions.map((def) => [def.error, def]));

          this.cache.set(handler, errorMap);
        }

        const mapping = errorMap.get(err.constructor as Type<Error>);

        if (mapping) {
          const message = mapping.message ?? err.message;
          return throwError(() => new HttpException(message, mapping.status));
        }

        return throwError(() => err);
      }),
    );
  }
}
