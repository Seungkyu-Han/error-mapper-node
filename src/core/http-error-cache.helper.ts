import { Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MAP_ERROR } from '../symbols/map-error.symbol';
import { HttpErrorMappingDefinition } from '../types/http-error-definition.type';
import { Handler } from '../types/handler-function.type';

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
        reflector.get<HttpErrorMappingDefinition[]>(MAP_ERROR, handler) ?? [];

      errorMap = new Map(definitions.map((def) => [def.sourceError, def]));

      this.cache.set(handler, errorMap);
    }

    return errorMap.get(error);
  }
}
