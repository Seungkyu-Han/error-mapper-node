import { Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpErrorMappingDefinition } from '../types/http-error-definition.type';
import { Handler } from '../types/handler-function.type';
import { MAP_HTTP_ERROR } from '../symbols/map-http-error.symbol';

export class HttpErrorCacheHelper {
  private readonly cache = new WeakMap<
    object,
    Map<Type<Error>, HttpErrorMappingDefinition>
  >();

  get(
    handler: Handler,
    error: Type<Error>,
    reflector: Reflector,
  ): HttpErrorMappingDefinition | undefined {
    let errorMap = this.cache.get(handler);

    if (!errorMap) {
      const definitions =
        reflector.get<HttpErrorMappingDefinition[]>(MAP_HTTP_ERROR, handler) ??
        [];

      errorMap = new Map(definitions.map((def) => [def.sourceError, def]));

      this.cache.set(handler, errorMap);
    }

    return errorMap.get(error);
  }
}
